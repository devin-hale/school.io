import User, { UserInterface } from "./../models/userModel.js";
import Org from "./../models/orgModel.js";
import asyncHandler from "express-async-handler";
import { RequestHandler } from "express";
import { param, body, validationResult, Result } from "express-validator";
import bcrypt from "bcryptjs";
import authController from "./emailAuthController.js";
import util from "util";

const get_user: RequestHandler[] = [
    param("userId")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next): Promise<void> => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const singleUser: UserInterface | null = await User.findById({ _id: req.params.userId }, { password: 0 }).lean().exec()

                if (singleUser) {
                    res.json(singleUser);
                } else {
                    res.status(404).json({ message: "User could not be found." })
                }
            } catch (error) {
                next(error)
            }
        }
    })

]
const create_account: RequestHandler[] = [
    body("first_name", "First name must contain at least 1 character.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("last_name", "Last name must contain at least 1 character.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("email")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Email is required.")
        .bail()
        .isEmail()
        .withMessage("Email not valid.")
        .bail()
        .escape(),
    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long.")
        .bail()
        .escape(),

    asyncHandler(async (req, res,) => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            const emailExists: UserInterface | null = await User.findOne({ email: req.body.email }).exec();

            if (!emailExists) {
                const organization = await Org.findOne({
                    orgCode: req.body.orgCode,
                }).exec();
                const hashAsync = util.promisify(bcrypt.hash);
                const hashedPass = await hashAsync(req.body.password, 10);

                const newUser = new User({
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    email: req.body.email,
                    gender: req.body.gender,
                    password: hashedPass,
                    org: organization?._id,
                });

                const savedUser = await newUser.save();

                authController.createAuth(savedUser, req);

                res.status(201).json({ message: "Account created." })
            } else {
                res.status(400).json({ message: "Email already in use." })
            }
        }
    }),
];

export default { get_user, create_account };
