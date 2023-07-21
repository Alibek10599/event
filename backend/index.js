// index.js
const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config()

const app = express();
const port = 9000;

const { INFURA_RPC_ID } = process.env
const connectDB = require('./db');
const Event = require('./models/event');
const cors = require('cors')

app.use(cors())

// Route for parsing and saving token transfer events to the database
app.get('/parse-events', async (req, res) => {
 
    // Initialize ethers provider for interacting with the Ethereum network
    const provider = new ethers.JsonRpcProvider(`https://mainnet.infura.io/v3/${INFURA_RPC_ID}`);

    const startBlock = 17612968;
    const endBlock = 17612970;

    // Get token transfer events in the specified block range
    const contractAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'; // USDT contract address
    const contractABI = ['event Transfer(address indexed from, address indexed to, uint256 value)'];
    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    const events = await contract.queryFilter('Transfer', startBlock, endBlock);

  for (const event of events) {
    const blockNumber = event.blockNumber;
    const from = event.args.from;
    const to = event.args.to;
    const amount = ethers.formatUnits(event.args.value, 18);

    const newEvent = new Event({ blockNumber, from, to, amount });
    await newEvent.save();
  }

  res.send('Data saved to the database');
});

app.get('/events', async(req, res)=>{
  const pageNumber = req.query.pageNumber;
  const pageSize = req.query.pageSize;

  const skipAmount = (pageNumber - 1) * pageSize; // ccan be ommented out as we are using client side pagination for now
  try {
    const events = await Event.find().skip(skipAmount).limit(pageSize); // can be commented out as we are as we are using client side pagination
    const count = await Event.countDocuments();
    console.log(events);
    res.send({
      events,
      total: count
    })
  } catch (error) {
    console.error('Error retrieving paginated events:', error);
  }
})

const start = async () => {
  try {
      // Connecting to the database
      await connectDB();
      
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
  } catch (error) {
      console.log(error);
      console.log("Failed to connect to the database, server is not running.");
  }
};

start();
