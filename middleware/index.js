const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config({ path: "../.env" });
const { ACCESS_TOKEN_SECRET } = process.env;

console.log(ACCESS_TOKEN_SECRET);
exports.verifyAccessToken = async (req, res, next) => {
  const tokenstring = req.header("Authorization");
  const parts = tokenstring ? tokenstring.split(" ") : "";
  const token = tokenstring ? parts[1] : " ";
  console.log(token);
  if (!token)
    return res.status(400).json({ status: false, msg: "Token not found" });
  let user;
  try {
    user = jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (err) {
    return res.status(401).json({ status: false, msg: "Invalid token" });
  }

  try {
    user = await User.findById(user.id);
    if (!user) {
      return res.status(401).json({ status: false, msg: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ status: false, msg: "Internal Server Error" });
  }
};
