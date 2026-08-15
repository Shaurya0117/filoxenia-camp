const express = require('express');
const { getPeriods, getPeriodById, createPeriod, updatePeriod, deletePeriod } = require('../controllers/periods.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', getPeriods);
router.get('/:id', getPeriodById);
router.post('/', roleCheck(['admin', 'staff']), createPeriod);
router.put('/:id', roleCheck(['admin', 'staff']), updatePeriod);
router.delete('/:id', roleCheck(['admin']), deletePeriod);

module.exports = router;
