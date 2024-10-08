const Company = require('../models/company'); // Assuming you have a company model

const authorizeCompany = async (req, res, next) => {
  try {
    const companyId = req.body.companyId || req.headers['x-company-id']; // Extract companyId from request body or headers
    
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    // Find the company in the database
    const company = await Company.findById(companyId);
    
    if (!company) {
      return res.status(401).json({ message: 'Unauthorized. Invalid Company ID' });
    }

    // Attach company info to the request object, so it's accessible in the next handler
    req.company = company;

    // Authorization success, move to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authorizeCompany;
