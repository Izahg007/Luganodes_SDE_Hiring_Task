import React, { useEffect, useState } from 'react';
import firebase from './firebase';
import './App.css';

const WatchListTable = () => {
  const [watchList, setWatchList] = useState([]);

  useEffect(() => {
    const coinsRef = firebase.database().ref('coins');
    coinsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const coinsArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setWatchList(coinsArray);
      }
    });
    return () => coinsRef.off('value');
  }, []);

  const handleRemoveCoin = (id) => {
    const coinsRef = firebase.database().ref('coins');
    coinsRef.child(id).remove();
    setWatchList((prevWatchList) => prevWatchList.filter((coin) => coin.id !== id));
  };

  return (
    <div className="watchlist-table">
      <h2>Watch List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Lower Bound</th>
            <th>Upper Bound</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {watchList.map((coin) => (
            <tr key={coin.id}>
              <td>{coin.name}</td>
              <td>{coin.lowerBound}</td>
              <td>{coin.upperBound}</td>
              <td>
                <button onClick={() => handleRemoveCoin(coin.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WatchListTable;
