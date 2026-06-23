import Review from "../models/Review.model.js";
import Product from "../models/Product.model.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,

      product: productId,

      rating,

      comment,
    });

    await updateProductRating(productId);

    res.status(201).json({
      success: true,

      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const updateProductRating = async (productId) => {
  const reviews = await Review.find({
    product: productId,
  });

  const numReviews = reviews.length;

  const averageRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    averageRating,
    numReviews,
  });
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    })
      .populate("user", "name avatar")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
