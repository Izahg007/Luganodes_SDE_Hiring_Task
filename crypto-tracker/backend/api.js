const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

const BASE_URL = 'https://api.coingecko.com/api/v3';

app.get('/fetch_coin_info', async (req, res) => {
  try {
    const { coinName, vsCurrency } = req.query;
    if (!coinName || typeof coinName !== 'string') {
      return res.status(400).json({ error: 'Invalid coin name' });
    }

    if (!vsCurrency || typeof vsCurrency !== 'string') {
      return res.status(400).json({ error: 'Invalid vsCurrency' });
    }

    const priceResponse = await axios.get(`${BASE_URL}/simple/price`, {
      params: {
        ids: coinName,
        vs_currencies: vsCurrency
      },
    });

    const infoResponse = await axios.get(`${BASE_URL}/coins/markets`, {
      params: {
        vs_currency: vsCurrency,
        ids: coinName,
        order: 'market_cap_desc',
        per_page: 1,
        page: 1,
        sparkline: false,
      },
    });

    const price = priceResponse.data[coinName]?.[vsCurrency];
    const ticker = infoResponse.data[0]?.symbol;
    const icon = infoResponse.data[0]?.image;
    const currentCoin = coinName;
    if (!price || !ticker || !icon || !currentCoin) {
      return res.status(404).json({ error: 'Coin not found' });
    }

    res.json({ coinName, price, ticker, icon, currentCoin });
  } catch (error) {
    console.error('Error fetching cryptocurrency information:', error.message);
    res.status(500).json({ error: 'Error fetching cryptocurrency information' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
