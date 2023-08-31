import mongoose, { ObjectId } from "mongoose";
import { Schema } from "mongoose";

export interface UserInterface {
	_id: ObjectId,
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    gender: "M" | "F" | "Nonspecified",
    verified: Boolean,
    accType?: string,
    org: ObjectId
}

const userSchema : Schema = new mongoose.Schema<UserInterface>({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	gender: { type: String, required: true, enum: ["M", "F", "Nonspecified"] },
	verified: { type: Boolean, default: false },
	accType: { type: String, default: "Basic" },
	org: { type: Schema.Types.ObjectId, ref: "organizations" },
});

userSchema.virtual("url").get(function () : string {
	return `/users/${this._id}`;
});

userSchema.virtual("fullName").get(function () : string {
	return `${this.first_name} ${this.last_name}`;
});

export default mongoose.model<UserInterface>("users", userSchema);
