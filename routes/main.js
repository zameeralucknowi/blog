const express = require('express')
const router = express.Router();
const Post = require('../models/post');
const mainController = require('../controllers/mainController');
const adminController = require('../controllers/adminController')

const authMiddleware = require('../middleware/isAuth')



router.get('/', mainController.getIndex);

router.get('/about', mainController.getAbout);

router.get('/contact', mainController.getContact);

router.get('/post/:postId', mainController.getPost);

router.post('/search', mainController.postSearch);

router.get('/dashboard', authMiddleware.isAuth, mainController.getDashboard);

router.get('/add-post', authMiddleware.isAuth, mainController.getAddPost);

router.post('/add-post', authMiddleware.isAuth, mainController.postAddPost);

router.get('/edit-post/:postId', authMiddleware.isAuth, mainController.getEditPost);

router.put('/edit-post/:postId', authMiddleware.isAuth, mainController.putEditPost);

router.delete('/delete-post/:postId', authMiddleware.isAuth, mainController.deletePost);


module.exports = router;