import Web3 from 'web3'; // ou const Web3 = require('web3') si tu utilises CommonJS

const provider = new Web3.providers.HttpProvider("http://localhost:8545");


const web3 = new Web3(provider);

export default web3; // si tu es en ESM
