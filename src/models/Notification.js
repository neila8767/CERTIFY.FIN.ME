import { PrismaClient } from '@prisma/client';  // Utilisation de l'importation ES6
const prisma = new PrismaClient();

export default {


  // Récupérer les notifications d'un utilisateur (par ID)
  async getNotificationsForReceiver(receiverId) {
    return await prisma.notification.findMany({
      where: { receiverId },
      orderBy: { createdAt: 'desc' },
    });
    
  },

  // Marquer une notification comme lue
  async markAsRead(notificationId) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }
};
