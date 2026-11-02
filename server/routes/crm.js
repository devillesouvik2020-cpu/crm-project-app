const express = require('express');
const Lead = require('../models/Lead');
const Quotation = require('../models/Quotation');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// ========== LEADS ==========

// Get all leads
router.get('/leads', authMiddleware, async (req, res) => {
  try {
    const leads = await Lead.find().sort({ serialNumber: 1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lead
router.post('/leads', authMiddleware, async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, createdBy: req.user.id });
    await lead.save();
    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lead
router.put('/leads/:id', authMiddleware, async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lead
router.delete('/leads/:id', authMiddleware, async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ========== QUOTATIONS ==========

// Get all quotations
router.get('/quotations', authMiddleware, async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ serialNumber: 1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create quotation
router.post('/quotations', authMiddleware, async (req, res) => {
  try {
    const quotation = new Quotation({ ...req.body, createdBy: req.user.id });
    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update quotation
router.put('/quotations/:id', authMiddleware, async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete quotation
router.delete('/quotations/:id', authMiddleware, async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quotation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Seed sample CRM data for testing
router.post('/seed-samples', authMiddleware, async (req, res) => {
  try {
    const existingLeads = await Lead.countDocuments();
    const existingQuotations = await Quotation.countDocuments();

    let createdLeadsCount = 0;
    let createdQuotationsCount = 0;

    if (existingLeads === 0) {
      const sampleLeads = [
        {
          serialNumber: 1,
          clientName: 'M/s Greenfield Infrastructure Pvt Ltd',
          contact: '+91 98301 23456',
          email: 'contact@greenfieldinfra.in',
          company: 'Greenfield Infra',
          projectType: 'Commercial Complex (G+12)',
          estimatedValue: 45000000,
          source: 'Direct Enquiry',
          status: 'Qualified',
          details: 'Piling and RCC structure construction for IT Hub in New Town, Rajarhat.',
          createdBy: req.user.id
        },
        {
          serialNumber: 2,
          clientName: 'Apex Realty Developers',
          contact: '+91 94330 98765',
          email: 'projects@apexrealty.com',
          company: 'Apex Realty',
          projectType: 'Residential Towers',
          estimatedValue: 28000000,
          source: 'Referral',
          status: 'Proposal',
          details: 'Twin tower residential project in EM Bypass, finishing & structural work.',
          createdBy: req.user.id
        },
        {
          serialNumber: 3,
          clientName: 'Eastern Logistics Hub Ltd',
          contact: '+91 98311 55443',
          email: 'procurement@easternlogistics.com',
          company: 'Eastern Logistics',
          projectType: 'Warehouse & PEB Shed',
          estimatedValue: 18500000,
          source: 'Site Visit',
          status: 'New',
          details: '50,000 sq ft industrial PEB warehouse construction at Dankuni.',
          createdBy: req.user.id
        }
      ];
      await Lead.insertMany(sampleLeads);
      createdLeadsCount = sampleLeads.length;
    }

    if (existingQuotations === 0) {
      const sampleQuotations = [
        {
          serialNumber: 1,
          clientName: 'M/s Greenfield Infrastructure Pvt Ltd',
          projectName: 'New Town IT Complex - Phase 1',
          contact: '+91 98301 23456',
          email: 'contact@greenfieldinfra.in',
          amount: 42500000,
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          status: 'Sent',
          description: 'Comprehensive RCC foundation, superstructure, and masonry work estimate.',
          createdBy: req.user.id
        },
        {
          serialNumber: 2,
          clientName: 'Eastern Logistics Hub Ltd',
          projectName: 'Dankuni Logistics Park PEB Structure',
          contact: '+91 98311 55443',
          email: 'procurement@easternlogistics.com',
          amount: 17800000,
          validUntil: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
          status: 'Draft',
          description: 'Civil plinth, steel fabrication, sheeting and flooring work quotation.',
          createdBy: req.user.id
        }
      ];
      await Quotation.insertMany(sampleQuotations);
      createdQuotationsCount = sampleQuotations.length;
    }

    res.json({
      message: 'Sample CRM data loaded successfully',
      createdLeadsCount,
      createdQuotationsCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
