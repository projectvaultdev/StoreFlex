import Coupon from "../models/Coupon.model.js";

export const createCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, amount } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon || !coupon.isActive) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    if (amount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum amount should be ₹${coupon.minimumAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "PERCENTAGE") {
      discount = (amount * coupon.discountValue) / 100;

      if (coupon.maxDiscount > 0) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.status(200).json({
      success: true,

      discount,

      finalAmount: amount - discount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
