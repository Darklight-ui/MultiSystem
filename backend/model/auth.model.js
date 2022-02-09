/** @format */

const mongoose = require("mongoose");
const validator = require('validator')


// UserSchema
const userSchema = new mongoose.Schema(
	{
		fullname: { type: String, required: true },
		username: { type: String, required: true, unique: true },
		email: {
			type: String,
			required: true,
			unique: true,
			validate: [validator.isEmail, "Email is invalid"],
		},
		password: { type: String, required: true, select: false },
		profilePhoto: { type: String, default: "" },
	},
	{ timestamps: true },
);

module.exports = mongoose.model("User Info", userSchema);
