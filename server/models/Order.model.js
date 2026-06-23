import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },
    // local payment method model
    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentProvider: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "CASHFREE", "PHONEPE"],
    },

    paymentId: {
      type: String,
      default: "",
    },

    transactionId: {
      type: String,
      default: "",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // paymentMethod: {
    //   type: String,
    //   enum: ["COD", "ONLINE"],
    //   default: "COD",
    // },

    // paymentStatus: {
    //   type: String,
    //   enum: ["PENDING", "PAID", "FAILED"],
    //   default: "PENDING",
    // },

    orderStatus: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING",
    },

    trackingId: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,
      enum: ["NONE", "REQUESTED", "APPROVED", "REJECTED", "REFUNDED"],
      default: "NONE",
    },
    returnStatus: {
      type: String,
      enum: ["NONE", "REQUESTED", "APPROVED", "REJECTED"],
      default: "NONE",
    },

    returnReason: {
      type: String,
      default: "",
    },

    refundStatus: {
      type: String,
      enum: ["NONE", "PENDING", "COMPLETED"],
      default: "NONE",
    },
    shippingStatus: {
      type: String,
      enum: ["PENDING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"],
      default: "PENDING",
    },

    trackingNumber: {
      type: String,
      default: "",
    },

    courierPartner: {
      type: String,
      default: "",
    },

    estimatedDeliveryDate: {
      type: Date,
    },
    timeline: [
      {
        status: String,

        message: String,

        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
