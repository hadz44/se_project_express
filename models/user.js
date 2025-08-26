const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { ERROR_MESSAGES } = require("../utils/constants");


const userSchema = new mongoose.Schema({
 name: {
    type: String, 
     required: true,
     minlength: 2,
     maxlength: 30
    },
 email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: ERROR_MESSAGES.INVALID_EMAIL
    }
 },
 password: {
    type: String,
    required: [true, ERROR_MESSAGES.PASSWORD_REQUIRED],
    minlength: [8, ERROR_MESSAGES.PASSWORD_TOO_SHORT],
    select: false
 },
 avatar: {
          type: String, 
          required: [true, "The avatar field is required."],
          validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: ERROR_MESSAGES.INVALID_URL
        },
        },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);