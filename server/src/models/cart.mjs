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

const CartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    items: [CartItemSchema], // use your defined CartItemSchema
  },
  { timestamps: true } // <-- schema option
);

export default mongoose.model('Cart', CartSchema);


