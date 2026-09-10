const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d',
  });
};

// @desc    Register Owner
// @route   POST /api/auth/register
// @access  Public
exports.registerOwner = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'Owner',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        inviteStatus: user.inviteStatus,
        pgAccountId: user.pgAccountId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept Editor Invite
// @route   PUT /api/auth/accept-invite
// @access  Private (Editor)
exports.acceptInvite = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.role !== 'Editor') {
      return res.status(403).json({ success: false, message: 'Only Editors can accept invites' });
    }

    if (user.inviteStatus !== 'pending') {
      return res.status(400).json({ success: false, message: 'No pending invite found' });
    }

    user.inviteStatus = 'accepted';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Invite accepted successfully',
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        inviteStatus: user.inviteStatus,
        pgAccountId: user.pgAccountId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
