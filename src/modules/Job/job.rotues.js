import { Router } from 'express';
import { addJob, allJobsSpecificCompany, applyJob, deleteJob, filterJobs, getAllJobsWithCompany, updateJob } from './job.controller.js';
import auth from '../../middleware/auth.js';
import authorize from '../../middleware/authorize.js';

const jobRouter = Router();

jobRouter.post('/add', auth(), authorize(['Company_HR']), addJob);
jobRouter.put('/update/:id', auth(), authorize(['Company_HR']), updateJob);
jobRouter.delete('/delete/:id', auth(), authorize(['Company_HR']), deleteJob); 
jobRouter.get('/all', auth(), authorize(['User', 'Company_HR']), getAllJobsWithCompany);
jobRouter.get('/by-company', auth(), authorize(['User', 'Company_HR']),allJobsSpecificCompany);
jobRouter.get('/filter', auth(), authorize(['User', 'Company_HR']),filterJobs)
jobRouter.post('/apply', auth(),applyJob)
export default jobRouter;
