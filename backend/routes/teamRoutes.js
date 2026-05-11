const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const isAuthenticated = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/isAdmin');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', teamController.getAllTeamMembers);
router.get('/:id', teamController.getTeamMemberById);

// Protected routes (Admin only)
router.post('/', isAuthenticated, isAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'projectImages', maxCount: 10 }
]), teamController.createTeamMember);

router.put('/:id', isAuthenticated, isAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'projectImages', maxCount: 10 }
]), teamController.updateTeamMember);
router.delete('/:id', isAuthenticated, isAdmin, teamController.deleteTeamMember);

module.exports = router;
