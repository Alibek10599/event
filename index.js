// index.js
const express = require('express');
const mongoose = require('mongoose');
const { ethers } = require('ethers');
require('dotenv').config()

const app = express();
const port = 9000;

const { INFURA_RPC_ID } = process.env


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

    const filter = contract.filters.Transfer();
    filter.fromBlock = "0x" + startBlock.toString(16);
    filter.toBlock = "0x" + endBlock.toString(16);

    const events = await contract.queryFilter('Transfer', startBlock, endBlock);

  // Save events to the MongoDB database
  const Event = mongoose.model('Event', {
    blockNumber: Number,
    from: String,
    to: String,
    amount: String,
  });

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

app.get('/events', async(req, res)=>{})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
