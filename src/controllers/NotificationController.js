// controllers/NotificationController.js
import NotificationModel from '../models/Notification.js';  // Importation du modèle avec syntaxe ES6
import jwt from 'jsonwebtoken';

export default {
async getMine(req, res) {
    try {
        const receiverId =req.user?.accountId;;
      console.log("numero receiver", receiverId);
      const notifications = await NotificationModel.getNotificationsForReceiver(receiverId);
      res.json(notifications);
    } catch (error) {
      console.error("Erreur getMyNotifications:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },


  // Marquer une notification comme lue
  async markRead(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updated = await NotificationModel.markAsRead(id);
      res.json({ success: true, notification: updated });
    } catch (error) {
      console.error("Erreur mise à jour notification:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
};
