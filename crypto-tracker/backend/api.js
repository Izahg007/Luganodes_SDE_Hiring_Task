const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

// Define your API endpoint base URL
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Endpoint to get cryptocurrency prices
app.get('/prices', async (req, res) => {
  try {
    const { coinName } = req.query;

    if (!coinName || typeof coinName !== 'string') {
      return res.status(400).json({ error: 'Invalid coin name' });
    }

    const response = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: coinName,
        vs_currencies: 'usd',
      },
    });

    const price = response.data[coinName]?.usd;

    if (!price) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    res.json({ [coinName]: { usd: price } });
  } catch (error) {
    console.error('Error fetching prices:', error.message);
    res.status(500).json({ error: 'Error fetching prices' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
