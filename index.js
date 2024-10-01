const express=  require( 'express');
const fs = require('fs'); // File system module
const path = require('path'); // To handle file paths
const  cors = require( "cors")


// Paths to store option chain data and market status data
const optionChainFilePath = path.join(__dirname, 'optionChainData.json');
const marketStatusFilePath = path.join(__dirname, 'marketStatusData.json');

const app = express();
app.use(cors())

const fetchDatas = async (url) => {
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
  const data = await fetchDatas(url);
  res.json(data);
});

app.get('/api/data/option-chain', async (req, res) => {
  const url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
  const data = await fetchDatas(url);
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
  

// Function to fetch data from a given URL
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

// Helper function to save data to a JSON file
const saveDataToFile = (filePath, data) => {
  try {
    // Write or update the file with new data
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Data successfully saved to ${filePath}`);
  } catch (error) {
    console.error(`Error saving data to file: ${filePath}`, error);
  }
};

// Helper function to read data from a JSON file
const readDataFromFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  }
  return null;
};

// Endpoint to fetch and store option chain data, and return the stored data as JSON
app.get('/api/fetch/option-chain', async (req, res) => {
  const url = 'https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY';
  const data = await fetchData(url);
  
  if (!data.error) {
    saveDataToFile(optionChainFilePath, data); // Store the fetched data in a file (file will be created or updated)
    
    const storedData = readDataFromFile(optionChainFilePath); // Read the stored data
    res.json(storedData); // Return the stored data in JSON format
  } else {
    res.status(500).json({ error: 'Failed to fetch option chain data' });
  }
});

// Endpoint to fetch and store market status data, and return the stored data as JSON
app.get('/api/fetch/marketStatus', async (req, res) => {
  const url = 'https://www.nseindia.com/api/marketStatus';
  const data = await fetchData(url);
  
  if (!data.error) {
    saveDataToFile(marketStatusFilePath, data); // Store the fetched data in a file (file will be created or updated)
    
    const storedData = readDataFromFile(marketStatusFilePath); // Read the stored data
    res.json(storedData); // Return the stored data in JSON format
  } else {
    res.status(500).json({ error: 'Failed to fetch market status data' });
  }
});

// Endpoint to retrieve stored option chain data from the file
app.get('/api/data/stored/option-chain', (req, res) => {
  const storedData = readDataFromFile(optionChainFilePath);
  
  if (storedData) {
    res.json(storedData); // Return the stored data
  } else {
    res.status(404).json({ error: 'Option chain data not found' });
  }
});

// Endpoint to retrieve stored market status data from the file
app.get('/api/data/stored/marketStatus', (req, res) => {
  const storedData = readDataFromFile(marketStatusFilePath);
  
  if (storedData) {
    res.json(storedData); // Return the stored data
  } else {
    res.status(404).json({ error: 'Market status data not found' });
  }
});



const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
