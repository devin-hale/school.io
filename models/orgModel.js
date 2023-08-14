import mongoose from "mongoose";
import codeGen from "./utils/codeGen.js";

const orgSchema = new mongoose.Schema({
	name: { type: String, required: true },
	color: { type: String, default: "blue" },
	orgCode: { type: String, default: codeGen },
});

orgSchema.virtual("url").get(function () {
	return `/organization/${this._id}`;
});

export default mongoose.model("organizations", orgSchema);
