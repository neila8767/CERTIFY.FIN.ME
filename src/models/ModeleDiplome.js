import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default {
  async getAll() {
    return await prisma.modeleDiplome.findMany({
      select: { idModele: true, nomModele: true, cheminModele: true },
    })
  },
  async getAllECOLE() {
    return await prisma.modeleDiplomeECOLE.findMany({
      select: { idModele: true, nomModele: true, cheminModele: true },
    })
  }
}