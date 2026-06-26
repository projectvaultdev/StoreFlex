import Order from "../models/Order.model.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import Address from "../models/Address.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    const address = await Address.findById(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    for (const item of cart.items) {
      totalAmount +=
        item.product.discountPrice > 0
          ? item.product.discountPrice * item.quantity
          : item.product.price * item.quantity;

      orderItems.push({
        product: item.product._id,
        quantity: item.quantity,
        price:
          item.product.discountPrice > 0
            ? item.product.discountPrice
            : item.product.price,
      });

      item.product.stock -= item.quantity;

      await item.product.save();
    }

    const order = await Order.create({
      user: req.user._id,

      orderItems,

      shippingAddress: address._id,

      totalAmount,

      paymentMethod,
    });

    cart.items = [];

    await cart.save();

    res.status(201).json({
      success: true,

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("orderItems.product", "name images")
      .populate("shippingAddress")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("orderItems.product")
      .populate("shippingAddress");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus === "SHIPPED" || order.orderStatus === "DELIVERED") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.orderStatus = "CANCELLED";

    await order.save();

    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;

        await product.save();
      }
    }
    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = req.body.orderStatus;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateTracking = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.trackingId = req.body.trackingId;

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.returnStatus = "REQUESTED";

    order.returnReason = req.body.reason;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return request submitted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const approveReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.returnStatus = "APPROVED";

    order.refundStatus = "PENDING";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const rejectReturn = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.returnStatus = "REJECTED";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Return rejected",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.refundStatus = "COMPLETED";

    await order.save();

    res.status(200).json({
      success: true,
      message: "Refund completed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateShippingStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.shippingStatus = req.body.shippingStatus;

    order.timeline.push({
      status: req.body.shippingStatus,

      message: req.body.message,
    });

    await order.save();

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const updateTrackingDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    order.trackingNumber = req.body.trackingNumber;

    order.courierPartner = req.body.courierPartner;

    order.estimatedDeliveryDate = req.body.estimatedDeliveryDate;

    await order.save();

    res.status(200).json({
      success: true,

      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,

      trackingNumber: order.trackingNumber,

      courierPartner: order.courierPartner,

      shippingStatus: order.shippingStatus,

      estimatedDeliveryDate: order.estimatedDeliveryDate,

      timeline: order.timeline,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
