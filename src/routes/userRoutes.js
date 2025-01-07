const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateProfileUpdate } = require('../middlewares/validateMiddleware');

router.use(authMiddleware); // All routes here require authentication

router.put('/profile', validateProfileUpdate, userController.updateProfile);
router.get('/profile/:userId', userController.getUserProfile);

module.exports = router;