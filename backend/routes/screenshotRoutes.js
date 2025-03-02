const express = require('express');
const router = express.Router();
const { captureYouTubeScreenshot } = require('../controllers/screenshotController');

// Screenshot route
router.post('/youtube', captureYouTubeScreenshot);

module.exports = router;