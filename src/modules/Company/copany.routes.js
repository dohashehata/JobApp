import { Router } from 'express';
import { addCompany, deleteCompany, getApplicationsForJob, getCompanyData, searchCompany, updateCompany } from './company.controller.js';
import auth from '../../middleware/auth.js';
import authorize from '../../middleware/authorize.js';

const companyRouter = Router();

companyRouter.post('/add', auth(), authorize(['Company_HR']), addCompany);
companyRouter.put('/update/:id', auth(), authorize('Company_HR'), updateCompany );
companyRouter.delete('/delete/:id', auth(), authorize(['Company_HR']), deleteCompany);
companyRouter.get('/getCompany/:id', auth(), authorize(['Company_HR']), getCompanyData);
companyRouter.get('/search', auth(), authorize(['Company_HR', 'User']), searchCompany);
companyRouter.get('/job/:jobId/applications', auth(), authorize(['Company_HR']), getApplicationsForJob)
export default companyRouter;
