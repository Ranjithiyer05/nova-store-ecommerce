import Product from '../models/productModel.js';

// @desc    Fetch all products with search, category filtering & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { keyword, category, sort } = req.query;

    // 1. Build dynamic MongoDB query filter
    const query = {};

    // Search by keyword (case-insensitive regex on name or brand)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // 2. Determine sort order
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'price-low') {
      sortOption = { price: 1 };
    } else if (sort === 'price-high') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'bestseller') {
      sortOption = { isBestSeller: -1 };
    }

    // 3. Execute query in MongoDB
    const products = await Product.find(query).sort(sortOption);

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    // If invalid MongoDB ObjectId format (cast error)
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Invalid Product ID' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new product (Admin)
// @route   POST /api/products
// @access  Private / Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      category,
      categoryName,
      price,
      originalPrice,
      countInStock,
      description,
      image,
      isFeatured,
      isBestSeller,
    } = req.body;

    const product = new Product({
      name,
      brand,
      category,
      categoryName: categoryName || category,
      price,
      originalPrice: originalPrice || price,
      countInStock,
      description,
      image: image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      rating: 0,
      numReviews: 0,
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing product (Admin)
// @route   PUT /api/products/:id
// @access  Private / Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Update product fields with values provided in request body
    Object.assign(product, req.body);

    const updatedProduct = await product.save();
    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private / Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new review for a product
// @route   POST /api/products/:id/reviews
// @access  Private (Logged-in customer)
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already submitted a review for this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    // Calculate new average rating
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: 'Review added successfully', product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
