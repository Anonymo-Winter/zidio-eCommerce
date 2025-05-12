
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { Review } from "../models/review.model.js";


const createReview = AsyncHandler(async (req, res) => {
  const { rating, reviewText, product_id } = req.body;
  const userId = req.user._id; // Assuming you have user information in req.user
  //check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if the product exists
  const product = await Product.findById(product_id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Create a new review
  const review = await Review.create({
    userId,
    product_id,
    rating,
    reviewText,
  });

  res
    .status(201)
    .json(new ApiResponse(201, "Review created successfully", review));
});

const editReview = AsyncHandler(async (req, res) => {
  const { rating, reviewText } = req.body;
  const reviewId = req.params.id; // Assuming the review ID is passed in the URL

  // Check if the review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Update the review
  review.rating = rating;
  review.reviewText = reviewText;
  await review.save();

  res
    .status(200)
    .json(new ApiResponse(200, "Review updated successfully", review));
});

const deleteReview = AsyncHandler(async (req, res) => {
  const reviewId = req.params.id; // Assuming the review ID is passed in the URL

  // Check if the review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Delete the review
  await review.remove();

  res.status(200).json(new ApiResponse(200, "Review deleted successfully"));
});

const getAllReviews = AsyncHandler(async (req, res) => {
  const { product_id } = req.query;

  // Check if the product exists
  const product = await Product.findById(product_id);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Aggregate reviews with user details
  const reviews = await Review.aggregate([
    { $match: { product_id: product_id } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: "$userDetails",
    },
    {
      $project: {
        _id: 1,
        rating: 1,
        reviewText: 1,
        userId: 1,
        "userDetails.firstName": 1,
        "userDetails.lastName": 1,
      },
    },
  ]);

  res
    .status(200)
    .json(new ApiResponse(200, "Reviews fetched successfully", reviews));
});

const deleteReviewAdmin = AsyncHandler(async (req, res) => {
  const reviewId = req.params.id; // Assuming the review ID is passed in the URL

  // Check if the review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  // Delete the review
  await review.remove();

  res.status(200).json(new ApiResponse(200, "Review deleted successfully"));
});

export {
    createReview,
    editReview,
    deleteReview,
    getAllReviews,
    deleteReviewAdmin,
}
