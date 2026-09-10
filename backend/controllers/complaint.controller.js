const Complaint = require('../models/Complaint');

// @desc    Create Complaint
// @route   POST /api/complaints
// @access  Private (All roles)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, tenantId } = req.body;

    let targetTenantId = req.user.id; // Default to self if tenant

    // If Owner or Editor, they can register for a tenant
    if (req.user.role === 'Owner' || req.user.role === 'Editor') {
      if (!tenantId) {
        return res.status(400).json({ success: false, message: 'Please provide a tenantId' });
      }
      targetTenantId = tenantId;
    }

    const complaint = await Complaint.create({
      title,
      description,
      tenantId: targetTenantId,
      createdBy: req.user.id
    });

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Complaints
// @route   GET /api/complaints
// @access  Private
exports.getComplaints = async (req, res) => {
  try {
    let complaints;

    if (req.user.role === 'Tenant') {
      // Tenants see only their own
      complaints = await Complaint.find({ tenantId: req.user.id }).populate('tenantId', 'name').sort('-createdAt');
    } else {
      // Owners and Editors see all in their PG
      // However, we need to filter by PG Account. The simplest way is to populate tenant and filter, or just fetch all tenants in this PG and filter complaints by tenantId
      const User = require('../models/User');
      const pgTenants = await User.find({ pgAccountId: req.user.pgAccountId, role: 'Tenant' }).select('_id');
      const tenantIds = pgTenants.map(t => t._id);

      complaints = await Complaint.find({ tenantId: { $in: tenantIds } }).populate('tenantId', 'name').populate('createdBy', 'name role').sort('-createdAt');
    }

    res.status(200).json({ success: true, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Complaint Status
// @route   PUT /api/complaints/:id
// @access  Private (Owner, Editor)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
