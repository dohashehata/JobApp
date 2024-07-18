



import bcrypt from 'bcryptjs';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User, findOne } from './user.model.js';
const JWT_SECRET = process.env.JWT_SECRET;
//1 Sign Up
const signUp = async (req, res) => {
  const { firstName, lastName, email, password, recoveryEmail, DOB, mobileNumber, role } = req.body;

  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date().required(),
    mobileNumber: Joi.string().required(),
    role: Joi.string().valid('User', 'Company_HR').required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await findOne({ email });
    if (user) return res.status(400).send('User already exists');

    user = new User({
      firstName,
      lastName,
      email,
      password,
      recoveryEmail,
      DOB,
      mobileNumber,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// 2Sign In
const signIn = async (req, res) => {
  const { email, password, mobileNumber, recoveryEmail } = req.body;

  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().required(),
    mobileNumber: Joi.string(),
    recoveryEmail: Joi.string().email(),
  }).or('email', 'mobileNumber', 'recoveryEmail');

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    let user = await findOne({
      $or: [{ email }, { mobileNumber }, { recoveryEmail }],
    });
    if (!user) return res.status(400).send('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid credentials');

    user.status = 'online';
    await user.save();

    const payload = {
      id: user._id,
      role: user.role,
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

//3 Update Account
const updateAccount = async (req, res) => {
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;

  const schema = Joi.object({
    email: Joi.string().email(),
    mobileNumber: Joi.string(),
    recoveryEmail: Joi.string().email(),
    DOB: Joi.date(),
    lastName: Joi.string(),
    firstName: Joi.string(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    // Check for conflicts with existing data
    if (email && email !== user.email) {
      let existingUser = await findOne({ email });
      if (existingUser) return res.status(400).send('Email already exists');
    }

    if (mobileNumber && mobileNumber !== user.mobileNumber) {
      let existingUser = await findOne({ mobileNumber });
      if (existingUser) return res.status(400).send('Mobile number already exists');
    }

    // Update user fields
    user.email = email || user.email;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.recoveryEmail = recoveryEmail || user.recoveryEmail;
    user.DOB = DOB || user.DOB;
    user.lastName = lastName || user.lastName;
    user.firstName = firstName || user.firstName;

    await user.save();
    res.send('Account updated successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
// 4Delete Account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.id !== user.id) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Account deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
//5 Get User
const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (req.user.id !== user.id.toString()) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

//6 getUserProfile
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Limit the fields returned for privacy reasons
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    res.json(userProfile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};




//7 Update Password
const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const schema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).send('User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).send('Current password is incorrect');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.send('Password updated successfully');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};



// 8forgetPasswordHandler
const OTP_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const forgetPasswordHandler = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Schema for different phases
  const schemaSendOTP = Joi.object({
    email: Joi.string().email().required(),
  });

  const schemaVerifyOTP = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });

  const schemaResetPassword = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
    newPassword: Joi.string().min(6).required(),
  });

  try {
    let user;
    let { error } = schemaSendOTP.validate(req.body);
    if (!error) {
      // Send OTP phase
      user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });

      const otp = crypto.randomBytes(3).toString('hex');
      const otpExpiry = Date.now() + OTP_EXPIRATION_TIME;

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      };

      await transporter.sendMail(mailOptions);

      return res.json({ message: 'OTP sent to your email' });
    }

    // Verify OTP phase
    error = schemaVerifyOTP.validate(req.body).error;
    if (!error) {
      user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });

      if (user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      return res.json({ message: 'OTP verified' });
    }

    // Reset Password phase
    error = schemaResetPassword.validate(req.body).error;
    if (!error) {
      user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'User not found' });

      if (user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();

      return res.json({ message: 'Password reset successfully' });
    }

    return res.status(400).json({ error: 'Invalid request' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

//9 Get Accounts by Recovery Email
const getAccountsByRecoveryEmail = async (req, res) => {
  const { recoveryEmail } = req.params;

  try {
    const users = await User.find({ recoveryEmail });
    if (!users.length) return res.status(404).send('No accounts found with the given recovery email');

    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};



export {updatePassword,getAccountsByRecoveryEmail,forgetPasswordHandler, signUp, signIn, deleteAccount, getUserData, getUserProfile ,updateAccount};


