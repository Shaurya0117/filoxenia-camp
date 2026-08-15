const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const auth = require('../middleware/auth');

router.get('/', auth, foodController.getFoodLogs);
router.post('/', auth, foodController.createFoodLog);

module.exports = router;
