import Order from "../models/Order.model.js";
import { generateInvoice } from "../services/invoice.service.js";

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    generateInvoice(order, res);
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
