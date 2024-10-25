const express = require('express');
const router = express.Router();
const {AddREC , Verifyrec , updateRecruiterPosition , updateRecruiterName , deleteRecruiter , addJob , deleteJob , updateApplicationStatusByJobId}= require("../controllers/rec");
const{authmiddleware} = require("../middlewares/auth");

router.get('/login', Verifyrec);
router.post('/signup', AddREC);
router.patch('/updatename', authmiddleware, updateRecruiterName);
router.patch('/updaterecpos', authmiddleware , updateRecruiterPosition);
router.delete("/deleterec", authmiddleware , deleteRecruiter);
router.post('/addJob', authmiddleware, addJob );
router.patch('/updateApplication', authmiddleware, updateApplicationStatusByJobId);
router.delete("/deleteJob", authmiddleware , deleteJob);





module.exports = router;