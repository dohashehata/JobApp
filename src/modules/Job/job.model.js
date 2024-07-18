// // models/Job.js
// import { Schema, model } from 'mongoose';

// const JobSchema = new Schema({
//   jobTitle: { type: String, required: true },
//   jobLocation: { type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
//   workingTime: { type: String, enum: ['part-time', 'full-time'], required: true },
//   seniorityLevel: { type: String, enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'], required: true },
//   jobDescription: { type: String, required: true },
//   technicalSkills: { type: [String], required: true },
//   softSkills: { type: [String], required: true },
//   addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Company HR ID
// });

// export default model('Job', JobSchema);


import { Schema, model } from 'mongoose';

const JobSchema = new Schema({
  jobTitle: { type: String, required: true },
  jobLocation: { type: String, enum: ['onsite', 'remotely', 'hybrid'], required: true },
  workingTime: { type: String, enum: ['part-time', 'full-time'], required: true },
  seniorityLevel: { type: String, enum: ['Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'], required: true },
  jobDescription: { type: String, required: true },
  technicalSkills: { type: [String], required: true },
  softSkills: { type: [String], required: true },
  addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }  // Assuming addedBy is a reference to User model
});

export default model('Job', JobSchema);