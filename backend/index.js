const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config.json');
const cvtx_abi = require('./abi/cvtx_abi.json');
const alchemy_web3 = require('@alch/alchemy-web3');

const aWeb3 = alchemy_web3.createAlchemyWeb3(config.networks.mumbai.rpc);

const web3_provider = new Web3.providers.HttpProvider(
  config.networks.mumbai.rpc
);
const web3 = new Web3(web3_provider);
const account = web3.eth.accounts.privateKeyToAccount(
  config.networks.mumbai.privateKey
);
web3.eth.accounts.wallet.add(account);
web3.eth.defaultAccount = account.address;

function isValidAddress(address) {
  // TODO:
  // 1. check if address is valid
  return true;
}

function startServer() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text({ type: '*/*' }));
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-requested-with,content-type'
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

  app.get('/info', function (req, res) {
    var ip = req.headers['x-forwarded-for'];
    if (ip == null) {
      ip = req.getRemoteAddr();
    }
    console.log('client IP=', ip);
    res.status(200).json({
      message: 'CarrieVerse Testnet Faucet',
      network: config.networks.mumbai.name,
      rpc: config.networks.mumbai.rpc,
    });
  });

  app.post('/faucets', async (req, res) => {
    try {
      const { to } = req.body;
      console.log(`req.body : ${JSON.stringify(req.body)}`);

      if (isValidAddress(to)) {
        console.log(`to : ${to}`);
        const contractAddress = config.networks.mumbai.tokens.cvtx.address;
        const amount = config.networks.mumbai.tokens.cvtx.payoutamount;

        const contract = new web3.eth.Contract(cvtx_abi, contractAddress);
        const amountWei = web3.utils.toWei(amount.toString(), 'ether');
        const tx = contract.methods.transfer(to, amountWei).encodeABI();

        const transaction = {
          from: account.address,
          to: contractAddress,
          data: tx,
          gas: 200000,
        };

        try {
          const receipt = await web3.eth.sendTransaction(transaction);
          console.log(`receipt.transactionHash : ${receipt.transactionHash}`);
          if (receipt.status === true) {
            res.status(200).json({
              success: true,
              txHash: receipt.transactionHash,
            });
          } else {
            res.status(500).json({
              success: false,
              txHash: 'error',
            });
          }
        } catch (error) {
          console.error('Error sending token', error);
        }
      } else {
        res.status(400).json({ success: false, message: 'Invalid address' });
      }
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  });

  app.listen(config.httpport, () => {
    console.log(`Server listening on port ${config.httpport}`);
  });
}

startServer();
