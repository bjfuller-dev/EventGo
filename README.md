# EventGo

EventGo is a full-stack mobile application designed to help small sports groups organise recurring events, track sign-ups and manage payments. It was created as a final-year university project for a BSc Computing & IT degree.

The original use case was a weekly football group where the organiser needed a clearer way to see who had signed up, who had paid, and which events were available each week.

## Features

- User registration and login
- Event creation and event browsing
- Event membership and sign-ups
- Visibility of sign-ups and payment status for event owners
- Stripe payment integration for taking event payments
- Backend API for user and event data
- MongoDB database integration

## Tech Stack

### Frontend

- React Native
- Expo
- JavaScript / TypeScript
- NativeWind / Tailwind CSS
- Axios
- React Navigation

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcrypt / bcryptjs
- Stripe API
- dotenv
- CORS

### Testing and Tools

- Postman for API testing
- Manual and structured functional testing
- GitHub for repository hosting
- Visual Studio Code

## Project Structure

```text
EventGo/
  backend/    # Node.js / Express API, database models and server code
  frontend/   # Expo / React Native mobile application
```

## Getting Started

This project was built as an academic portfolio project, so local setup may require environment variables and configuration changes before running.

### Prerequisites

- Node.js and npm
- Expo / Expo Go
- MongoDB connection string
- Stripe test keys if using payment functionality

### Backend Setup

```bash
cd backend
npm install
npm start
```

Create a `.env` file in the backend folder for local configuration. Values include:

```text
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```
Create a `.env` file in the frontend folder for local configuration. Values include:

```text
EXPO_PUBLIC_API_URL=your_local_host_address
EXPO_PUBLIC_STRIPE_KEY=your_public_stripe_key
```

Then run the app through Expo.

## Testing

During development, API endpoints were tested with Postman to check that requests and responses worked correctly. The application was also tested manually and through structured functional tests as part of the final-year project documentation.

Testing focused on key user workflows such as account creation, event creation, event sign-up, payment flow behaviour and data being displayed correctly to event organisers.

## Project Status

This is a completed university project and portfolio piece. It is not currently deployed as a production application.

## Author

Benjamin Fuller
