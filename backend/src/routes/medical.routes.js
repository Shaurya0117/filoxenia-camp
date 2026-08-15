const express = require('express');
const { getMedicalRecords, createOrUpdateMedicalRecord, reviewMedicalRecord } = require('../controllers/medical.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', roleCheck(['admin', 'staff', 'doctor']), getMedicalRecords);
router.post('/', roleCheck(['admin', 'staff', 'parent']), createOrUpdateMedicalRecord);
router.put('/:id/review', roleCheck(['admin', 'doctor']), reviewMedicalRecord);

module.exports = router;
