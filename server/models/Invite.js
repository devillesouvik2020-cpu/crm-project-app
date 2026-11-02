const mongoose = require('mongoose');

const inviteSchema = new mongoose.Schema({
  userType: { type: String, enum: ['Site Engineer', 'Supervisor', 'Site Manager', 'Worker'], required: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  mobileNumber: { type: String, required: true },
  designation: { type: String, default: '' },
  assignedProjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  inviteStatus: { type: String, enum: ['Pending', 'Accepted', 'Expired'], default: 'Pending' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Invite', inviteSchema);
