import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [coinName, setCoinName] = useState('');
  const [price, setPrice] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/prices?coinName=${coinName}`);
      setPrice(response.data[coinName]?.usd || 'Not found');
    } catch (error) {
      console.error('Error fetching price:', error.message);
      setPrice('Error fetching price');
    }
  };

  return (
    <div className="container">
      <h1 className="title">Crypto Price Tracker</h1>
      <div className="centered">
        <input
          type="text"
          placeholder="Enter coin name (e.g., bitcoin)"
          value={coinName}
          onChange={(e) => setCoinName(e.target.value.toLowerCase())}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <p className="price">Price: ${price}</p>
    </div>
  );
}

export default App;
