# school.io (API REFACTOR)

## Description
### Version 0.2.4
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
- Javascript/Typescript
- nodeJS/Express
- MongoDB with Mongoose


## Status

### **UPDATE: 8-23-2023(1):**
- Refactoring into jamstack.


## Development Roadmap

[]**Refactor Phase**(Write test, To Typescript, then to API)
- [] Routes
- [] Authentication
    - [] Refactor everything except for sessions.
    - [] Move to dedicated folder.
    - [] Write JWT session auth.
- [] Models
- [] Controllers
- [] Utilities
- [] App.js


[] **Organizational**
- [] Write unit tests for refactors, and write tests going forward.
- [] Remove unecessary comments, try to have more useful comments.

[] **Login/User Authentication**(REFACTOR+TS)
- [] Organization/School Model
- [] Org Controller
- [] User Model
- [] User Controller
- [] Password Encryption
- [] Account Email Verification
- [] User/Session Authentication

[] **Classroom/Student**(REFACTOR+TS)
- [] Classroom Model
- [] Classroom Controller
- [] Student Model
- [] Student Controller

[] **Documentation**(PARTIAL REFACTOR + TS)
- [] Decide on forms for each
- [] Models for each
    - [] Incident (fight, worrisome comments, etc)
    - [] Commmunication (student, staff, parent, other)
    - [] PST
    - [] More?
- [] Controllers for each documentation type
    - [] Incident (fight, worrisome comments, etc)
    - [] Commmunication (student, staff, parent, other)
    - [] PST
    - [] More?
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
- [] Teacher to Teacher messaging within the same Org
