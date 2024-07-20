

import Application from './application.model.js';
import upload from '../../middleware/upload.js';
import path from 'path';

// Create application
const createApplication = async (req, res) => {
  const { jobId, userId, userTechSkills, userSoftSkills } = req.body;

  try {
    // Check if resume file was uploaded
    if (!req.file) {
      return res.status(400).json({ msg: 'Resume file is required' });
    }

    const newApplication = new Application({
      jobId,
      userId,
      userTechSkills,
      userSoftSkills,
      userResume: req.file.filename 
    });

    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export {
  createApplication,
};
