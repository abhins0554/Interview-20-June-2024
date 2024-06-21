# Chat Application Backend

This README provides an overview and instructions for the backend code of a chat application. The backend is implemented using Node.js with Express, MongoDB, and Socket.IO. It handles user authentication, real-time messaging, and polling functionality.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Dependencies](#dependencies)
4. [Environment Variables](#environment-variables)
5. [Code Explanation](#code-explanation)
   - [Server Setup](#server-setup)
   - [Socket.IO Integration](#socket-io-integration)
   - [Authentication Middleware](#authentication-middleware)
   - [Routes](#routes)
   - [Models](#models)
6. [Running the Application](#running-the-application)

## Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:

- Node.js
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <repository-directory>
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables by creating a `.env` file in the root directory:

```
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_jwt_secret
SOCKET_PORT=5000
```

## Project Structure

```plaintext
src/
├── controllers/
│   ├── authController.js
│   ├── chatController.js
│   └── pollController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Message.js
│   └── Poll.js
├── routes/
│   ├── authRoutes.js
│   ├── chatRoutes.js
│   └── pollRoutes.js
├── services/
│   └── socketService.js
├── utils/
│   └── db.js
├── app.js
└── server.js
```

## Dependencies

- Express
- Mongoose
- Socket.IO
- JSON Web Token (JWT)
- bcryptjs
- dotenv

## Environment Variables

The following environment variables are used in the project:

- `MONGODB_URI`: The URI for connecting to the MongoDB database.
- `JWT_SECRET`: The secret key for signing JWT tokens.
- `SOCKET_PORT`: The port on which the Socket.IO server will run.

## Code Explanation

### Server Setup

The `server.js` file sets up the Express application and integrates Socket.IO.

```javascript
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const dotenv = require("dotenv");
const connectDB = require("./utils/db");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connectDB();

app.use(express.json());
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/polls", require("./routes/pollRoutes"));

require("./services/socketService")(io);

const PORT = process.env.SOCKET_PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
