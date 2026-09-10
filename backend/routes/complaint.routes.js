const express = require('express');
const { createComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaint.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .put(protect, authorize('Owner', 'Editor'), updateComplaintStatus);

module.exports = router;
