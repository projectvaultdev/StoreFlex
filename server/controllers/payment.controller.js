import Order from "../models/Order.model.js";
import { createPayment } from "../services/payment.service.js";

export const paymentSuccess = async (req, res) => {
  try {
    const order = await Order.findById(req.body.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.paymentStatus = "PAID";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Payment successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount, provider } = req.body;

    const payment = await createPayment({
      amount,
      provider,
    });

    res.status(200).json({
      success: true,
      ...payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
