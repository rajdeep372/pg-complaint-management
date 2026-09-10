const express = require('express');
const { addEditor, addTenant, getUsers } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.route('/')
  .get(protect, authorize('Owner', 'Editor'), getUsers);

router.route('/editor')
  .post(protect, authorize('Owner'), addEditor);

router.route('/tenant')
  .post(protect, authorize('Owner', 'Editor'), addTenant);

module.exports = router;
