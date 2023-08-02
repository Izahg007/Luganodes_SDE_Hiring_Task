import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import axios from 'axios';

function CriticalCoins() {
  const [criticalCoins, setCriticalCoins] = useState([]);

  useEffect(() => {
    const fetchCoinsData = async () => {
      try {
        const coinsRef = firebase.database().ref('coins');
        const snapshot = await coinsRef.once('value');
        const data = snapshot.val();

        if (data) {
          const coins = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
          const criticalCoinsData = await fetchCriticalCoins(coins);
          setCriticalCoins(criticalCoinsData);
        }
      } catch (error) {
        console.error('Error fetching coins data from Firebase:', error.message);
      }
    };

    fetchCoinsData();
    const intervalId = setInterval(fetchCoinsData, 120000); // Run every 2 minutes

    return () => clearInterval(intervalId); // Clean up interval when component unmounts
  }, []);

  const fetchCriticalCoins = async (coins) => {
    const criticalCoinsData = [];
    const currentTimestamp = Date.now();

    for (const coin of coins) {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coin.name}&vs_currencies=usd`
        );
        const price = response.data[coin.name]?.usd;

        if (price !== undefined) {
          const isCritical = price < coin.lowerBound || price > coin.upperBound;
          if (isCritical) {
            criticalCoinsData.push({ ...coin, price, timestamp: currentTimestamp });
          }
        }
      } catch (error) {
        console.error('Error fetching price for', coin.name, ':', error.message);
      }
    }

    return criticalCoinsData;
  };

  return (
    <div className="critical-coins">
      <h2>Critical Coins</h2>
      <table>
        <thead>
          <tr>
            <th>Coin Name</th>
            <th>Lower Bound</th>
            <th>Upper Bound</th>
            <th>Price</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {criticalCoins.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.lowerBound}</td>
              <td>{coin.upperBound}</td>
              <td>{coin.price}</td>
              <td>{new Date(coin.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CriticalCoins;
