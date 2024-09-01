const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ status: false, msg: "User not found" });
    }
    return res
      .status(200)
      .json({ user, status: true, msg: "Profile found successfully.." });
  } catch (error) {
    // Log the error for debugging
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all the fields" });
    }

    // Data type validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({ msg: "Please send string values only" });
    }

    // Password length validation
    if (password.length < 4) {
      return res
        .status(400)
        .json({ msg: "Password length must be atleast 4 characters" });
    }

    // Email validation
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: "Invalid Email" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "This email is already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Send success response
    res
      .status(200) // Use 201 Created status code for successful creation
      .json({ msg: "Congratulations!! Account has been created for you.." });
  } catch (err) {
    // Log the error for debugging
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

const validateEmail = (email) => {
  // Basic email validation (replace with a more robust solution if needed)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

module.exports = { getProfile, signup };
