# TalkFlow — Real-Time Chat Application

TalkFlow is a modern, real-time one-to-one chat application.
It is built using the MERN stack.

---

## Live Demo

- **Frontend**  
 [TalkFlow Live App](https://talkflow-frontend.vercel.app) 

---

## Features

- JWT Authentication (HTTP-only cookies)
- Real-time messaging using Socket.IO
- One-to-one chats
- Search chats by username
- Emoji picker
- Multiline messages  
- Delete chat with confirmation
- Responsive UI
- Fast Vite + React frontend

---

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Socket.IO Client
- Lucide Icons
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- Socket.IO
- JWT Authentication
- Cookie-based auth

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---
## Installation & Run Locally

Follow the steps below to run **TalkFlow** on your local desktop.

---

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v18 or later)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Git**

---

###  Clone the Repository

```bash
git clone https://github.com/<your-username>/talkflow.git
cd talkflow


### Backend Setup

``` bash
cd backend
npm install
```

---
## Backend Environment Variables


# Create a .env file inside the backend folder:

``` bash
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/talkflow
JWT_SECRET=your_jwt_secret_key
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development

```
# Make sure to replace <username>, <password>, and secrets with your own values.

## Run Backend Server
``` bash
npm run dev
```

## Backend will start at: http://localhost:5000

## Frontend Setup
```bash
cd ../frontend
npm install
```

## Frontend Environment Variables

# Create a .env file inside the frontend folder:

```bash
VITE_BACKEND_API=http://localhost:5000
```

## Run Frontend App
``` bash
npm run dev
```

## Frontend will start at: http://localhost:5173

## Future Enhancements

- Group chats
- Typing indicators
- Message read receipts
- File & media sharing
- Online/offline user status
- Push notifications

---

## Author

**Priya Gupta**  
Full-Stack Developer  

GitHub: https://github.com/priyagupta-js  
LinkedIn: https://www.linkedin.com/in/priyagupta-js/

---

## Support

If you like this project, please give it a ⭐ on GitHub — it helps a lot!
