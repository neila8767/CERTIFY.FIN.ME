const path = require('path');
const fs = require("fs").promises;
const solc = require("solc");

async function main() {
  // Chemins des fichiers
  const gestionDiplomePath = path.resolve(__dirname, 'contracts', 'GestionDiplome.sol');

  // Charger les codes sources
  const gestionDiplomeSource = await fs.readFile(gestionDiplomePath, "utf8");

  // Configuration de la compilation pour plusieurs contrats
  const input = {
    language: "Solidity",
    sources: {
      "GestionDiplome.sol": { content: gestionDiplomeSource }
    },
    settings: {
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"]
        }
      }
    }
  };

  // Compilation
  const output = JSON.parse(solc.compile(JSON.stringify(input)));

  // Traitement des erreurs
  if (output.errors) {
    output.errors.forEach(err => console.error(err.formattedMessage));
    throw new Error("Erreur de compilation");
  }


  // Sauvegarde des artefacts pour GestionDiplome
  const gestionDiplomeArtifact = JSON.stringify({
    abi: output.contracts["GestionDiplome.sol"].GestionDiplome.abi,
    bytecode: output.contracts["GestionDiplome.sol"].GestionDiplome.evm.bytecode.object
  }, null, 2);
  await fs.writeFile("GestionDiplome.json", gestionDiplomeArtifact);

  console.log("Compilation terminée avec succès !");
}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});






