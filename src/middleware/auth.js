
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const auth = (role) => {
  return async (req, res, next) => {
    const {token} = req.headers;
    if (!token) return res.status(401).json({ message: 'Please sign in' });

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) return res.status(498).json({ message: 'Invalid Token', error });

      if (role && decoded.role !== role) {
        return res.status(403).json({ message: 'Not enough privileges' });
      }
      req.user = decoded;
      next();
    });
  };
};

export default auth;








// middleware/auth.js

// export const checkCompanyOwner = async (req, res, next) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     if (!company) return res.status(404).send('Company not found.');
//     if (company.companyHR.toString() !== req.user.id) {
//       return res.status(403).send('Access denied. Only the company owner can update this data.');
//     }
//     next();
//   } catch (err) {
//     res.status(400).send('Invalid request.');
//   }
// };
