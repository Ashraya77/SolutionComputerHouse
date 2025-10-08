import mongoose from 'mongoose';
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: {
    type: String, // Using name as product ID for now as in the frontend
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  img: {
    type: String,
    required: true,
  },
});

const CartSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);