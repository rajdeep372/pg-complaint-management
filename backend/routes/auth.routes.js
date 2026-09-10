const express = require('express');
const { registerOwner, login, getMe, acceptInvite } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerOwner);
router.post('/login', login);
router.put('/accept-invite', protect, acceptInvite);
router.get('/me', protect, getMe);

module.exports = router;
