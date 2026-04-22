// Middleware to check user role
const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res.status(403).json({ msg: `Access denied: ${role}s only` });
    }
  };
};

module.exports = checkRole;
