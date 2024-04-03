const express = require('express');
const Web3 = require('web3');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config.json');
const mg8_abi = require('./abi/mg8_abi.json');
const alchemy_web3 = require('@alch/alchemy-web3');

const aWeb3 = alchemy_web3.createAlchemyWeb3(config.networks.bscTestnet.rpc);

const web3_provider = new Web3.providers.HttpProvider(config.networks.bscTestnet.rpc);
const web3 = new Web3(web3_provider);
const account = web3.eth.accounts.privateKeyToAccount(config.networks.bscTestnet.privateKey);
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
    res.setHeader('Access-Control-Allow-Headers', 'X-requested-with,content-type');
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
      message: 'Megalink Testnet Faucet',
      network: config.networks.bscTestnet.name,
      rpc: config.networks.bscTestnet.rpc,
    });
  });

  app.post('/faucets', async (req, res) => {
    try {
      const { to } = req.body;
      console.log(`req.body : ${JSON.stringify(req.body)}`);

      if (isValidAddress(to)) {
        console.log(`to : ${to}`);
        const privateKey = config.networks.bscTestnet.privateKey;
        const contractAddress = config.networks.bscTestnet.tokens.mg8.address;
        const amount = config.networks.bscTestnet.tokens.mg8.payoutamount;
        const contract = new web3.eth.Contract(mg8_abi, contractAddress);
        const amountWei = web3.utils.toWei(amount.toString(), 'ether');
        const data = contract.methods.transfer(to, amountWei).encodeABI();
        const gasLimit = config.networks.bscTestnet.gasLimit;
        const gasPrice = config.networks.bscTestnet.gasPrice;
        const lnonce = await web3.eth.getTransactionCount(account.address, 'latest');
        const pnonce = await web3.eth.getTransactionCount(account.address, 'pending');
        let nonce = lnonce;
        if (pnonce > nonce) {
          console.log(`pending nonce : ${pnonce}`);
          nonce = pnonce;
        }
        console.log(`nonce is : ${lnonce}`);

        const transaction = {
          nonce: web3.utils.toHex(nonce),
          to: contractAddress,
          data: data,
          gasLimit: web3.utils.toHex(Number(gasLimit)),
          gasPrice: web3.utils.toHex(web3.utils.toWei(gasPrice, 'gwei')),
        };

        try {
          const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
          const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
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
