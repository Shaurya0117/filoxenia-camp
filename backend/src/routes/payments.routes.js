const express = require('express');
const { getPayments, createPayment, getCamperBalance } = require('../controllers/payments.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', getPayments);
router.post('/', roleCheck(['admin', 'staff', 'accountant']), createPayment);
router.get('/camper/:camper_id/balance', getCamperBalance);

module.exports = router;
