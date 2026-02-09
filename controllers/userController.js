import bcrypt from 'bcryptjs';
import User from '../model/User.js';

export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "userName, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }

    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Register successful",
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect",
      });
    }

    if (!user.apiKey) {
      user.generateApiKey();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        apiKey: user.apiKey,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
