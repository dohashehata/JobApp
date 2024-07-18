




// const authorize = (req, res, next) => {
//   const { user } = req;
//   const { userId } = req.params;

//   if (!user) {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   // Allow access if the user is accessing their own profile or if they are an Admin
//   if (user.id !== userId && user.role !== 'User') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   next();
// };

// export default authorize;










// const authorizeUser = (req, res, next) => {
//   const { user } = req;
//   const { userId } = req.params;

//   if (!user) {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   // Allow access if the user is accessing their own profile or if they are an Admin
//   if (user.id !== userId && user.role !== 'User') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   next();
// };


// const authorizeCompany = (req, res, next) => {
//   const { user } = req;
//   const { id: userId } = req.params;

//   if (!user) {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   // Allow access if the user is accessing their own profile or if they are an Admin
//   if (user.id !== userId && user.role !== 'Company_HR') {
//     return res.status(403).json({ msg: 'Access denied' });
//   }

//   next();
// };

// export { authorizeUser,authorizeCompany};













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