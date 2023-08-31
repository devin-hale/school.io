import mongoose, { ObjectId, Schema } from "mongoose";
import codeGen from "./utils/codeGen.js";

export interface OrgInterface {
	_id: ObjectId,
    name: string,
    color?: string,
    orgCode?: () => string
}

const orgSchema : Schema = new mongoose.Schema<OrgInterface>({
	name: { type: String, required: true },
	color: { type: String, default: "blue" },
	orgCode: { type: String, default: codeGen },
});

orgSchema.virtual("url").get(function () : string {
	return `/organization/${this._id}`;
});

export default mongoose.model<OrgInterface>("organizations", orgSchema);
