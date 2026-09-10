const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_123');
    req.user = await User.findById(decoded.id);

    // Strictly enforce Editor invite logic on backend
    if (
      req.user.role === 'Editor' && 
      req.user.inviteStatus === 'pending' && 
      !req.originalUrl.includes('/accept-invite') && 
      !req.originalUrl.includes('/auth/me')
    ) {
      return res.status(403).json({ success: false, message: 'Strict Access Denied: You must accept your invite first.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };
