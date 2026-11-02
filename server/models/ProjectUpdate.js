const mongoose = require('mongoose');

const projectUpdateSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  dprs: [{
    date: { type: Date, default: Date.now },
    laborCount: { type: Number, default: 0 },
    floorTowerDetails: { type: String, default: '' },
    materialNotes: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  transactions: [{
    amount: { type: Number, default: 0 },
    type: { type: String, enum: ['Expense', 'Income', 'Billing'], default: 'Expense' },
    date: { type: Date, default: Date.now },
    remarks: { type: String, default: '' }
  }],
  siteProgress: [{
    progressPercentage: { type: Number, default: 0 },
    photoUrls: [String],
    remarks: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],
  tasks: [{
    problem: { type: String, default: '' },
    plan: { type: String, default: '' },
    solution: { type: String, default: '' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    createdAt: { type: Date, default: Date.now }
  }],
  designs: [{
    fileUrl: { type: String },
    title: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  files: [{
    fileUrl: { type: String },
    fileName: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now }
  }],
  meetings: [{
    date: { type: Date },
    agenda: { type: String, default: '' },
    participants: [String],
    notes: { type: String, default: '' }
  }]
});

module.exports = mongoose.model('ProjectUpdate', projectUpdateSchema);
