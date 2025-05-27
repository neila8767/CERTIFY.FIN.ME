import Web3 from "web3";

// Connecte à la blockchain locale (Besu sur port 8545)
const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const web3 = new Web3(provider);

export default web3;
