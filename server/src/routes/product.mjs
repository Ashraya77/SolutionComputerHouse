import express from 'express';
import Product from '../models/product.mjs';
import verifyJWT from '../middleware/verifyJWT.mjs';
import admin from '../middleware/admin.mjs';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/product
// @access  Public
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    const filter = {};

    if (category) {
      filter.category = category;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching products' });
  }
});

// @desc    Create a product
// @route   POST /api/product
// @access  Private/Admin
router.post('/', verifyJWT, admin, async (req, res) => {
  try {
    const { name, price, description, category, img } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      img,
    });
	
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ error: 'Server error while creating product' });
  }
});

export default router;