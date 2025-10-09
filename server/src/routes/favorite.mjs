import express from 'express';
import Favorite from '../models/favorite.mjs';
import verifyJWT from '../middleware/verifyJWT.mjs';

const router = express.Router();

router.use(verifyJWT);


router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.findOne({ user: req.userId }).populate('products');

    if (!favorites) {
      // If the user has never favorited anything, they won't have a document.
      // Return an empty array.
      return res.json([]);
    }

    res.json(favorites.products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching favorites' });
  }
});



router.post('/', async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }

  try {
  
    const updatedFavorites = await Favorite.findOneAndUpdate(
      { user: req.userId },
      { $addToSet: { products: productId } },
      { new: true, upsert: true } // `new` returns the updated doc, `upsert` creates it if it doesn't exist
    ).populate('products');

    res.status(200).json(updatedFavorites.products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while adding to favorites' });
  }
});


router.delete('/:productId', async (req, res) => {
  try {
    await Favorite.updateOne({ user: req.userId }, { $pull: { products: req.params.productId } });
    res.status(200).json({ message: 'Product removed from favorites' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while removing from favorites' });
  }
});

export default router;