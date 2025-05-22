// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GestionDiplome {
    //Definir la structure du diplome
struct Diploma {
    string diplomaHash;         // le hash du diplôme (SHA256 ou Keccak)
    string etablissement;
    string studentName;
    string birthDate;
    string birthPlace;
    string diplomaTitle;
    string dateOfIssue;
    string speciality;
    string diplomaType ;
    bool complete;              // validé ou non
}
    // Mapping pour stocker les diplômes en fonction de leur hash
    mapping(string => Diploma) private diplomas;
    address public deployeur;

    event ApprovedDiploma(address indexed approver, string indexed diplomaHash);

    constructor() {
        deployeur = msg.sender;
    }

    function createDiploma(
    string memory _diplomaHash,
    string memory _etablissement,
    string memory _studentName,
    string memory _birthDate,
    string memory _birthPlace,
    string memory _diplomaTitle,
    string memory _dateOfIssue,
    string memory _speciality,
    string memory _diplomaType 
    ) public {
      
        Diploma memory newDiploma = Diploma( _diplomaHash, _etablissement, _studentName, _birthDate, _birthPlace, _diplomaTitle, _dateOfIssue, _speciality, _diplomaType, false);
        diplomas[_diplomaHash] = newDiploma;
    }

    function approveDiploma(string memory diplomaHash) public {

     // Vérifier que le diplôme existe
    require(bytes(diplomas[diplomaHash].diplomaHash).length != 0, "Le diplome n'existe pas.");
    Diploma storage d = diplomas[diplomaHash];
    require(!diplomas[diplomaHash].complete,"Le diplome est deja valide");
    d.complete = true;
    // Envoyer un événement pour informer les approveurs qu'un diplôme a été approuvé
    emit ApprovedDiploma(msg.sender, diplomaHash);
}

    function getDiplome(string memory diplomaHash) public view returns (Diploma memory) {
        // Vérifie si le diplôme existe
        require(bytes(diplomas[diplomaHash].diplomaHash).length != 0, "Le diplome n'existe pas.");
        Diploma memory diploma = diplomas[diplomaHash];
        require(diploma.complete, "Le diplome n'est pas pas encore valide");
        return diploma;
    }
}
