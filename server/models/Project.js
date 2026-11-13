const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectPhotoUrl: { type: String, default: '' },
  address: { type: String, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  projectValue: { type: Number, default: 0 },
  assignedStaff: [{
    name: String,
    designation: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  partyName: { type: String, default: '' },
  description: { type: String, default: '' },
  payrollPeopleCount: { type: Number, default: 0 },
  attachments: [{ name: String, url: String, type: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Planning', 'Active', 'Completed', 'On Hold'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
