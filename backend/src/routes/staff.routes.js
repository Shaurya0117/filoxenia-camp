const express = require('express');
const { getStaff, createStaff, updateStaff } = require('../controllers/staff.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', roleCheck(['admin', 'staff']), getStaff);
router.post('/', roleCheck(['admin']), createStaff);
router.put('/:id', roleCheck(['admin']), updateStaff);

module.exports = router;
