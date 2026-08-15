const express = require('express');
const { getRegistrations, createRegistration, updateRegistrationStatus } = require('../controllers/registrations.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', getRegistrations);
router.post('/', roleCheck(['admin', 'staff']), createRegistration);
router.put('/:id/status', roleCheck(['admin', 'staff']), updateRegistrationStatus);

module.exports = router;
