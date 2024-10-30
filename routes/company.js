const express = require('express');
const router = express.Router();
const {updateCompanyDescription, updateCompanyDomain, updateCompanyWebsite, updateEstablishedDate, updateCompanyIntake, 
      updateCompanyLocation, updateCompanyName,deleteCompany,AddCompany,VerifyCompany} = require("../controllers/company");
const{authmiddleware} = require("../middlewares/auth");
const {followCompany , followUser , unfollow , showallfollowers , showallfollowing}= require("../controllers/user");
const {getAllBlogsByAuthor , createBlog , deleteBlog } = require('../controllers/blog');

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
router.get('/showallfollowers',authmiddleware , showallfollowers );
router.get('/showallfollowing',authmiddleware , showallfollowing );
router.delete('/unfollow' , authmiddleware , unfollow);
router.post('/followcompany',  authmiddleware , followCompany );
router.post('/followuser',  authmiddleware , followUser);
router.get('/getallblogs',authmiddleware, getAllBlogsByAuthor);
router.post('/createblog', authmiddleware, createBlog);
router.delete('/deleteblog' , authmiddleware , deleteBlog);

module.exports = router;
 