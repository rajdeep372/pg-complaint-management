const User = require('../models/User');

// @desc    Add Editor
// @route   POST /api/users/editor
// @access  Private (Owner)
exports.addEditor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.user.pgAccountId) {
      return res.status(400).json({ success: false, message: 'Owner must have a PG account before adding staff' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const editor = await User.create({
      name,
      email,
      password,
      role: 'Editor',
      pgAccountId: req.user.pgAccountId,
      inviteStatus: 'pending' // Editors start as pending
    });

    res.status(201).json({ success: true, message: 'Editor added successfully', user: { id: editor._id, name: editor.name, email: editor.email, inviteStatus: editor.inviteStatus } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add Tenant
// @route   POST /api/users/tenant
// @access  Private (Owner, Editor)
exports.addTenant = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!req.user.pgAccountId) {
      return res.status(400).json({ success: false, message: 'Must have a PG account associated' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const tenant = await User.create({
      name,
      email,
      password,
      role: 'Tenant',
      pgAccountId: req.user.pgAccountId,
      inviteStatus: 'none' // Tenants don't need to accept an invite in this flow
    });

    res.status(201).json({ success: true, message: 'Tenant added successfully', user: { id: tenant._id, name: tenant.name, email: tenant.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users for the PG
// @route   GET /api/users
// @access  Private (Owner, Editor)
exports.getUsers = async (req, res) => {
  try {
    if (!req.user.pgAccountId) {
      return res.status(400).json({ success: false, message: 'No PG associated' });
    }

    const users = await User.find({ pgAccountId: req.user.pgAccountId }).select('-password');
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
