import { Schema, model } from 'mongoose';

const CompanySchema = new Schema({
  companyName: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  industry: { type: String, required: true },
  address: { type: String, required: true },
  numberOfEmployees: { type: String, required: true },
  companyEmail: { type: String, unique: true, required: true },
  companyHR: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

export default model('Company', CompanySchema);
