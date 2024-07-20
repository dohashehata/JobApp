
const authorize = (roles = []) => {
  return (req, res, next) => {
    const { user } = req;

    if (!user) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    next();
  };
};

export default authorize;