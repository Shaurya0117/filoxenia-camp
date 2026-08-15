const express = require('express');
const { getCheckinLogs, scanQR } = require('../controllers/checkin.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', roleCheck(['admin', 'staff']), getCheckinLogs);
router.post('/scan', roleCheck(['admin', 'staff']), scanQR);

module.exports = router;
