const express = require('express')
const router = express.Router();
const adminController = require('../controllers/adminController');





// GET LOGIN
router.get('/login', adminController.getLogin);

//POST Login
router.post('/login', adminController.postLogin);

router.get('/signup', adminController.getSignup);
//POST register
router.post('/register', adminController.postRegister);

router.get('/logout', adminController.getLogOut);

module.exports = router;