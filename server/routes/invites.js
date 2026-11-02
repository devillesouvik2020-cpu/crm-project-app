const express = require('express');
const bcrypt = require('bcryptjs');
const Invite = require('../models/Invite');
const User = require('../models/User');
const Project = require('../models/Project');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Create invite
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { userType, name, email, mobileNumber, designation, assignedProjectId } = req.body;

    // Create the invite record
    const invite = new Invite({
      userType, name, email, mobileNumber, designation,
      assignedProjectId, invitedBy: req.user.id
    });
    await invite.save();

    // Auto-create user account with default password (mobile number)
    let user = await User.findOne({ mobileNumber });
    if (!user) {
      const passwordHash = await bcrypt.hash(mobileNumber, 10);
      user = new User({
        name, email, mobileNumber, passwordHash,
        userType, designation,
        assignedProjectIds: [assignedProjectId]
      });
      await user.save();
    } else {
      // Add project to existing user
      if (!user.assignedProjectIds.includes(assignedProjectId)) {
        user.assignedProjectIds.push(assignedProjectId);
        await user.save();
      }
    }

    // Add user to project's assigned staff
    const project = await Project.findById(assignedProjectId);
    if (project) {
      project.assignedStaff.push({ name, designation, userId: user._id });
      await project.save();
    }

    res.status(201).json({ invite, message: `Invite created. User can login with mobile: ${mobileNumber}, password: ${mobileNumber}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all invites
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const invites = await Invite.find().populate('assignedProjectId', 'projectName').sort({ createdAt: -1 });
    res.json(invites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete invite
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Invite.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invite deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
