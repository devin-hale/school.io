import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String },
	gender: { type: String, required: true, enum: ["M", "F", "Nonspecified"] },
	dob: { type: Date },
	verified: { type: Boolean, default: false },
});

userSchema.virtual("url").get(function () {
	return `/users/${this._id}`;
});

export default mongoose.model("users", userSchema);
