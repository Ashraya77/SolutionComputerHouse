import express from 'express';
import Order from '../models/order.mjs';
import verifyJWT from '../middleware/verifyJWT.mjs';
import admin from '../middleware/admin.mjs';

const router = express.Router();

// @route   POST /api/orders

router.post('/', verifyJWT, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  } else { 
    const order = new Order({
      orderItems,
      user: req.userId,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', verifyJWT, async (req, res) => {
  const orders = await Order.find({ user: req.userId });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', verifyJWT, admin, async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', verifyJWT, async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    // Ensure only the user who owns the order or an admin can view it
    if (order.user.toString() !== req.userId.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// @desc    Update order status (e.g., to delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', verifyJWT, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;

      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (err) {
    res.status(400).json({ error: err.message || 'Server error while updating order' });
  }
});

export default router;
