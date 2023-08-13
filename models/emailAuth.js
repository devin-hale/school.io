import mongoose, { Schema } from "mongoose";

const authCode = () => {
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

const emailAuthModel = new mongoose.Schema({
	user: { type: Schema.Types.ObjectId, ref: "users" },
	code: { type: String, default: authCode },
});

export default mongoose.model("emailAuth", emailAuthModel);
