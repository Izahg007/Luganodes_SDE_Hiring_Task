import React, {useState } from 'react';
import axios from 'axios';
import './App.css';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import firebase from './firebase';
import WatchListTable from './WatchListTable';
import CriticalCoins from './CiticalCoins';

function App() {
  const [coinName, setCoinName] = useState('');
  const [currCoin, setCurrCoin] = useState('');
  const [vsCurrency, setVsCurrency] = useState('usd'); // Default value is 'usd'
  const [price, setPrice] = useState('');
  const [ticker, setTicker] = useState('');
  const [icon, setIcon] = useState('');
  const [chartData, setChartData] = useState();
  const [options, setOptions] = useState({
    responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: coinName,
            },
        },
  });
  //for storing the coin's price lowerbound and upperbound in database
  const [lowerBound, setLowerBound] = useState(0);
  const [upperBound, setUpperBound] = useState(20000);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://crypto-tracker-backend-q6h1.onrender.com/fetch_coin_info?coinName=${coinName}&vsCurrency=${vsCurrency}`
      );
      axios
        .get(
          `https://api.coingecko.com/api/v3/coins/${coinName}/market_chart?vs_currency=usd&days=30&interval=daily&precision=full`
          ).then((response) =>{
            console.log(response);
            setChartData({
              labels : response.data.prices.map((price) => {
                return moment.unix(price[0]/1000).format('MM-DD');
              }),
              datasets: [
                {
                  label: 'Dataset 1',
                  data: response.data.prices.map((price) => {
                    return price[1];
                  }),
                  borderColor: 'rgb(255, 99, 132)',
                  backgroundColor: 'rgba(255, 99, 132, 0.5)',
                },
              ],
            })
            setOptions((prevOptions) => ({
              ...prevOptions,
              plugins: {
                ...prevOptions.plugins,
                title: {
                  ...prevOptions.plugins.title,
                  text: coinName,
                },
              },
            }));
          })
      setPrice(response.data.price || 'Not found');
      setTicker(response.data.ticker || '');
      setIcon(response.data.icon || '');
      setCurrCoin(response.data.currentCoin || '');
    } catch (error) {
      console.error('Error fetching cryptocurrency information:', error.message);
      setPrice('');
      setTicker('');
      setIcon('');
    }
  };

  const handleCurrencyChange = (event) => {
    setVsCurrency(event.target.value);
    handleSearch();
  };

  const handleAddCoin = () => {
    const coinsRef = firebase.database().ref('coins');
    const newCoin = {
      name: currCoin,
      lowerBound: parseFloat(lowerBound),
      upperBound: parseFloat(upperBound),
    };
    coinsRef.push(newCoin);
  };

  return (
    <div className="container">
      <div className='critical-coins'>
        <CriticalCoins/>
      </div>
      <h1 className="title">Crypto Price Tracker</h1>
      <div className="centered">
        <input
          type="text"
          placeholder="Enter coin name (e.g., bitcoin)"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value.toLowerCase())}
        />
        
        <select value={vsCurrency} onChange={handleCurrencyChange}>
          <option key="usd" value="usd">United States Dollar (USD)</option>
          <option key="eur" value="eur">Euro (EUR)</option>
          <option key="gpb" value="gbp">British Pound Sterling (GBP)</option>
          <option key="jpy" value="jpy">Japanese Yen (JPY)</option>
          <option key="cad" value="cad">Canadian Dollar (CAD)</option>
          <option key="aud" value="aud">Australian Dollar (AUD)</option>
          <option key="inr" value="inr">Indian Rupee (INR)</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
        {price && price !== 'Not found' && 
        <div className="watchlist-inputs">
        <label htmlFor="lowerBound">Lower Bound:</label>
        <input
          type="number"
          id="lowerBound"
          value={lowerBound}
          onChange={(e) => setLowerBound(e.target.value)}
        />
        <label htmlFor="upperBound">Upper Bound:</label>
        <input
          type="number"
          id="upperBound"
          value={upperBound}
          onChange={(e) => setUpperBound(e.target.value)}
        />
        <button onClick={handleAddCoin}>Add to Watch List</button>
        </div>}
      
      {price !== 'Not found' && (
        <div className="coin-info">
          {icon && <img src={icon} alt="Coin Icon" className="coin-icon" />}
          <p className="price">
            {icon && '  '}
            {ticker.toUpperCase()} {price ? ` : ${price} ${vsCurrency.toUpperCase()}` : ''}
          </p>
        </div>
      )}
      {price === 'Not found' && <p className="error-message">Coin not found</p>}
      {chartData && (
        <div className="chart-container">
          {chartData ? <Line options={options} data={chartData} /> : null}
        </div>
      )}
    <WatchListTable />
    </div>
  );
}

export default App;
