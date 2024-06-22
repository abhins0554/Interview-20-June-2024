# Interview Task Project

This project is an interview task demonstrating a full-stack application with a backend and frontend.

## Project Structure

- **Backend**: Built with Node.js, Express, and Socket.io.
- **Frontend**: Built using React.
- **Database**: MongoDB, connected via Atlas.

## Hosting

- **Backend**: Hosted on Amazon EC2.
- **Frontend**: The React build code is contained within the Node.js public folder, which serves static files.

## URLs

- **API Documentation**: [Swagger Documentation](https://interview.jamverse.in/api/documentation/)
- **Frontend**: [Live Application](https://interview.jamverse.in/)

## Installation and Setup

### Backend

1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm run start:dev
   ```

### Frontend

1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the React application:
   ```bash
   npm run build
   ```
4. The build output will be placed in the `public` folder of the backend.

## Area of Improvement

- **User Email Validation**: Due to the limited time frame of 48 hours, email validation via mail services has not been implemented.
- **Token Expiry Time**: The token expiry time has not been added.
- **Database Improvement for Poll**: The current database setup for polls could be optimized for better performance and scalability.
- **Frontend Validation**: The frontend validation has not been fully tested.
- **Frontend Authentication**: Frontend authentication is not handled. If needed, Redux will be added for better state management.
- **Code Optimization**: The code is primarily focused on functionality and has not been optimized.
- **UI Design**: As I am not a UI developer, the UI may not be very polished. I took help from ChatGPT and other tools for UI design.

## Repository

- **GitHub**: [Interview Task Repository](https://github.com/abhins0554/Interview-20-June-2024)

Feel free to explore the code and suggest any improvements. Thank you!
