
import express from 'express';
import Cart from '../models/cart.mjs';
import verifyJWT from '../middleware/verifyJWT.mjs';

const router = express.Router();

// Get current user's cart
router.get('/', verifyJWT, async (req, res) => {
	try {
		const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
		res.json(cart || { items: [] });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Add item to cart
router.post('/add', verifyJWT, async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		if (!productId || !quantity) return res.status(400).json({ error: 'Product and quantity required' });
		let cart = await Cart.findOne({ user: req.userId });
		if (!cart) {
			cart = new Cart({ user: req.userId, items: [] });
		}
		const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
		if (itemIndex > -1) {
			cart.items[itemIndex].quantity += quantity;
		} else {
			cart.items.push({ product: productId, quantity });
		}
		await cart.save();
		res.json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Update item quantity
router.put('/update', verifyJWT, async (req, res) => {
	try {
		const { productId, quantity } = req.body;
		let cart = await Cart.findOne({ user: req.userId });
		if (!cart) return res.status(404).json({ error: 'Cart not found' });
		const item = cart.items.find(item => item.product.toString() === productId);
		if (!item) return res.status(404).json({ error: 'Item not found' });
		item.quantity = quantity;
		await cart.save();
		res.json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Remove item from cart
router.delete('/remove', verifyJWT, async (req, res) => {
	try {
		const { productId } = req.body;
		let cart = await Cart.findOne({ user: req.userId });
		if (!cart) return res.status(404).json({ error: 'Cart not found' });
		cart.items = cart.items.filter(item => item.product.toString() !== productId);
		await cart.save();
		res.json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// Clear cart
router.delete('/clear', verifyJWT, async (req, res) => {
	try {
		let cart = await Cart.findOne({ user: req.userId });
		if (!cart) return res.status(404).json({ error: 'Cart not found' });
		cart.items = [];
		await cart.save();
		res.json(cart);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
