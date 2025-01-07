const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
  validateJobCreation, 
  validateJobApplication, 
  validateJobSelection 
} = require('../middlewares/validateMiddleware');

router.use(authMiddleware); // All routes here require authentication

router.post('/create', validateJobCreation, jobController.createJob);
router.get('/', jobController.getJobs);
router.post('/:jobId/apply', validateJobApplication, jobController.applyToJob);
router.post('/select-provider', validateJobSelection, jobController.selectProvider);

module.exports = router;