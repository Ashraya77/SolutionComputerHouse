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

// @desc    Update a product
// @route   PUT /api/product/:id
// @access  Private/Admin
router.put('/:id', verifyJWT, admin, async (req, res) => {
  try {
    const { name, price, description, category, img } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.category = category || product.category;
      product.img = img || product.img;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while updating product' });
  }
});

// @desc    Delete a product
// @route   DELETE /api/product/:id
// @access  Private/Admin
router.delete('/:id', verifyJWT, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne(); // or product.remove() for older mongoose versions
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});

export default router;