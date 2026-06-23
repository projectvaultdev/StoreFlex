import RecentlyViewed from "../models/RecentlyViewed.model.js";

export const addRecentlyViewed = async (req, res) => {
  try {
    const { productId } = req.body;

    let history = await RecentlyViewed.findOne({
      user: req.user._id,
    });

    if (!history) {
      history = await RecentlyViewed.create({
        user: req.user._id,
        products: [],
      });
    }

    history.products = history.products.filter(
      (item) => item.toString() !== productId,
    );

    history.products.unshift(productId);

    history.products = history.products.slice(0, 10);

    await history.save();

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRecentlyViewed = async (req, res) => {
  try {
    const history = await RecentlyViewed.findOne({
      user: req.user._id,
    }).populate("products");

    res.status(200).json({
      success: true,
      products: history?.products || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
