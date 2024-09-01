const express = require('express');
const router = express.Router();
const {HandleAddUser , HandleAuth , HandleVerify}= require("../controllers/user");
const{authmiddleware} = require("../middlewares/auth");


router.get('/login', HandleVerify);
router.post('/signup', HandleAddUser);
router.get('/auth',authmiddleware,HandleAuth );








//const { HandleGetAll, HandleAdd, HandleUpdateUser, HandleDeleteUser } = require("../controllers/user");
//router.get('/', HandleGetAll);
//router.post('/', HandleAdd);
//router.patch('/:name', HandleUpdateUser);
//router.delete('/:name', HandleDeleteUser);

module.exports = router;
 