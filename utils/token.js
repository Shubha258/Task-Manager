const jwt = require("jsonwebtoken");
require("dotenv").config();
const { ACCESS_TOKEN_SECRET } = process.env;
console.log({ ACCESS_TOKEN_SECRET });
const createAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET);
};

module.exports = {
  createAccessToken,
};
