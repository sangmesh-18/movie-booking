
🎬 Movie Booking System

A simple full-stack movie seat booking system with authentication. Built using:

- React (Vite) for frontend
- Node.js + Express for backend
- MongoDB for data persistence
- JWT for user authentication

---

🛠 Features

- User authentication (Login/Register)
- Add and display seats
- Seat selection and booking
- Seat status (Available, Selected, Booked)
- Inline UI styling with React
- Concurrency-safe booking

---

🧩 Folder Structure

project-root/
├── backend/
│   ├── index.js
│   ├── models/
│   │   ├── Seat.js
│   │   └── User.js
│   └── .env
├── frontend/
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── LoginPage.jsx
│       ├── SeatBookingPage.jsx
│       └── main.jsx

⚙️ Setup Instructions

2. Backend Setup (backend/)

    Install dependencies:
        cd backend
        npm install

    Create a .env file in backend/:
        PORT=5000
        MONGO_URI=mongodb://localhost:27017/"your_DB_name"
        JWT_SECRET=your_jwt_secret

    Start the backend server:
        node server.js

3. Frontend Setup (frontend/)

    Install dependencies:
        cd ../frontend
        npm install

    Start the frontend:
        npm run dev

    The app will run on http://localhost:5173

---

🔐 Default Routes (Backend)

| Method | Endpoint        | Description         |
|--------|------------------|---------------------|
| POST   | /register        | Register a new user |
| POST   | /login           | Login user          |
| POST   | /add-seats       | Add seats           |
| GET    | /seats           | Get all seats       |
| POST   | /book-seats      | Book selected seats |
| POST   |/cancel-seat      |cancel booked seat   | 

---

🧪 Test Credentials

You can register a user from the frontend or use any test account for demo purposes.

---

📌 Notes

- Make sure MongoDB is running locally (mongodb://localhost:27017)
- Backend runs on port 5000, frontend on 5173
- Ensure CORS is enabled if you access the frontend and backend on different ports

---