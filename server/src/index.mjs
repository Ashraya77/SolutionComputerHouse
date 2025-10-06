import express from 'express';
import connectDB from './conn/db.mjs';
import cors from 'cors';
import userRoutes from './routes/users.mjs';
import cartRoutes from './routes/cart.mjs';
import productRoutes from './routes/product.mjs';

const app = express();
const PORT = 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});



// Connect to MongoDB 
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Running on port :${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});