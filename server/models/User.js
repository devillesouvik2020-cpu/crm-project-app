const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  mobileNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  userType: {
    type: String,
    enum: ['Admin', 'Project Manager', 'Site Engineer', 'Supervisor', 'Site Manager', 'Worker'],
    default: 'Admin'
  },
  designation: { type: String, default: '' },
  assignedProjectIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  languagePref: { type: String, default: 'en' },
  profilePhoto: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
