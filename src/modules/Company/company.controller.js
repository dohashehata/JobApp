import Company from './company.model.js';
import {User} from '../users/user.model.js'; 
import Joi from 'joi';
import Job from '../Job/job.model.js'
import Application from '../Application/application.model.js'
// 1 addCompany
const addCompany = async (req, res) => {
  const { companyName, description, industry, address, numberOfEmployees, companyEmail, companyHR } = req.body;

  const schema = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().required(),
    companyEmail: Joi.string().email().required(),
    companyHR: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    
    const user = await User.findById(companyHR);
    if (!user || user.role !== 'Company_HR') {
      return res.status(400).json({ msg: 'Invalid companyHR user' });
    }

    const newCompany = new Company({
      companyName,
      description,
      industry,
      address,
      numberOfEmployees,
      companyEmail,
      companyHR
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};




// updateCompany
const updateCompany = async (req, res) => {
  const { id } = req.params;
  const { companyName, description, industry, address, numberOfEmployees, companyEmail } = req.body;

  const schema = Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.string().required(),
    companyEmail: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ msg: error.details[0].message });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    if (company.companyHR.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    company.companyName = companyName;
    company.description = description;
    company.industry = industry;
    company.address = address;
    company.numberOfEmployees = numberOfEmployees;
    company.companyEmail = companyEmail;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

  

//************** */ 3deleteCompany


const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.id;

    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    if (company.companyHR.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await company.remove();
    res.status(200).json({ msg: 'Company deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


// 4getCompanyData
const getCompanyData = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.user.id;

    const company = await Company.findById(companyId).populate('companyHR', 'username role');

    if (!company) {
      return res.status(404).json({ msg: 'Company not found' });
    }

    if (company.companyHR._id.toString() !== userId) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    const jobs = await Job.find({ companyId: companyId });

    res.status(200).json({ company, jobs });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 5searchCompany
const searchCompany = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ msg: 'Please provide a company name to search' });
    }

    const companies = await Company.find({ companyName: new RegExp(name, 'i') });

    if (companies.length === 0) {
      return res.status(404).json({ msg: 'No companies found' });
    }

    res.status(200).json(companies);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};





//*********************** */ getApplicationsForJob 
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { user } = req;

    // Find the job and populate the company to verify the companyHR
    const job = await Job.findById(jobId).populate('companyId');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if the authenticated user is the companyHR for the job's company
    if (String(job.companyId.companyHR) !== String(user._id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    // Get all applications for the specific job and populate user data
    const applications = await Application.find({ jobId }).populate('userId', '-password');
    res.status(200).json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

export {
  addCompany,
  updateCompany,
  deleteCompany,
  getCompanyData,
  searchCompany,
  getApplicationsForJob
};
