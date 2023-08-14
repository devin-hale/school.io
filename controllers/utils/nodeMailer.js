import nodemailer from "nodemailer";
import "dotenv/config.js";

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "verifyschoolio@gmail.com",
		pass: process.env.MAILPASS,
	},
});

const verifyOptions = (userEmail, authCode) => {
	return {
		from: "verifyschoolio@gmail.com",
		to: userEmail,
		subject: "Verify Your school.io Email!",
		text: `Welcome to school.io! \n
            Here is your account verification code: \n
            ${authCode} \n
        `,
	};
};

const sendVerification = (userEmail, authCode) => {
	transporter.sendMail(
		verifyOptions(userEmail, authCode),
		function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent:" + info.response);
			}
		}
	);
};

export { sendVerification };
