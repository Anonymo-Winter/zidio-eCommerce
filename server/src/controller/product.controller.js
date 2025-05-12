import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Address } from "../models/address.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import { cloudinaryUpload } from "../utils/clodinaryHandler.js";

const createProduct = AsyncHandler(async (req, res) => {
  const { name, description, price, type, stock } = req.body;

  const files = req.files;

  if (!files || files.length === 0) {
    throw new ApiError(400, "No such file found");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to create a product");
  }

  let images = [];
  const uploadPromises = files.map(async (img, index) => {
    const localFilePath = req.files[index]?.path;
    if (!localFilePath) {
      throw new ApiError(404, "Error occurred while retrieving from req files");
    }
    const cloudinaryResult = await cloudinaryUpload(localFilePath);

    if (!cloudinaryResult) {
      throw new ApiError(
        500,
        "Error occurred while uploading image to cloudinary"
      );
    }

    let image = {
      url: cloudinaryResult.url,
      cloundinary_id: cloudinaryResult.public_id,
    };

    if (!image) {
      throw new ApiError(500, "Internal server error !!");
    }
    images.push(image);
  });

  const uploadedImages = await Promise.all(uploadPromises);
  if (!uploadedImages) {
    throw new ApiError(500, "Error occurred while uploading images");
  }

  const product = await Product.create({
    name,
    description,
    price,
    type,
    images,
    stock,
    owner: user._id,
  });
  if (!product) {
    throw new ApiError(500, "Product creation failed");
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Product created successfully", product));
});

const updateProduct = AsyncHandler(async (req, res) => {
  const { name, description, price, type, stock } = req.body;
  const files = req.files;
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to update a product");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  let images = [...product.images];

  if (files && files.length > 0) {
    const uploadPromises = files.map(async (img, index) => {
      const localFilePath = files[index]?.path;
      if (!localFilePath) {
        throw new ApiError(404, "File path not found in uploaded file");
      }

      const cloudinaryResult = await cloudinaryUpload(localFilePath);
      if (!cloudinaryResult) {
        throw new ApiError(500, "Failed to upload image to Cloudinary");
      }

      return {
        url: cloudinaryResult.url,
        cloudinary_id: cloudinaryResult.public_id,
      };
    });

    const uploadedImages = await Promise.all(uploadPromises);
    images = [...images, ...uploadedImages]; // Merge new images
  }

  // Now update the product
  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    {
      name,
      description,
      price,
      type,
      stock,
      images,
      owner: user._id,
    },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(500, "Product update failed");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", updatedProduct));
});

const deleteProduct = AsyncHandler(async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to delete a product");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Delete images from Cloudinary
  const deletePromises = product.images.map(async (image) => {
    return cloudinary.uploader.destroy(image.cloudinary_id);
  });

  await Promise.all(deletePromises);

  // Now delete the product
  await Product.findByIdAndDelete(productId);

  res.status(200).json(new ApiResponse(200, "Product deleted successfully"));
});

const getAllProducts = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role !== "admin") {
    throw new ApiError(403, "You are not authorized to view all products");
  }

  const products = await Product.find().populate(
    "owner",
    "firstName lastName email"
  );

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Products retrieved successfully", products));
});

const getProductById = AsyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.aggregate([
    {
      $match: {
        _id: productId,
      },
    },
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product_id",
        as: "reviews",
      },
    },
    {
      $unwind: {
        path: "$reviews",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "reviews.userId",
        foreignField: "_id",
        as: "reviews.reviewerDetails",
      },
    },
    {
      $unwind: {
        path: "$reviews.reviewerDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: "$_id",
        name: {
          $first: "$name",
        },
        description: {
          $first: "$description",
        },
        price: {
          $first: "$price",
        },
        type: {
          $first: "$type",
        },
        stock: {
          $first: "$stock",
        },
        images: {
          $first: "$images",
        },
        owner: {
          $first: "$owner",
        },
        reviews: {
          $push: "$reviews",
        },
      },
    },
  ]);

  if (!product || product.length === 0) {
    throw new ApiError(404, "Product not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Product retrieved successfully", product[0]));
});

const getProductsByType = AsyncHandler(async (req, res) => {
  const { type } = req.params;

  const products = await Product.find({ type })
    .populate("owner", "firstName lastName email")
    .sort({ price: 1 });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found for this type");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Products retrieved successfully", products));
});

const getProductByQuery = AsyncHandler(async (req, res) => {
  const { type, sort, page = 1, limit = 20 } = req.query;
  const query = {};

  if (type) {
    query.type = type;
  }

  const products = await Product.find(query)
    .populate("owner", "firstName lastName email")
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ price: sort === "low" ? 1 : -1 });

  if (!products || products.length === 0) {
    throw new ApiError(404, "No products found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Products retrieved successfully", products));
});

export {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  getProductsByType,
  getProductByQuery,
};
