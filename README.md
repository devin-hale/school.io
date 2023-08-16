# school.io

## Description
### Version 0.1.2
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

**UPDATE: 8-16-2023(1):**
### Data
- Modified data models to support multiple class formats.
    - Optional class subject field
    - One class per teacher (Early Elementary)
    - Multiple teachers can access a single class (Late Elementary-Early Middle)
    - Multiple classes of different students for each teacher (Middle-HS)
- Fleshed out student data model further
    - Signifiers for important attributes related to documentation (English Language Learners, Retained(Held Back) Students, Special Ed, Gifted)
- Significant Progress on Student and Class Controllers.  Will continue to expand as requirements arise.
### View
- Not spending a large amount of time on the view.  Just want it to be usable.  Plan is to convert it to react (and then R. Native) once it reaches MVP status.
    - Why? Because I wanted to learn how to use the MVC model, but realize that React and React Native fit the requirements better than an MVC.
- Expanded class page to show more details.
- Individual class pages created.  Shows students (sorted by last Name) in a table format.
- Blank student instance pages working, just so server has somewhere to point.

**CURRENTLY:**
- Populating student instance page with relevant data.
- Expanding student/class controllers as needed.


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

[] **Classroom/Student**
- [X] Classroom Model
- [X] Classroom Controller
- [X] Student Model
- [X] Student Controller
- [X] Basic Classes Page
- - [X] Class Instance Page
- - [] Update with relevant documentation info
- [] Basic Student Instance Page
- - [] Update with relevant documentation info

[] **Documentation**
- [] Define documentation types
- [] Decide on forms for each
- [] Models for each
- [] Controllers for each documentation type
- [] Class-wide documentation view page
- [] Documentation creation page
- - [] Figure out method for attaching/storing image files.
- [] Page for existing documentation instances
- - [] Download as PDF.

[] **Utilities**
- [] Org Admin Page
- [] Super Admin Page
- [] User profile
- [] Teacher to Teacher messaging within the same Org
- [] Student transfer between classes
- [] Student transfer between orgs

[] **Long term**
- [] Convert website to jamstack format using React as the front end.
- [] React Native port
- [] SSL Certificate
- [] Disclaimers, data privacy, etc.