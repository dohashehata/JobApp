// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   username: { type: String, unique: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   recoveryEmail: { type: String },
//   DOB: { type: Date, required: true },
//   mobileNumber: { type: String, unique: true, required: true },
//   role: { type: String, enum: ['User', 'Company_HR'], required: true },
//   status: { type: String, enum: ['online', 'offline'], default: 'offline' },
// });

// UserSchema.pre('save', function (next) {
//   this.username = this.firstName + this.lastName;
//   next();
// });

// const User = mongoose.model('User', UserSchema);

// const findOne = async (conditions) => {
//   return await User.findOne(conditions);
// };

// export { User, findOne };














import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  recoveryEmail: { type: String },
  DOB: { type: Date, required: true },
  mobileNumber: { type: String, unique: true, required: true },
  role: { type: String, enum: ['User', 'Company_HR'], required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  otp: { type: String },
  otpExpiry: { type: Date },
});


UserSchema.pre('save', function (next) {
  this.username = this.firstName + this.lastName;
  next();
});

const User = mongoose.model('User', UserSchema);

const findOne = async (conditions) => {
  return await User.findOne(conditions);
};

export { User, findOne };