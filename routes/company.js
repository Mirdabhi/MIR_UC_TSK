const express = require('express');
const router = express.Router();
const {updateCompanyDescription, updateCompanyDomain, updateCompanyWebsite, updateEstablishedDate, updateCompanyIntake, 
      updateCompanyLocation, updateCompanyName,deleteCompany,AddCompany,VerifyCompany} = require("../controllers/company");
const{authmiddleware} = require("../middlewares/auth");



router.get('/login', VerifyCompany );
router.post('/signup', AddCompany );
router.patch('/updatecompanywebsite',authmiddleware, updateCompanyWebsite);
router.patch('/updatecompanyname', authmiddleware, updateCompanyName);
router.patch('/updatecompanydomain', authmiddleware, updateCompanyDomain);
router.patch('/updatecompanydescription', authmiddleware, updateCompanyDescription);
router.patch('/updatecompanylocation', authmiddleware, updateCompanyLocation);
router.patch('/updatecompanyintake', authmiddleware, updateCompanyIntake);
router.patch('/updateestablisheddate', authmiddleware, updateEstablishedDate);
router.delete('/deletecompany' , authmiddleware , deleteCompany);

module.exports = router;
 