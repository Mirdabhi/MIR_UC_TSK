const express = require('express');
const router = express.Router();
const {AddREC , Verifyrec , updateRecruiterPosition , updateRecruiterName , deleteRecruiter}= require("../controllers/rec");
const{authmiddleware} = require("../middlewares/auth");

router.get('/login', Verifyrec);
router.post('/signup', AddREC);
router.patch('/updatename', authmiddleware, updateRecruiterName);
router.patch('/updaterecpos', authmiddleware , updateRecruiterPosition);
router.delete("/deleterec", authmiddleware , deleteRecruiter);





module.exports = router;