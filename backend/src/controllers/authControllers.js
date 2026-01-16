const User = require("../models/UsersModel");
const { hashPassword, comparePassword } = require("../utils/password");
const { createToken } = require("../utils/jwt");

/* SIGNUP */
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const passwordHash = await hashPassword(password);

    await User.create({
      name,
      username,
      email,
      passwordHash,
    });

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/* LOGIN */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

      const token = createToken(user._id);
       res.cookie("token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production", // true in production
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

const me = async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.userId, {
    lastSeen: new Date(),
  });

  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  me,
  logout,
};

