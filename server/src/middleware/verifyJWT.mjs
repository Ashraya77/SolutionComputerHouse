import jwt from 'jsonwebtoken';
import User from '../models/users.mjs';

const verifyJWT = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.sendStatus(401);

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.sendStatus(401);
    req.user = user;
    req.userId = user._id;
    next();
  } catch (err) {
    res.sendStatus(403);
  }
};

export default verifyJWT;