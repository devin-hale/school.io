# school.io

## Description
### Version 0.2.1
This is the beginning stages of a project intended to act as a simple website for teachers to create, update, and store important documentation.
The idea came from listening to my wife, who is a 3rd grade teacher.  According to her, the biggest annoyance is a teacher is keeping track of
documentation.  This can be as simple as writing down "I spoke with little Billy's parents at X time on Y date.  We spoke about this...".  This
documentation comes in handy when little Billy's mom calls the principal to complain.  Keeping that documentation is a way for the classroom teacher
to CYA, because without it, nobody else will.

It can also be as extensive as tracking specific student information over time, as required by a state's board of education.  The best case scenario
is that this documentation is never requested, and never needs to be used.  The worst case scenario is that the information is requested, but doesn't exist.

What makes all of this worse, is that the teacher must create all of this documentation on top of their already stressful job of teaching.
It takes up valuable time from the teacher, and often cuts into their own personal time that could be spent with family.

Essentially, I want this application to cut that down to an absolute minimum.

## Tech
The current iteration of this model is mostly to build a usable proof of concept using a standard MVC pattern.
Tech used:
- Javascript
- nodeJS/Express
- MongoDB with Mongoose
- EJS for the view template
- Bootstrap for styling

Once the model and controller portion is complete, the plan is to fully create the view within React/NextJS, and then in React Native.

## Status

### **UPDATE: 8-17-2023(1):**
#### Data
- Data modeling for basic communication.
    - Staff to staff, staff to student, staff to student, staff to other.
    - References to give documentation view access to other staff.

### **CURRENTLY:**
- Modeling data and writing controllers for documentation and documentation types.


## Features Roadmap
[X] **Login/User Authentication**
- [X] Organization/School Model
- [X] Org Controller
- [X] User Model
- [X] User Controller
- [X] Login Page
- [X] Account Creation Page
- - [X] Org verification before signup.
- - [X] Make it look not bad.
- [X] Basic Landing Page (Will become classroom page)
- [X] Password Encryption
- [X] Account Email Verification
- [X] User/Session Authentication
- [X] Clean up form validation on client side
- [X] Clean up code

[X] **Classroom/Student**
- [X] Classroom Model
- [X] Classroom Controller
- [X] Student Model
- [X] Student Controller
- [X] Basic Classes Page
- [X] Class Instance Page
    - [] Update with relevant documentation info
- [X] Basic Student Instance Page
    - [] Update with relevant documentation info

[] **Documentation**
- [] Define documentation types
- [] Decide on forms for each
- [] Models for each
- [] Controllers for each documentation type
- [] Class-wide documentation view page
- [] Documentation creation page
    - [] Figure out method for attaching/storing image files.
- [] Page for existing documentation instances
    - [] Download as PDF.

[] **Utilities**
- [] Org Admin Page
    - [] Create classes
        - [] Assign a teacher or teachers to classes
        - [] Assign students to class (easier for Elementary)
    - [] Create students
        - [] Assign a class to students (easier for Middle/HS)
    - [] Transfer students between classes
    - [] Cross Org Student Transfer Requests
- [] Super Admin Page
    - [] Create Orgs
    - [] Create Org Admin Account
    - [] "Promote" Users to Org Admin
    - [] Data Utilities
- [] User profile
    - [] Profile Image
    - [] Editing of basic information
- [] Teacher to Teacher messaging within the same Org

[] **Long term**
- [] Convert website to jamstack format using React as the front end.
- [] React Native port
- [] SSL Certificate
- [] Disclaimers, data privacy, etc.