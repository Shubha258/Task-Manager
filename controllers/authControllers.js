const User = require("../models/user");
const bcrypt = require("bcrypt");
const { createAccessToken } = require("../utils/token");


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: false, msg: "Please enter all details!!" });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user)
      return res
        .status(400)
        .json({ status: false, msg: "This email is not registered!!" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, msg: "Password incorrect!!" });

    // Generate access token
    const token = createAccessToken({ id: user._id });

    // Remove password from response
    delete user.password;

    // Send response
    res
      .status(200)
      .json({ token, user, status: true, msg: "Login successful.." });
  } catch (err) {

    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};

// Implement the validateEmail function
function validateEmail(email) {
  // You can use a regular expression to validate the email format
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

module.exports = {login };
