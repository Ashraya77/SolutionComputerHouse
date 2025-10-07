import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user has one document for all their favorites
    },
    products: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    }],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Favorite', FavoriteSchema);