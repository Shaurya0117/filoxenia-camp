const express = require('express');
const router = express.Router();
const invoicesController = require('../controllers/invoices.controller');
const auth = require('../middleware/auth');

router.get('/', auth, invoicesController.getInvoices);
router.post('/', auth, invoicesController.createInvoice);
router.put('/:id', auth, invoicesController.updateInvoice);

module.exports = router;
