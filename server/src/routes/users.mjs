
import express from 'express';
import User from '../models/users.mjs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import cookieParser from 'cookie-parser';
import verifyJWT from '../middleware/verifyJWT.mjs';

const router = express.Router();
router.use(cookieParser());

// GET all users (without passwords)
router.get('/', verifyJWT, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register API
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('address').notEmpty().withMessage('Address is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { name, email, password, address } = req.body;

            // Check if user exists
            if (await User.findOne({ email })) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                name,
                email,
                password: hashedPassword,
                address,
            });
            await user.save();

            res.status(201).json({ message: 'User registered', userId: user.id });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// ========================
// Login API
// ========================
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret',
        { expiresIn: '1d' }
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Logout API
router.post('/logout', async (req, res) => {
    try {
        // If you later implement refresh tokens in DB, you can remove them here
        // e.g., await User.updateOne({ _id: req.userId }, { $unset: { refreshToken: 1 } });

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



export default router;
