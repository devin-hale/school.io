function checkUser(req, res, next) {
	if (req.user) {
		res.locals.currentUser = req.user;
		next();
	} else {
		res.redirect("/");
	}
}

export default { checkUser };
