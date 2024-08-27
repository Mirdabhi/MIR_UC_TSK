const express = require('express');
const router = express.Router();
const { HandleGetAll, HandleAdd, HandleUpdateUser, HandleDeleteUser } = require("../controllers/user");

router.get('/', HandleGetAll);
router.post('/', HandleAdd);

router.patch('/:name', HandleUpdateUser);
router.delete('/:name', HandleDeleteUser);

module.exports = router;
 