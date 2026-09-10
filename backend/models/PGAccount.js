const mongoose = require('mongoose');

const PGAccountSchema = new mongoose.Schema({
  pgName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('PGAccount', PGAccountSchema);
