import mongoose, { Schema } from "mongoose";
import codeGen from "./utils/codeGen.js";

interface IOrg {
    name: string,
    color?: string,
    orgCode?: () => string
}

const orgSchema : Schema = new mongoose.Schema<IOrg>({
	name: { type: String, required: true },
	color: { type: String, default: "blue" },
	orgCode: { type: String, default: codeGen },
});

orgSchema.virtual("url").get(function () : string {
	return `/organization/${this._id}`;
});

export default mongoose.model<IOrg>("organizations", orgSchema);
