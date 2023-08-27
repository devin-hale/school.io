import mongoose from "mongoose";
import ClassModel from '../../models/classModel';
import UserModel from '../../models/userModel';

function initalizeTestDB () : void {
    const User1  = new UserModel({
        first_name: "Billy",
        last_name: "Johnson",
        email: "bjohnson@gmail.com",
        password: "1234",
        gender: "M",
        verifed: true, 
    })
}
