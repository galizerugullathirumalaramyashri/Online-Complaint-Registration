# Online Complaint Registration System

A full-stack MERN web application that allows citizens to register complaints, track complaint progress, communicate with officers, and receive notifications. Administrators can approve officers, assign complaints, monitor progress, and view reports.

## Features

### User / Customer Features

- User registration and secure login
- Submit complaints with:
  - Category
  - Department
  - Description
  - Address, city, state, and pincode
  - Priority: Low, Medium, or High
  - Picture attachment: JPG, PNG, or WEBP up to 5 MB
- View personal complaints on the dashboard
- Track complaint status
- View full complaint details
- View attached complaint pictures
- Send messages related to a complaint
- View in-app notifications
- Update personal profile details
- Duplicate complaint detection prevents the same active complaint from being submitted again

### Agent / Officer Features

- Officer registration with a department
- Officer account approval by Admin
- View only complaints assigned to that officer
- View customer details, complaint description, location, and attached picture
- Send messages related to assigned complaints
- Update the status of assigned complaints only
- Receive a notification when a complaint is assigned

### Admin Features

- Admin registration using an admin registration code
- View all registered users
- View all complaints
- Approve or manage officer accounts
- Assign complaints to approved officers
- View the current complaint status
- Receive a notification when a new complaint is submitted
- View reports and analytics:
  - Total complaint count
  - Pending complaint count
  - Resolved complaint count
  - Closed complaint count
  - Complaints by category
  - Complaints by department
  - Average resolution time

  Admin registration code:
```text
change-this-admin-code
```


## Complaint Statuses

- Pending
- Assigned
- In Progress
- Resolved
- Closed
- Rejected
- Reopened

Only the assigned Officer/Agent can change the status of a complaint.

## Notifications

The system supports:

- In-app notifications stored in MongoDB

Notifications are sent for:

- A new complaint submitted: Admin receives a notification
- A complaint assigned: Customer and assigned Agent receive a notification
- A complaint status updated: Customer receives a notification

SMS notifications are not enabled.

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Protected routes
- Role-based access control
- Admin-only complaint assignment
- Agent-only complaint status updates
- Login attempt limit and temporary account locking
- Security headers
- Rate limiting
- Basic NoSQL injection protection

## Technology Stack

### Frontend

- React
- Vite
- Material UI
- React Router
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer for image upload
- Nodemailer for email notifications

## Project Structure

```text
Online Complaint Registration
│
├── client
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── ComplaintDetails.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NewComplaint.jsx
│   │   │   ├── Notifications.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Reports.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   │   ├── authController.js
│   │   ├── complaintController.js
│   │   ├── messageController.js
│   │   ├── notificationController.js
│   │   ├── reportController.js
│   │   └── userController.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   ├── securityMiddleware.js
│   │   └── uploadMiddleware.js
│   ├── models
│   │   ├── Complaint.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   └── User.js
│   ├── routes
│   │   ├── authRoutes.js
│   │   ├── complaintRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── reportRoutes.js
│   │   └── userRoutes.js
│   ├── uploads
│   ├── index.js
│   └── package.json
│
└── README.md
```
## Demo Video

🎥 **Watch the project demo here:**

[Watch Demo Video](https://drive.google.com/file/d/1i9Jn8jAaxr1JG0dsOvmb14DbEpBPYJtV/view?usp=sharing)


## Screenshots

### Landing Page

![Landing Page](screenshots/landing.png)

### Register Page

![Register Page](screenshots/register.png)

### Login Page

![Login Page](screenshots/login.png)

### User Dashboard

![User Dashboard](screenshots/user-dashboard.png)

### Complaint Register Page! 

![Complaint Register Page](screenshots/complaint-register.png)

### Admin Dashboard Page

![Admin Dashboard](screenshots/admin-dashboard.png)

### Admin Panel1

![Admin Panel1](screenshots/admin-panel1.png)

### Admin Panel2

![Admin Panel2](screenshots/admin-panel2.png)



### Officer Approval

![Officer Approval](screenshots/officer-approval.png)

## Installation

### 1. Install Backend Packages

Open a terminal inside the `server` folder:

```bash
npm install
npm install multer nodemailer twilio
```

### 2. Install Frontend Packages

Open a terminal inside the `client` folder:

```bash
npm install
```

### 3. Start the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the application in the browser:

```text
http://localhost:5173
```

## User Roles

### Customer

- Registers complaints
- Uploads complaint pictures
- Tracks complaints
- Receives assignment and status notifications
- Sends complaint messages

### Agent / Officer

- Waits for Admin approval
- Views assigned complaints
- Updates complaint status
- Receives assignment notifications

### Admin

- Approves Agents
- Views all complaints
- Assigns complaints to Agents
- Receives new complaint notifications
- Views reports and department performance

## Future Enhancements

- SMS notifications
- File attachments such as PDF documents
- Complaint search and advanced filtering
- Export reports as PDF or Excel
- Real-time notifications using Socket.io
- Dashboard charts and graphs
- Multiple image attachments