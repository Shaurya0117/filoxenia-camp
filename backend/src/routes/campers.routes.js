const express = require('express');
const { getCampers, getCamperById, createCamper, updateCamper, deleteCamper, enrollCamper } = require('../controllers/campers.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

// All camper routes require auth
router.use(auth);

router.get('/', getCampers);
router.get('/:id', getCamperById);
router.post('/', roleCheck(['admin', 'staff']), createCamper);
router.post('/enroll', enrollCamper);
router.put('/:id', roleCheck(['admin', 'staff']), updateCamper);
router.delete('/:id', roleCheck(['admin']), deleteCamper);

module.exports = router;
