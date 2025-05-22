import web3 from './web3.js';
import fs from 'fs';
const GestionDiplome = JSON.parse(fs.readFileSync('C:/Users/Behidj Neila/Desktop/manipulationUniversite - Copie (2) - Copie/Hyperledger_Besu/GestionDiplome.json', 'utf-8'));

const instance = new web3.eth.Contract(
  GestionDiplome.abi,
  '0x42699a7612a82f1d9c36148af9c77354759b210b' // remplace avec l'adresse Besu
);

export default instance;
