import bcrypt       from 'bcrypt';
import jwt          from 'jsonwebtoken';
import userModel    from '../models/userModel.js';
import transporter  from '../config/nodemailer.js';
import otpModel from '../models/otpModel.js';
import {asyncHandler} from '../utils/asyncHandler.js'


/* ---------- REGISTER -------------------- */
export const register = async (req, res) => {

  const {email} = req.body;

  if (!email )
    return res.json({ success: false, message: 'Missing details' });

  try {
    if (await userModel.findOne({ email }))
      return res.json({ success: false, message: 'User already exists' });

        const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save/update OTP in otpModel
    await otpModel.create({
      email ,
      otp, 
      expireAt: Date.now() + 24 * 60 * 60 * 1000
     });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Account verification OTP',
      text: `Your OTP is ${otp}`,
    });

    const user = new userModel({ email });
    await user.save();

    /* Cookie */
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge : 7 * 24 * 60 * 60 * 1000,
    });

    /* Welcome mail */
    await transporter.sendMail({
      from   : process.env.SENDER_EMAIL,
      to     : email,
      subject: 'Welcome to GDSC LMS',
      text   : `Welcome – your account has been created with ${email}!`,
    });


    return res.json({
      success: true,
      message: 'Registration successful !',
      user: { 
          id: user._id,
          email: user.email,
      },
  });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- LOGIN ----------------------- */
export const login = async (req, res) => {
  const { email } = req.body;
  if (!email )
    return res.json({ success: false, message: 'Email required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'Please register first' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token', token, {
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge  : 7 * 24 * 60 * 60 * 1000,
    });

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    await otpModel.create({
      email ,
      otp, 
      expireAt: Date.now() + 24 * 60 * 60 * 1000
     });

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Account verification OTP',
      text: `Your OTP is ${otp}`,
    });

    return res.json({
      success: true,
      message: 'Login successful!', 
      user: {
          id: user._id,
          email: user.email,
      },
  });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- LOGOUT ---------------------- */
export const logout = (_req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure  : process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    return res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- SEND VERIFY‑OTP ------------- */
export const sendVerifyOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ success: false, message: 'Email is required' });

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'User already exists' });

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save/update OTP in otpModel
    await otpModel.findOneAndUpdate(
      { email },
      { otp, expireAt: Date.now() + 24 * 60 * 60 * 1000 }, // 24 hours validity
      { upsert: true, new: true }
    );

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Account verification OTP',
      text: `Your OTP is ${otp}`,
    });

    return res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('❌ sendVerifyOtp error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



/* ---------- VERIFY E‑MAIL --------------- */
export const verifyEmail = async (req, res) => {
  const { email, otp} = req.body;

  if (!email || !otp)
    return res.status(400).json({ success: false, message: 'Missing required fields' });

  try {
    // Find OTP record
    const otpRecord = await otpModel.findOne({ email });
    if (!otpRecord)
      return res.status(400).json({ success: false, message: 'OTP not found' });

    if (otpRecord.otp !== otp)
      return res.status(400).json({ success: false, message: 'Invalid OTP' });

    if (otpRecord.expireAt < Date.now())
      return res.status(400).json({ success: false, message: 'OTP expired' });

    // const hashedPassword = await bcrypt.hash(password, 10);
    // const newUser = new userModel({
    //   name,
    //   email,
    //   password: hashedPassword,
    //   isAccountVerified: true,
    // });
    // await newUser.save();

    await otpModel.deleteOne({ email });

    return res.json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    console.error('❌ verifyEmail error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


/* ---------- IS‑AUTH --------------------- */
export const isAuthenticated = (_req, res) =>{
  return res.json({ success: true });
}

/* ---------- SEND RESET‑OTP -------------- */
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.json({ success: false, message: 'Email is required' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    const otp = String(Math.floor(Math.random() * 900000 + 100000));
    user.resetOtp         = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from   : process.env.SENDER_EMAIL,
      to     : user.email,
      subject: 'Password reset OTP',
      text   : `Your OTP is ${otp}`,
    });

    return res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ---------- RESET PASSWORD -------------- */
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.json({ success: false, message: 'Enter all details' });

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: 'User not found' });

    if (user.resetOtp === '' || user.resetOtp !== otp)
      return res.json({ success: false, message: 'Invalid OTP' });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: 'OTP expired' });

    user.password        = await bcrypt.hash(newPassword, 10);
    user.resetOtp        = '';
    user.resetOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const adminLogin = asyncHandler( async(req , res)=>{

  const {email, password} = req.body;

  if(!email || !password){
    return res.json({ success: false, message: 'Email and password required' });
  };

  if(email!=process.env.ADMIN_LOGIN_EMAIL && password!=process.env.ADMIN_LOGIN_PASS){
    return res.json({ success: false, message: 'Incorrect Email and password' });
  }

  const adminToken = jwt.sign(
    {
      email
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '7d'
    }
  );

  return res
  .status(200)
  .cookie("adminToken", adminToken, {
    httpOnly : true,
    secure  : process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge  : 7 * 24 * 60 * 60 * 1000,
  })
  .json({success : true,  message : "Admin login success"})

});
