const path = require('path');
const fs = require('fs');
const { Web3 } = require('web3');
const { TransactionFactory } = require('@ethereumjs/tx');
const { Common } = require('@ethereumjs/common');

// Configuration
const host = "http://localhost:8545";
const privateKey = "0x8f2a55949038a9610f50fb23b5883af3b4ecb3c3bb792cbcefbd1542c692be63";

async function deployContract(contractName, web3, account, constructorArgs = '') {
  console.log(`\nDéploiement de ${contractName}...`);
  
  // Charger le contrat compilé
  const contractJson = JSON.parse(fs.readFileSync(`${contractName}.json`));
  const contractAbi = contractJson.abi;
  const contractBytecode = contractJson.bytecode;

  // Préparer les données de déploiement
  const deployData = '0x' + contractBytecode + constructorArgs;


  const txnCount = await web3.eth.getTransactionCount(account.address);

  const rawTx = {
    nonce: web3.utils.numberToHex(txnCount),
    gasPrice: 0,
    gasLimit: '0x7A1200',
    to: null,
    value: '0x00',
    data: deployData,
    chainId: 1337 // Doit correspondre à votre genesis.json
  };
  console.log("rawTx: ", rawTx);
  console.log("Création de la transaction...");
  const customCommon = Common.custom({ 
    chainId: 1337, // ton chainId local
    baseChain: 'mainnet' // ou autre selon ta config
  });
  
  const tx = TransactionFactory.fromTxData(rawTx, { common: customCommon });
  
  
  console.log("Signature de la transaction...");
  const signedTx = tx.sign(Buffer.from(privateKey.slice(2), 'hex'));

  console.log("Envoi de la transaction...");
  const serializedTx = '0x' + Buffer.from(signedTx.serialize()).toString('hex');
  const receipt = await web3.eth.sendSignedTransaction(serializedTx);
  
  console.log(`${contractName} déployé à : ${receipt.contractAddress}`);
  return receipt.contractAddress;
}

async function main() {
  const web3 = new Web3(host);
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);

  try {
    
    // 1. Déployer GestionDiplome 
    await deployContract('GestionDiplome', web3, account);
    
    console.log("\n✅ Déploiement terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  }
}

main();
