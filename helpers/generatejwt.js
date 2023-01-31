const jwt = require("jsonwebtoken");
require("dotenv").config();

const options = {
  expiresIn: "3000000h",
};

async function generateJwt(payload) {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, options);
    return { error: false, token: token };
  } catch (error) {
    console.log(error)
    return { error: true };
  }
}

module.exports = { generateJwt };