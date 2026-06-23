import Address from "../models/Address.model.js";

export const addAddress = async (req, res) => {
  try {
    const address = await Address.create({
      ...req.body,

      user: req.user._id,
    });

    res.status(201).json({
      success: true,

      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    });

    res.status(200).json({
      success: true,

      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    await Address.findOneAndDelete({
      _id: req.params.id,

      user: req.user._id,
    });

    res.status(200).json({
      success: true,

      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};
