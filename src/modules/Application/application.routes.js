

import { Router } from 'express';
import { createApplication } from './application.controller.js';
import upload from '../../middleware/upload.js';


const appRouter = Router();


appRouter.post('/create', upload.single('userResume'), createApplication);

export default appRouter;
