import Student, { StudentInterface } from "./../models/studentModel.js";
import Incident from "./../models/docTypes/incidentModel.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import { RequestHandler } from "express";
import { Result, body, param, query, validationResult } from "express-validator";

const search_student: RequestHandler[] = [
    query("name")
        .optional()
        .toLowerCase()
        .escape(),

    asyncHandler(async (req, res, next): Promise<void> => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const splitName: string[] = req.query.name!.toString().split(" ")

                const firstName: RegExp = new RegExp(splitName[0], 'i')
                const lastName: RegExp = new RegExp(splitName[1], 'i')

                const searchStudent: StudentInterface[] = await Student.find({ org: req.body.token.org, $or: [{ first_name: firstName }, { last_name: lastName }] }).populate("classes").lean().exec();

                res.status(200).json(searchStudent);

            } catch (error) {
                next(error)
            }
        }
    })
]

const get_student_info: RequestHandler[] = [
    param("studentId")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const studentExists: StudentInterface | null = await Student.findOne({ _id: req.params.studentId, org: req.body.token.org }).populate("classes").lean().exec();

                if (!studentExists) {
                    res.status(404).json({ message: "Student not found." })
                } else {
                    res.status(200).json({ student: studentExists });
                }
            } catch (error) {
                next(error)
            }
        }
    })
];

const get_org_students: RequestHandler[] = [
    param("orgId")
        .trim()
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors: Result = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: "Invalid request." })
        } else {
            try {
                const studentArr: StudentInterface[] = await Student.find({ org: req.params.orgId }).populate("classes").lean().exec();

                res.status(200).json(studentArr);

            } catch (error) {
                next(error)
            }
        }
    })
];


export default { search_student, get_student_info, get_org_students };

