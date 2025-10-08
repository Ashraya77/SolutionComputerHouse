import express from 'express';
import verifyJWT from '../middleware/verifyJWT.mjs';
import Cart from '../models/cart.mjs';

const router = express.Router();

// @route   GET api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', verifyJWT, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.json({ items: [] });
    }
    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/cart/add
// @desc    Add an item to the cart
// @access  Private
router.post('/add', verifyJWT, async (req, res) => {
  const { id: productId, name, price, img } = req.body;

  // Guard: ensure userId exists
  if (!req.userId) return res.status(401).json({ msg: 'Unauthorized' });

  // Validate product data
  if (!productId || !name || typeof price !== 'number' || !img) {
    return res.status(400).json({ msg: 'Product information is missing or invalid' });
  }

  try {
    // Find existing cart for user
    let cart = await Cart.findOne({ userId: req.userId });

    // If cart doesn't exist, create it
    if (!cart) {
      cart = new Cart({ userId: req.userId, items: [] });
    }

    // Check if product already exists in cart
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      cart.items.push({ productId, name, price, img, quantity: 1 });
    }

    await cart.save();
    res.json(cart); // Return the full cart object
  } catch (err) {
    console.error('Cart add error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// You can add more routes here for removing items, updating quantity, etc.

export default router;