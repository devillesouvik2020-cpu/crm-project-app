const express = require('express');
const Project = require('../models/Project');
const ProjectUpdate = require('../models/ProjectUpdate');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create project
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { projectName, projectPhotoUrl, address, startDate, endDate, projectValue, assignedStaff, partyName, status } = req.body;
    const project = new Project({
      projectName, projectPhotoUrl, address, startDate, endDate,
      projectValue, assignedStaff: assignedStaff || [], partyName,
      status: status || 'Active', createdBy: req.user.id
    });
    await project.save();
    // Create associated ProjectUpdate document
    const projectUpdate = new ProjectUpdate({ projectId: project._id });
    await projectUpdate.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    let projects;
    if (req.user.userType === 'Admin' || req.user.userType === 'Project Manager') {
      projects = await Project.find().sort({ createdAt: -1 });
    } else {
      projects = await Project.find({ 'assignedStaff.userId': req.user.id }).sort({ createdAt: -1 });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await ProjectUpdate.findOneAndDelete({ projectId: req.params.id });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// === Project Updates sub-routes ===

// Get project updates
router.get('/:id/updates', authMiddleware, async (req, res) => {
  try {
    let updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    if (!updates) {
      updates = new ProjectUpdate({ projectId: req.params.id });
      await updates.save();
    }
    res.json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add DPR
router.post('/:id/dpr', authMiddleware, async (req, res) => {
  try {
    const updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    updates.dprs.push({ ...req.body, createdBy: req.user.id });
    await updates.save();
    res.status(201).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Transaction
router.post('/:id/transaction', authMiddleware, async (req, res) => {
  try {
    const updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    updates.transactions.push(req.body);
    await updates.save();
    res.status(201).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Site Progress
router.post('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    updates.siteProgress.push({ ...req.body, updatedBy: req.user.id });
    await updates.save();
    res.status(201).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Task
router.post('/:id/task', authMiddleware, async (req, res) => {
  try {
    const updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    updates.tasks.push(req.body);
    await updates.save();
    res.status(201).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Meeting
router.post('/:id/meeting', authMiddleware, async (req, res) => {
  try {
    const updates = await ProjectUpdate.findOne({ projectId: req.params.id });
    updates.meetings.push(req.body);
    await updates.save();
    res.status(201).json(updates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
