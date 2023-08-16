import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String },
	gender: { type: String, required: true, enum: ["M", "F", "Nonspecified"] },
	verified: { type: Boolean, default: false },
	accType: { type: String, default: "Basic" },
	org: { type: Schema.Types.ObjectId, ref: "organizations" },
});

userSchema.virtual("url").get(function () {
	return `/users/${this._id}`;
});

userSchema.virtual("fullName").get(function () {
	return `${this.first_name} ${this.last_name}`;
});

export default mongoose.model("users", userSchema);
