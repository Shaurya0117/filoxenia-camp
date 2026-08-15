const express = require('express');
const { getGroups, createGroup, assignCamperToGroup } = require('../controllers/groups.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

const router = express.Router();

router.use(auth);

router.get('/', getGroups);
router.post('/', roleCheck(['admin', 'staff']), createGroup);
router.post('/:id/members', roleCheck(['admin', 'staff']), assignCamperToGroup);

module.exports = router;
