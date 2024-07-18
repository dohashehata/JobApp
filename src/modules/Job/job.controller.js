import Job from './job.model.js'
import Application from '../Application/application.model.js'
import Joi from 'joi';



// addJob


const addJob = async (req, res) => {
  const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy } = req.body;

  const schema = Joi.object({
    jobTitle: Joi.string().required(),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
    workingTime: Joi.string().valid('part-time', 'full-time').required(),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
    jobDescription: Joi.string().required(),
    technicalSkills: Joi.array().items(Joi.string()).required(),
    softSkills: Joi.array().items(Joi.string()).required(),
    addedBy: Joi.string().required()  // Ensure addedBy is included in Joi validation
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const newJob = new Job({
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      addedBy
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};



// 
const updateJob = async (req, res) => {
    const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, addedBy } = req.body;
    const jobId = req.params.id;  // Ensure the parameter name matches
  
    // Validate request body
    const schema = Joi.object({
      jobTitle: Joi.string(),
      jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
      workingTime: Joi.string().valid('part-time', 'full-time'),
      seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
      jobDescription: Joi.string(),
      technicalSkills: Joi.array().items(Joi.string()),
      softSkills: Joi.array().items(Joi.string()),
      addedBy: Joi.string().required()
    });
  
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }
  
    try {
      // Find the job by ID and update
      const updatedJob = await Job.findByIdAndUpdate(jobId, {
        jobTitle,
        jobLocation,
        workingTime,
        seniorityLevel,
        jobDescription,
        technicalSkills,
        softSkills,
        addedBy
      }, { new: true });
  
      if (!updatedJob) {
        return res.status(404).json({ msg: 'Job not found' });
      }
  
      res.json(updatedJob);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };



  

// ***********************3deleteJob
const deleteJob = async (req, res) => {
  const jobId = req.params.id;

  try {
    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json({ msg: 'Job deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


//4 GET /job/all
 const getAllJobsWithCompany= async (req, res) => {
    try {
      
      const jobs = await Job.find().populate('addedBy', 'companyName'); 
  
      if (!jobs) {
        return res.status(404).json({ msg: 'No jobs found' });
      }
  
      res.json(jobs);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };


// 6allJobsSpecificCompany
 const allJobsSpecificCompany =async (req, res) => {
    const companyName = req.query.companyName;
  
    try {
      
      const jobs = await Job.find({ 'addedBy.companyName': companyName }).populate('addedBy', 'companyName');
  
      if (!jobs || jobs.length === 0) {
        return res.status(404).json({ msg: 'No jobs found for this company' });
      }
  
      res.json(jobs);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };



// 7filterJobs
const filterJobs = async (req, res) => {
  const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;

  // Define Joi validation schema for query parameters
  const schema = Joi.object({
    workingTime: Joi.string().valid('part-time', 'full-time'),
    jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid'),
    seniorityLevel: Joi.string().valid('Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'),
    jobTitle: Joi.string(),
    technicalSkills: Joi.string() // Assuming technicalSkills is a comma-separated string
  });

  try {
    // Validate query parameters against schema
    const { error, value } = schema.validate(req.query, { abortEarly: false });

    if (error) {
      // Extract validation error messages
      const errorMsg = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({ msg: errorMsg });
    }

    // Build filters based on validated query parameters
    const filters = {};
    if (value.workingTime) {
      filters.workingTime = value.workingTime;
    }
    if (value.jobLocation) {
      filters.jobLocation = value.jobLocation;
    }
    if (value.seniorityLevel) {
      filters.seniorityLevel = value.seniorityLevel;
    }
    if (value.jobTitle) {
      filters.jobTitle = new RegExp(value.jobTitle, 'i'); // Case-insensitive search
    }
    if (value.technicalSkills) {
      filters.technicalSkills = { $in: value.technicalSkills.split(',') };
    }

    // Fetch jobs based on filters and populate addedBy field
    const jobs = await Job.find(filters).populate('addedBy', 'companyName');

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ msg: 'No jobs found matching the criteria' });
    }

    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};



  //7 applyJob
  const applyJob = async (req, res) => {
    // Define Joi validation schema
    const schema = Joi.object({
      userId: Joi.string().required(),
      jobId: Joi.string().required(),
      userTechSkills: Joi.array().items(Joi.string()).required(),
      userSoftSkills: Joi.array().items(Joi.string()).required(),
      userResume: Joi.string().required() // Assuming userResume is required and a string
    });
  
    try {
      // Validate request body against schema
      const { error, value } = schema.validate(req.body, { abortEarly: false });
  
      if (error) {
        // Extract validation error messages
        const errorMsg = error.details.map(detail => detail.message).join(', ');
        return res.status(400).json({ msg: errorMsg });
      }
  
      // Create a new application document
      const { userId, jobId, userTechSkills, userSoftSkills, userResume } = value;
      const newApplication = new Application({
        userId,
        jobId,
        userTechSkills,
        userSoftSkills,
        userResume
      });
  
      // Save the application
      const savedApplication = await newApplication.save();
      res.status(201).json(savedApplication);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  





export {
  addJob,
  updateJob,
  deleteJob,
  getAllJobsWithCompany,
  allJobsSpecificCompany,
  filterJobs,
  applyJob
};
