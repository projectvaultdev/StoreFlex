import Notification from "../models/Notification.model.js";

export const createNotification = async (userId, title, message, type) => {
  await Notification.create({
    user: userId,
    title,
    message,
    type,
  });
};
