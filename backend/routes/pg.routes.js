const express = require('express');
const { createPGAccount, getPGAccount, updatePGAccount } = require('../controllers/pg.controller');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.route('/')
  .post(protect, authorize('Owner'), createPGAccount)
  .get(protect, getPGAccount)
  .put(protect, authorize('Owner'), updatePGAccount);

module.exports = router;
