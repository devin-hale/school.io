import mongoose from "mongoose";

const orgCode = () => {
	function randomString(length, chars) {
		var result = "";
		for (var i = length; i > 0; --i)
			result += chars[Math.round(Math.random() * (chars.length - 1))];
		return result;
	}

	return randomString(
		6,
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	);
};

const orgSchema = new mongoose.Schema({
	name: { type: String, required: true },
	color: { type: String, default: blue },
	orgCode: { type: String, default: orgCode },
});

orgSchema.virtual("url").get(function () {
	return `/organization/${this._id}`;
});

export default mongoose.model("organization", orgSchema);
