# school.io (API)

## Description

### Version 0.3.1

This is the beginning stages of a project intended to act as a simple website
for teachers to create, update, and store important documentation. The idea came
from listening to my wife, who is a 3rd grade teacher. According to her, the
biggest annoyance is a teacher is keeping track of documentation. This can be as
simple as writing down "I spoke with little Billy's parents at X time on Y date.
We spoke about this...". This documentation comes in handy when little Billy's
mom calls the principal to complain. Keeping that documentation is a way for the
classroom teacher to CYA, because without it, nobody else will.

It can also be as extensive as tracking specific student information over time,
as required by a state's board of education. The best case scenario is that this
documentation is never requested, and never needs to be used. The worst case
scenario is that the information is requested, but doesn't exist.

What makes all of this worse, is that the teacher must create all of this
documentation on top of their already stressful job of teaching. It takes up
valuable time from the teacher, and often cuts into their own personal time that
could be spent with family.

Essentially, I want this application to cut that down to an absolute minimum.

## Tech

- Javascript/Typescript
- nodeJS/Express
- MongoDB with Mongoose

## Status

### **UPDATE: 9-18-2023:**

- Moved DB related connection config to a config folder.
- Refactored app.js to typescript.
- Added chalk as a way to color code console logs.
- Testing Server/DB setup/teardown created.
- The following routes and corresponding data types have been refactored as a
  REST API in TS, with test files
  - Orgs
  - Classes
  - Users/Teachers
  - Students
  - Incidents
  - Communications
- CORS implemented. Won't know if it works properly until I start diving into
  the front end.
- Refactored index route for user login and authentication.
- User authentication implemented via JSON web tokens.
- Org limiter added to queries based on account type so that users/data from
  different org doesn't bleed over.
- Initial data model completed for PST documentation

### **NEXT:**
- Complete tests/routes/controllers for PST Doc functionality 


## Development Roadmap

[X] **Login/User Authentication**
- [x] Organization/School Model
- [x] Org Controller
- [x] User Model
- [x] User Controller
- [x] Password Encryption
- [x] Account Email Verification
- [x] User Authentication

[X] **Classroom/Student**
- [x] Class Model
- [x] Class Tests
- [x] Class Controller/Router
- [x] Student Model
- [x] Student Tests
- [x] Student Controller/Router

[] **Documentation**
- [x] Models for each type:
  - [x] Incident (fight, worrisome comments, etc)
  - [x] Commmunication (student, staff, parent, other)
  - [x] PST
- [] Controllers/Routers/Tests for each type:
  - [x] Incident (fight, worrisome comments, etc)
  - [x] Commmunication (student, staff, parent, other)
  - [] PST
- [] Serverside image storage.
- [] Download as PDF
- [] Clean up serverside sanitization

[] **Utilities**
- [] Verify Org Admin Methods
  - [] Create classes
    - [] Assign a teacher or teachers to classes
    - [] Assign students to class (easier for Elementary)
  - [] Create students
    - [] Assign a class to students (easier for Middle/HS)
  - [] Transfer students between classes
  - [] Cross Org Student Transfer Requests
- [] Verify Super Admin Methods
  - [] Create Orgs
  - [] Create Org Admin Account
  - [] "Promote" Users to Org Admin
  - [] Data Utilities
