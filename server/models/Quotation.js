const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
  serialNumber: { type: Number },
  clientName: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  projectName: { type: String, default: '' },
  description: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  validUntil: { type: Date },
  status: { type: String, enum: ['Draft', 'Sent', 'Accepted', 'Rejected'], default: 'Draft' },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    total: Number
  }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

quotationSchema.pre('save', async function() {
  if (this.isNew) {
    const lastQuotation = await this.constructor.findOne().sort({ serialNumber: -1 });
    this.serialNumber = lastQuotation ? lastQuotation.serialNumber + 1 : 1;
  }
});

module.exports = mongoose.model('Quotation', quotationSchema);
