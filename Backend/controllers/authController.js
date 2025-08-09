const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');  // Email utility import
const { isValidEmail, isValidPassword, isValidName, isPasswordPwned } = require('../validators/userValidators');

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isValidName(name)) {
      return res.status(400).json({ message: 'Invalid name. Use letters and spaces only.' });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid or disposable email address.' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ message: 'Password must be minimum 8 characters, include uppercase, lowercase, number, and special character.' });
    }

    if (await isPasswordPwned(password)) {
      return res.status(400).json({ message: 'This password has appeared in a data breach. Please choose another.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Email sending code here
    try {
      const subject = 'Welcome to EmoFH-AI!';
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; color: #4B0082; padding: 20px;">
          <h1 style="color: #FF6F61;">Hello ${newUser.name},</h1>
          <p style="font-size: 16px;">
            Thank you for registering at <strong>EmoFH-AI</strong>!
          </p>
          <hr style="border: none; height: 2px; background: linear-gradient(90deg, #4B0082, #FF6F61);" />
          <p style="font-size: 14px; color: #555;">
            We're excited to have you on board. If you have any questions, feel free to reply to this email.
          </p>
          <p style="font-size: 14px; color: #555;">Cheers,<br />The <strong>EmoFH-AI</strong> Team 💜</p>
        </div>
      `;
      await sendEmail(newUser.email, subject, htmlContent);
    } catch (error) {
      console.error('Email sending failed:', error);
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        console.error('Error in loginUser:', error);
        res.status(500).json({ message: 'Server error' });
    }
};