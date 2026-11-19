import mongoose from 'mongoose';

// 1. Define the Product Blueprint (Schema)
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please specify the brand'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category slug (e.g. audio, computers)'],
    },
    categoryName: {
      type: String,
      required: [true, 'Please provide the category display name'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL'],
    },
    description: {
      type: String,
      required: [true, 'Please add a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: [true, 'Please enter quantity in stock'],
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestSeller: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

// 2. Compile Schema into a Model and export
const Product = mongoose.model('Product', productSchema);

export default Product;
