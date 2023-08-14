import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "./../models/userModel.js";
import bcrypt from "bcryptjs";

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			const user = await User.findOne({ email: username }).exec();
			if (!user) {
				return done(null, false, { message: "Incorrect email" });
			}
			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: "Incorrect password" });
			}
			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
	try {
		const user = await User.findById(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});

export default passport;
