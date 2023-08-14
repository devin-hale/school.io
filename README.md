# school.io

## Description
### Version 0.0.3
This is the beginning of a project intended to act as a simple website for teachers to create, update, and store important documentation.
The idea came from listening to my wife, who is a 3rd grade teacher.  According to her, the biggest annoyance is a teacher is keeping track of
documentation.  This can be as simple as writing down "I spoke with little Billy's parents at X time on Y date.  We spoke about this...".  This
documentation comes in handy when little Billy's mom calls the principal to complain.  Keeping that documentation is a way for the classroom teacher
to CYA, because withouot it, nobody else will.

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

UPDATE: 8-14-2023(1):  A super basic version of the entire login and account creation loop is complete.

CURRENTLY: Cleaning up client side code for Login loop.


[] **Login/User Authentication**
- [X] Organization/School Model
- [X] Org Controller
- [X] User Model
- [X] User Controller
- [X] Login Page
- [X] Account Creation Page
- - [X] Org verification before signup.
- - [X] Make it look not bad.
- [] Basic Landing Page (Will become classroom page)
- [X] Password Encryption
- [X] Account Email Verification
- [X] User/Session Authentication
- [] Clean up form validation on client side
- [] Clean up code

[] **Classroom/Student**
- [] Classroom Model
- [] Classroom Controller
- [] Student Model
- [] Student Controller
- [] Basic Classroom Page
- - [] Update with relevant documentation info
- [] Basic Student Page
- - [] Update with relevant documentation info

[] **Documentation**
- [] Define documentation types
- [] Decide on forms for each
- [] Models for each
- [] Controllers for each documentation type
- [] Class-wide documentation view page
- [] Documentation creation page
- - [] Figure out method for storing image files.
- [] Page for specific existing documentation instances
- - [] Download as PDF.

[] **Utilities**
- [] Org Admin Page
- [] Super Admin Page
- [] User profile
- [] Teacher to Teacher messaging within the same Org
- [] Student transfer between classes
- [] Student transfer between orgs

[] **Long term**
- [] Create full view in react
- [] React Native port
- [] SSL Certificate
- [] Disclaimers, data privacy, etc.