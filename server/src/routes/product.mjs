
import express from 'express';
import Product from '../models/product.mjs';
import verifyJWT from '../middleware/verifyJWT.mjs';
import User from '../models/users.mjs';

const router = express.Router();

// Create a new product
router.post("/", verifyJWT, async (req, res) => {
  try {
    // Fetch user details from token (set by verifyJWT)
    const user = await User.findById(req.user.id);

    // Check role
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const { productId, name, category, price, imgUrl } = req.body;

    const product = new Product({
      productId,
      name,
      category,
      price,
      imgUrl,
    });

    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all products
router.get('/', async (req, res) => {
	try {
		const products = await Product.find();
		res.json(products);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Get a product by id
router.get('/:id', async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.json(product);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update a product by id
router.put('/:id', async (req, res) => {
	try {
		const { productId, name, category, price, imgUrl } = req.body;
		
		const product = await Product.findByIdAndUpdate(
			req.params.id,
			{ productId, name, category, price, imgUrl },
			{ new: true, runValidators: true }
		);
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.json(product);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});

// Delete a product by id
router.delete('/:id', async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) return res.status(404).json({ error: 'Product not found' });
		res.json({ message: 'Product deleted' });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
