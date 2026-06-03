# ResumeAI

ResumeAI is an AI-powered resume analyzer and career advice web application built as a final year HND Computer Science project for the Software and Web Development option. The system allows users to register, log in, upload a PDF resume, receive AI-generated resume feedback, view career role recommendations, and continue a resume-aware chat conversation.

## Tech Stack

- React.js with Vite
- Tailwind CSS v3
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer memory storage
- pdf-parse
- Google Generative AI SDK with configurable Gemini model support
- JWT authentication with `jsonwebtoken`
- Password hashing with `bcryptjs`
- dotenv
- Plain JavaScript

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or a MongoDB Atlas connection string
- Gemini API key from Google AI Studio

## Setup

1. Install all dependencies from the project root:

   ```bash
   npm run install:all
   ```

2. Create the server environment file:

   ```bash
   cp server/.env.example server/.env
   ```

3. Edit `server/.env` and provide real values:

   ```bash
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.0-flash
   MONGODB_URI=mongodb://127.0.0.1:27017/resumeai
   JWT_SECRET=replace_with_a_long_random_secret
   PORT=5000
   ```

4. Start the backend server:

   ```bash
   npm run dev:server
   ```

5. In another terminal, start the frontend:

   ```bash
   npm run dev:client
   ```

6. Open the Vite URL shown in the terminal, usually:

   ```text
   http://localhost:5173
   ```

## How To Use

1. Create an account with full name, email, and password.
2. Log in to access the protected dashboard.
3. Upload a text-based PDF resume not larger than 5MB.
4. Wait for ResumeAI to extract resume text and generate AI feedback.
5. Review the structure, content quality, keyword strength, weaknesses, improvements, and career recommendations.
6. Use the chat section to ask career questions based on the uploaded resume.
7. Open My History to view previous analyses and continue old conversations.

## API Routes

- `POST /api/auth/signup` creates a user account and returns a JWT.
- `POST /api/auth/login` verifies credentials and returns a JWT.
- `POST /api/analyze` uploads and analyzes a PDF resume.
- `POST /api/chat` sends a resume-aware chat message to Gemini.
- `GET /api/history` returns saved analyses for the logged-in user.
- `GET /api/history/:id` returns one saved analysis with chat messages.

## Notes

- Uploaded PDF files are processed in memory and are not written to disk.
- Dashboard, analysis, chat, and history routes are protected with JWT authentication.
- The app is designed to run fully on localhost and does not include deployment setup.
