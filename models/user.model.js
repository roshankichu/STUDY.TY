const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'icds', 'superadmin',] },
    icds: { type: mongoose.Schema.Types.ObjectId, ref: 'icds', required: true },
  },

);
const User = mongoose.model("user", userSchema);
module.exports = User;






