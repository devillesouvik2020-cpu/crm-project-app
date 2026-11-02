const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  serialNumber: { type: Number },
  clientName: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  company: { type: String, default: '' },
  projectType: { type: String, default: '' },
  estimatedValue: { type: Number, default: 0 },
  source: { type: String, default: '' },
  details: { type: String, default: '' },
  status: { type: String, enum: ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'], default: 'New' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Auto-increment serialNumber
leadSchema.pre('save', async function() {
  if (this.isNew) {
    const lastLead = await this.constructor.findOne().sort({ serialNumber: -1 });
    this.serialNumber = lastLead ? lastLead.serialNumber + 1 : 1;
  }
});

module.exports = mongoose.model('Lead', leadSchema);
