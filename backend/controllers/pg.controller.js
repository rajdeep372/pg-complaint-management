const PGAccount = require('../models/PGAccount');
const User = require('../models/User');

// @desc    Create PG Account
// @route   POST /api/pg
// @access  Private (Owner)
exports.createPGAccount = async (req, res) => {
  try {
    const { pgName, address } = req.body;

    // Check if user already has a PG Account
    const existingPG = await PGAccount.findOne({ ownerId: req.user.id });
    if (existingPG) {
      return res.status(400).json({ success: false, message: 'Owner already has a PG account' });
    }

    const pgAccount = await PGAccount.create({
      pgName,
      address,
      ownerId: req.user.id
    });

    // Update Owner's pgAccountId
    await User.findByIdAndUpdate(req.user.id, { pgAccountId: pgAccount._id });

    res.status(201).json({ success: true, pgAccount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get PG Account details
// @route   GET /api/pg
// @access  Private
exports.getPGAccount = async (req, res) => {
  try {
    if (!req.user.pgAccountId) {
      return res.status(404).json({ success: false, message: 'No PG account associated with this user' });
    }

    const pgAccount = await PGAccount.findById(req.user.pgAccountId).populate('ownerId', 'name email');
    res.status(200).json({ success: true, pgAccount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update PG Account
// @route   PUT /api/pg
// @access  Private (Owner)
exports.updatePGAccount = async (req, res) => {
  try {
    if (!req.user.pgAccountId) {
      return res.status(404).json({ success: false, message: 'No PG account associated with this user' });
    }

    let pgAccount = await PGAccount.findById(req.user.pgAccountId);
    
    if (pgAccount.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this PG account' });
    }

    pgAccount = await PGAccount.findByIdAndUpdate(req.user.pgAccountId, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, pgAccount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
