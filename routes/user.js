const express = require('express');
const router = express.Router();
const {AddUser , Verifyuser , Updateuserpfp , 
    updateUserName , updateUserHeadline , updateUserContact , 
    updateUserResume , addEducation , deleteEducation, addSkill , deleteSkill , addWorkExperience , deleteWorkExperience, DeleteUser
    , createApplication , deleteApplication , getApplicationsByUser, followCompany , followUser , unfollow , showallfollowers , showallfollowing}= require("../controllers/user");
const{authmiddleware} = require("../middlewares/auth");
const upload = require('../middlewares/multer');
const {getAllBlogsByAuthor , createBlog , deleteBlog } = require('../controllers/blog');


router.get('/login', Verifyuser);
router.post('/signup', AddUser);
router.patch('/profilepic',authmiddleware,upload.single('profileImage'), Updateuserpfp );
router.patch('/updateusername', authmiddleware, updateUserName);
router.patch('/updateuserheadline', authmiddleware , updateUserHeadline);
router.patch('/updateusercontact', authmiddleware , updateUserContact);
router.patch('/updateuserresume', authmiddleware ,  upload.single('RESUME')  ,updateUserResume);
router.post('/updateuserskills', authmiddleware , addSkill);
router.post('/updateuserwork',authmiddleware , addWorkExperience);
router.post('/update-user-education', authmiddleware ,addEducation);
router.delete("/deleteUser", authmiddleware , DeleteUser);
router.delete("/deleteskill", authmiddleware , deleteSkill);
router.delete("/deleteWORKEXP", authmiddleware , deleteWorkExperience);
router.delete("/deleteEDU", authmiddleware , deleteEducation);
router.post('/createApplication',authmiddleware , createApplication);
router.get('/getallapp', authmiddleware , getApplicationsByUser);
router.delete("/deleteApplication", authmiddleware , deleteApplication);
router.get('/showallfollowers',authmiddleware , showallfollowers );
router.get('/showallfollowing',authmiddleware , showallfollowing );
router.delete('/unfollow' , authmiddleware , unfollow);
router.post('/followcompany',  authmiddleware , followCompany );
router.post('/followuser',  authmiddleware , followUser);
router.get('/getallblogs',authmiddleware, getAllBlogsByAuthor);
router.post('/createblog', authmiddleware, createBlog);
router.delete('/deleteblog' , authmiddleware , deleteBlog);

module.exports = router;
 