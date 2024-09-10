const express = require('express');
const router = express.Router();
const {HandleAddUser , HandleAuth , HandleVerify}= require("../controllers/user");
const{authmiddleware} = require("../middlewares/auth");
const upload = require('../middlewares/multer');


router.get('/login', HandleVerify);
router.post('/signup', HandleAddUser);
router.patch('/profilepic',authmiddleware,upload.single('profileImage'),HandleAuth );
//router.get('/profilepic',authmiddleware,HandleAuth );








//const { HandleGetAll, HandleAdd, HandleUpdateUser, HandleDeleteUser } = require("../controllers/user");
//router.get('/', HandleGetAll);
//router.post('/', HandleAdd);
//router.patch('/:name', HandleUpdateUser);
//router.delete('/:name', HandleDeleteUser);

module.exports = router;
 