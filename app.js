


import express from 'express';
import dotenv from 'dotenv';
import dbConnection from './db/dbConnection.js';
import userRouter from './src/modules/users/users.routes.js';
import companyRouter from './src/modules/Company/copany.routes.js';
import jobRouter from './src/modules/Job/job.rotues.js';
import appRouter from './src/modules/Application/application.routes.js';



dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Connect Database
dbConnection();
const uploadDestination = process.env.UPLOAD_DESTINATION;


app.use('/users', userRouter);
app.use('/company', companyRouter);
app.use('/job', jobRouter);
app.use('/App', appRouter);
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
