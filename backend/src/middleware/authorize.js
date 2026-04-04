// src/middleware/authorize.js
// Role-based access guard — usage: authorize('ADMIN') or authorize('MODERATOR', 'ADMIN')

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized.' });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden. Required role: ${roles.join(' or ')}.` });
    }
    next();
  };
}

module.exports = authorize;
