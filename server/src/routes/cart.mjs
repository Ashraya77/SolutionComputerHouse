// CART ROUTES (routes/cart.mjs)
// ============================================
import express from 'express';
import verifyJWT from '../middleware/verifyJWT.mjs';
import Cart from '../models/cart.mjs';
import Product from '../models/product.mjs'; // Adjust path as needed

const router = express.Router();

// @route   GET api/cart
// @desc    Get user's cart with totals
// @access  Private
router.get('/', verifyJWT, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.productId');
    
    if (!cart || cart.items.length === 0) {
      return res.json({ 
        items: [], 
        totalItems: 0, 
        totalPrice: 0 
      });
    }

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      _id: cart._id,
      items: cart.items,
      totalItems,
      totalPrice,
      updatedAt: cart.updatedAt,
    });
  } catch (err) {
    console.error('Get cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/add
// @desc    Add an item to the cart
// @access  Private
router.post('/add', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    if (quantity < 1) {
      return res.status(400).json({ msg: 'Quantity must be at least 1' });
    }

    // Verify product exists and get details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already in cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      // Update quantity of existing item
      existingItem.quantity += quantity;
    } else {
      // Add new item with product snapshot 
      cart.items.push({
        productId: productId,
        name: product.name,
        price: product.price,
        img: product.img,
        quantity,
      });
    }

    await cart.save();
    await cart.populate('items.productId');

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.status(200).json({
      msg: 'Item added to cart',
      cart: {
        _id: cart._id,
        items: cart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (err) {
    console.error('Add to cart error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/update
// @desc    Update item quantity in cart
// @access  Private
router.post('/update', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, quantity } = req.body;

    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!productId || typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ msg: 'Invalid product ID or quantity' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    await cart.populate('items.productId');

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      msg: 'Cart updated',
      cart: {
        _id: cart._id,
        items: cart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (err) {
    console.error('Cart update error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/remove
// @desc    Remove an item from the cart
// @access  Private
router.post('/remove', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    if (!productId) {
      return res.status(400).json({ msg: 'Product ID is required' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    await cart.save();
    await cart.populate('items.productId');

    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.json({
      msg: 'Item removed from cart',
      cart: {
        _id: cart._id,
        items: cart.items,
        totalItems,
        totalPrice,
      },
    });
  } catch (err) {
    console.error('Cart remove error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/cart/clear
// @desc    Clear all items from the cart
// @access  Private
router.post('/clear', verifyJWT, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = [];
      await cart.save();
      res.json({
        msg: 'Cart cleared',
        cart: {
          _id: cart._id,
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    } else {
      // No cart exists, return empty
      res.json({
        msg: 'Cart already empty',
        cart: {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        },
      });
    }
  } catch (err) {
    console.error('Cart clear error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/cart/count
// @desc    Get cart item count (useful for navbar badge)
// @access  Private
router.get('/count', verifyJWT, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId });

    if (!cart || cart.items.length === 0) {
      return res.json({ count: 0 });
    }

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ count });
  } catch (err) {
    console.error('Get cart count error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

export default router;