const mongoose = require("mongoose");
const validator = require("validator");
const { ERROR_MESSAGES } = require("../utils/constants");


const userSchema = new mongoose.Schema({
 name: {
    type: String, 
     required: true,
     minlength: 2,
     maxlength: 30
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

module.exports = mongoose.model("user", userSchema);