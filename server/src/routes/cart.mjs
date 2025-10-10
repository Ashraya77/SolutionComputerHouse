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

  if (!req.userId) return res.status(401).json({ msg: 'Unauthorized' });

  if (!productId || !name || typeof price !== 'number' || !img) {
    return res.status(400).json({ msg: 'Product information is missing or invalid' });
  }

  try {
    // Atomically add or update the cart
    const cart = await Cart.findOneAndUpdate(
      { user: req.userId }, 
      {
        $setOnInsert: { user: req.userId, items: [] }, // create cart if not exists
      },
      { upsert: true, new: true }
    );

    // Check if product already exists
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity = (existingItem.quantity || 0) + 1;
    } else {
      cart.items.push({ productId, name, price, img, quantity: 1 });
    }

    cart.markModified('items'); // needed for Mongoose to detect array changes
    await cart.save();

    res.json(cart);
  } catch (err) {
    console.error('Cart add error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// You can add more routes here for removing items, updating quantity, etc.
// @route   POST api/cart/remove
// @desc    Remove an item from the cart
// @access  Private
router.post('/remove', verifyJWT, async (req, res) => {
  const { productId } = req.body;

  if (!req.userId) return res.status(401).json({ msg: 'Unauthorized' });
  if (!productId) return res.status(400).json({ msg: 'Product ID is missing' });

  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item.productId !== productId);

    if (cart.items.length === initialItemCount) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cart.markModified('items');
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error('Cart remove error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.post('/update', verifyJWT, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.userId) return res.status(401).json({ msg: 'Unauthorized' });
  if (!productId || typeof quantity !== 'number' || quantity < 0) {
    return res.status(400).json({ msg: 'Product ID or quantity is invalid' });
  }

  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ msg: 'Cart not found' });

    const itemToUpdate = cart.items.find(item => item.productId === productId);

    if (itemToUpdate) {
      itemToUpdate.quantity = quantity;
      cart.markModified('items');
      await cart.save();
      res.json(cart);
    } else {
      res.status(404).json({ msg: 'Item not found in cart' });
    }
  } catch (err) {
    console.error('Cart update error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/clear
// @desc    Clear all items from the cart
// @access  Private
router.post('/clear', verifyJWT, async (req, res) => {
  if (!req.userId) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (cart) {
      cart.items = [];
      await cart.save();
      res.json(cart);
    } else {
      // If no cart exists, it's already clear.
      res.json({ items: [] });
    }
  } catch (err) {
    console.error('Cart clear error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

export default router;