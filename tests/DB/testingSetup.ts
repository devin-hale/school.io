import ClassModel from '../../models/classModel';
import UserModel from '../../models/userModel';
import OrgModel from '../../models/orgModel';
import mongoose from 'mongoose';

async function initializeTestDB () : Promise<void> {
    const testOrg = new OrgModel({
        name: "Test Org"
    });
    const saveTestOrg = await testOrg.save(); 

    const testUser = new UserModel({
        first_name: "Billy",
        last_name: "Johnson",
        email: "bjohnson@gmail.com",
        password: "1234",
        gender: "M",
        verifed: true, 
        org: saveTestOrg._id
    });

   const saveTestUser =  await testUser.save();

   const testClass = new ClassModel({
      name: "Test Class",
      grade_level: "1",
      subject: "Test",
      teachers: [testUser._id]
   })
   const saveTestClass = await testClass.save();
};


export default initializeTestDB;
