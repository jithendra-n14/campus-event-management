# Project Title- Campus Event Management Platform

- This project is about a prototype implementation of Campus Event Management
Platform, it is basically a web application/ platform that allows organizers,
colleges and universities to create and host events and lets students to register
the same.
- The platform consists of two main feature Admin panel and Student
dashboard. It also consists of other important technical features that makes it
easier for organizers and students to easily create and participate in events and
thereby accelerating and improved event experiences



## Tech Stack

- Frontend: React + React Bootstrap
- Backend: Node.js + Express.js
- Database: MongoDB Atlas (via Mongoose ODM)
- API Testing- Postman.




## Setup Instructions

1. Clone Repo
-      git clone https://github.com/<your-username>/campus-event-management.git
-      cd campus-event-management

 2. Backend Setup

-      cd backend
-      npm install

Create a .env file:
-      MONGO_URI=your_mongodb_atlas_uri
-      PORT=5000

Run Backend
-     npm start

3. Frontend Setup
-      cd ../frontend
-      npm install
-      npm start
Runs on http://localhost:3000




## ScreenShots.

1. Landing Page- A login page to choose either Admin Role or Student Role
   

<img width="1917" height="1198" alt="page1(admin)" src="https://github.com/user-attachments/assets/219e8f1c-236c-4011-b6e9-2a8aa1f390cd" />


<img width="1908" height="1198" alt="page1(student)" src="https://github.com/user-attachments/assets/730dcdfb-8c7e-4de5-a5fc-5f8fde586648" />


2. On Selecting Admin Role, The Admin Page opens where event organizers or colleges can create event and display it to students in the Events Page


<img width="1918" height="1198" alt="page8(AdminPage)" src="https://github.com/user-attachments/assets/524bbaa4-91ce-43f0-a397-b71ca2d98e50" />


Also lets admins to Cancel/ Activate events or even delete events when required

<img width="1798" height="1198" alt="page10(eventDelete)" src="https://github.com/user-attachments/assets/82f812d3-c6e4-4216-a23f-c3c948bf79f2" />

3. On Selecting Student Role in Landing Page, Student Dashboard opens.

<img width="1917" height="1198" alt="page4(registeredStudents)" src="https://github.com/user-attachments/assets/a653509c-76c6-498f-bd22-5738b21d639f" />

Students can the events they ahve registered and also lets them mark their attendance , give feedback and comments to the event organizers.
Also lets student to unregister from the event if required.
<img width="1918" height="1198" alt="page6(feedbackSubmit)" src="https://github.com/user-attachments/assets/eee6a279-e5cf-4b4e-95ab-9c91decd4067" />


4. Events Page- All the Events created by colleges are listed here, Students can expolre them nd register to events they want to.
<img width="1917" height="1198" alt="page2" src="https://github.com/user-attachments/assets/45e31a91-2ac6-47a1-b365-93d4f46a6b0a" />
<img width="1917" height="1198" alt="page3(registration)" src="https://github.com/user-attachments/assets/5a55cf36-db46-4770-a58c-e36f10b068f5" />

5. Reports Dashboard. The reports and insgiths about the events are displayed here, shows the most popular events based on their ratings and feedback and gives information about
the most actively participating students and number of student participations too.
<img width="1916" height="1198" alt="page7(Reports)" src="https://github.com/user-attachments/assets/b699b10e-db1b-4fb4-92be-44afcf3c7edb" />







## Prototype Scope (Implemented)

### Core Features

- Event creation, cancellation, reactivation (Admin)
- Student registration & unregistration
- Attendance marking
- Feedback collection (1–5 stars + comments)
- Reports (Admin)
- Event popularity report
- Student participation report
- Top 3 most active students


## Database Design (MongoDB)

### Why I Chose MongoDB for the prototype.
-  The reason I chose MongoDB instead of MySql/ PostgreSql is because of its flexible schema. MongoDB’s document-based schema allows us to store
variable fields without altering database schemas which you would need to do
in SQL. Also MongoDB is highly scalable, for a data for 50 colleges with 200
students each it would easy to scale using MongoDB.

Scalability Consideration

- Designed for ~50 colleges with ~500 students each
- MongoDB chosen for flexible schema & horizontal scaling
- collegeId ensures multi-college support within one DB

<img width="918" height="998" alt="image" src="https://github.com/user-attachments/assets/089a8f0d-8b0d-4d09-931f-195fb0959289" />







## APIs

Admin / Events APIs
-  POST /api/events → Create a new event (Admin only).
-  GET /api/events → Get all events (with optional filters by college, type, status).
-  PATCH /api/events/:id/cancel → Cancel an event.
-  PATCH /api/events/:id/activate → Reactivate a cancelled event.
-  DELETE /api/events/:id → Permanently delete an event.

  
Student APIs
- POST /api/students → Register a new student.
- GET /api/students → Fetch all students (for reports/admin).
- GET /api/students/:id → Get student profile details.


Registration APIs
- POST /api/registrations → Student registers for an event.
- GET /api/registrations → Fetch all registrations (filter by studentId/collegeId).
- DELETE /api/registrations/:id → Student unregisters from an event.


Attendance APIs
- POST /api/attendance → Mark attendance for a student at an event.
- GET /api/attendance → Fetch attendance records.


Feedback APIs
- POST /api/feedback → Submit feedback (rating + comments) for an event.
- GET /api/feedback/summary/:eventId → Get average rating + count of feedback for an event.


Reports APIs (Admin Analytics)
- GET /api/reports/events/popularity → Report of events with registration counts.
- GET /api/reports/students/participation → Report of student participation (events registered).
- GET /api/reports/students/top → Top 3 most active students (highest registrations).


All These API's were tested and implemented using Postman Tool

<img width="582" height="460" alt="image" src="https://github.com/user-attachments/assets/361597ac-a57f-4681-94ed-ab5cc7c83154" />

- POST /api/events → Create a new event (Admin only).
  <img width="940" height="564" alt="image" src="https://github.com/user-attachments/assets/c4bc4419-ceab-4899-9092-b62e2e8fb246" />

- POST /api/students → Register a new student.
   <img width="940" height="474" alt="image" src="https://github.com/user-attachments/assets/f12c0053-9f8e-4676-b05e-ce786cb8bcd7" />



 ## Assumptions & Edge Cases Covered

- Event IDs unique across all colleges
- Event codes unique per college
- Prevented duplicate registrations, attendance, and feedback
- Cancelled events block new registrations
- Enforced event capacity check
- Reports generated using MongoDB aggregations

