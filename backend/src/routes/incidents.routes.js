const express = require('express');
const router = express.Router();
const incidentsController = require('../controllers/incidents.controller');
const auth = require('../middleware/auth');

router.get('/', auth, incidentsController.getIncidents);
router.post('/', auth, incidentsController.createIncident);

module.exports = router;
