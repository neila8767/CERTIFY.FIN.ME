import { PrismaClient } from '@prisma/client'

export default async function modelesDiplomeSeeder(prisma: PrismaClient) {
  await prisma.modeleDiplomeECOLE.createMany({
    data: [
      {
        nomModele: "Modèle simple beige et blanc",
        cheminModele: "/ModelesDiplome/BeigeBlancCertificate.png"
      },
      {
        nomModele: "Modèle Beige et bleu",
        cheminModele: "/ModelesDiplome/BeigeBleuCertificate.png"
      },
      {
        nomModele: "Modèle black and gold",
        cheminModele: "/ModelesDiplome/BlackAndGoldCertificate.png"
      },
      {
        nomModele: "Modèle bleu et dore simple",
        cheminModele: "/ModelesDiplome/BleuDoreCertificate.png"
      },
      {
        nomModele: "Modèle bleu et gris",
        cheminModele: "/ModelesDiplome/BleuGrisCertificate.png"
      }
    ],
    skipDuplicates: true
  })
  console.log('✔ Modéle de diplomes créees')
}