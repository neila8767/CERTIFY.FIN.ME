import { PrismaClient, RoleEcole } from '@prisma/client'

export default async function ecolesSeeder(prisma: PrismaClient) {
await prisma.ecole_OFFICIAL.createMany({
  data: [
    // === PRIVÉES ===
    {
      nomEcole: "École Supérieure d'Informatique (ESI)",
      telephoneEcole: "023456789",
      emailEcole: "mendjourlydia@gmail.Com",
      adresseEcole: "Alger",
      role: RoleEcole.ECOLE_SUPERIEURE
    },
    {
      nomEcole: "École Supérieure des Affaires (ESAA)",
      telephoneEcole: "023456788",
      emailEcole: "esaa@esaa.dz",
      adresseEcole: "Alger",
      role: RoleEcole.ECOLE_SUPERIEURE
    },
    {
      nomEcole: "École Nationale Polytechnique (ENP)",
      telephoneEcole: "021234567",
      emailEcole: "contact@enp.edu.dz",
      adresseEcole: "Alger",
      role: RoleEcole.ECOLE_SUPERIEURE
    },
    {
      nomEcole: "École Supérieure de Commerce (ESC)",
      telephoneEcole: "023334455",
      emailEcole: "contact@esc-alger.dz",
      adresseEcole: "Alger",
      role: RoleEcole.ECOLE_SUPERIEURE
    },

    // Écoles de formation professionnelle
    {
      nomEcole: "CFPA El Karma",
      telephoneEcole: "0415678923",
      emailEcole: "cfpa.elkarma@formation.dz",
      adresseEcole: "Relizane",
      role: RoleEcole.ECOLE_FORMATION
    },
    {
      nomEcole: "INSFP Sidi Bel Abbès",
      telephoneEcole: "0487654321",
      emailEcole: "insfp.sba@formation.dz",
      adresseEcole: "Sidi Bel Abbès",
      role: RoleEcole.ECOLE_FORMATION
    },
    {
      nomEcole: "CFPA Constantine",
      telephoneEcole: "0316543210",
      emailEcole: "lydiamendjourr@gmail.com",
      adresseEcole: "Constantine",
      role: RoleEcole.ECOLE_FORMATION
    },
    {
      nomEcole: "École de Formation Professionnelle Alger-Centre",
      telephoneEcole: "021234568",
      emailEcole: "efp.algcentre@formation.dz",
      adresseEcole: "Alger-Centre",
      role: RoleEcole.ECOLE_FORMATION
    },
    {
      nomEcole: "INSFP Oran",
      telephoneEcole: "041987654",
      emailEcole: "insfp.oran@formation.dz",
      adresseEcole: "Oran",
      role: RoleEcole.ECOLE_FORMATION
    }
  ],
  skipDuplicates: true
});

console.log('✔ Écoles officielles seedées');
}