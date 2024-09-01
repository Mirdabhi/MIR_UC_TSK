const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();

const JWT_SECRET = process.env.jwt;
async function authmiddleware( req, res , next) {
  const value = req.header('Authorization');
    if (!value) {
        return res.status(403).json({ message: 'No token provided, authorization denied' });
      }
    
      try {
        const bearer = value.split(" ");
        const token = bearer[1];
    
        if (!token) {
          return res.status(403).json({ message: 'Token missing, authorization denied' });
        }
    
        const decoded = jwt.verify(token, JWT_SECRET);
    
        if (!decoded) {
          return res.status(401).json({ message: 'Invalid token' });
        }
       next(); 
      } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
      }
  };
  module.exports = {authmiddleware};