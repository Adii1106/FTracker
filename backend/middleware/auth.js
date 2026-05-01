const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication failed' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};
