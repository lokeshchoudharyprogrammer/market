const express=  require( 'express');

const  cors = require( "cors")


const app = express();
app.use(cors())

const fetchData = async (url) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return { error: error.message };
  }
};

app.get('/api/data', async (req, res) => {
  const url = 'https://www.nseindia.com/json/option-chain/option-chain.json';
  const data = await fetchData(url);
  res.json(data);
});

app.get('/api/data/option-chain', async (req, res) => {
  const url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
  const data = await fetchData(url);
  res.json(data);
});

app.get('/api/data/marketStatus', async (req, res) => {
    try {
      const url = 'https://www.nseindia.com/api/marketStatus';
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      res.json(data); // Return the fetched data
    } catch (error) {
      console.error('Error fetching market status:', error);
      res.status(500).json({ error: 'Error fetching market status' });
    }
});
  

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
