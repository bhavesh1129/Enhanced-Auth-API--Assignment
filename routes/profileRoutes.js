const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateUser = require('../middleware/authenticateUser');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.get('/me', authenticateUser, profileController.getMyProfile);
router.patch('/visibility', authenticateUser, profileController.setProfileVisibility);
router.patch('/updateProfile', authenticateUser, profileController.updateProfile);
router.get('/getAllPublicProfiles', authenticateUser, profileController.getAllPublicProfiles);
router.get('/getAllProfiles', authenticateUser, authorizeAdmin, profileController.getAllProfiles);

module.exports = router;
