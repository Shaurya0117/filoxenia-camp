const express = require('express');
const router = express.Router();
const safetyController = require('../controllers/safety.controller');
const auth = require('../middleware/auth');

router.get('/', auth, safetyController.getSafetyChecks);
router.post('/', auth, safetyController.createSafetyCheck);

module.exports = router;
