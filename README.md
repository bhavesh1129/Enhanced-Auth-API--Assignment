# Voosh Enhanced Authentication API Service

## Overview

This project is a web application built using Node.js, Express.js, MongoDB, and Passport.js. It provides functionalities for user authentication, profile management, and access control. Users can register, login, update their profiles, set profile visibility, and view public profiles. The project is structured using the **MVC (Model-View-Controller) architecture**.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
- [Testing the Application](#testing-the-application)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
  - [Profile Management](#profile-management)
- [Additional Notes](#additional-notes)

## Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose ODM)
- **Passport.js** (for authentication)
- **bcrypt.js** (for password hashing)
- **JWT** (JSON Web Tokens) for user authentication
- **Google OAuth2.0** for authentication
- **dotenv** for environment variables
- **helmet** for HTTP headers security
- **cors** for Cross-Origin Resource Sharing
- **express-rate-limit** for rate limiting
- **express-session** for session management

## Features

- User registration and authentication
- Google OAuth2.0 authentication
- Profile management (update, visibility settings)
- Admin access for viewing all profiles (private and public)
- Rate limiting for API requests
- Error handling middleware for internal server errors

## Setup

#### Prerequisites

- Node.js and npm installed on your machine. [Download and Install Node.js](https://nodejs.org/)
- MongoDB Atlas account or local MongoDB server. [MongoDB Atlas](https://www.mongodb.com/atlas/database)

#### Project Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/bhavesh1129/Enhanced-Auth-API--Assignment.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Enhanced-Auth-API--Assignment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   (Create a `.env` file in the root directory of the project and add the following variables. Alternatively, you can take a look at the `.env.sample` file already added to the root directory of the project.):

   ```bash
   PORT=5000
   MONGO_URL=your_mongodb_connection_string
   SECRET_KEY=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

5. Start the server:
   ```bash
   node app.js
   ```
6. Access the application at **http://localhost:5000**

## Testing the Application

- To test the routes, you can use **Postman** or **Thunder Client** in VS Code.
- Generate mock data for testing using `Faker.js` or similar libraries.
- Test scenarios should include positive and negative cases for each API endpoint.

## API Endpoints

## ◾Authentication

1. **Endpoint:** **`POST /auth/register`**
   - **Description:** Register a new user.
   - **Payload:** JSON payload with text content of user data.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/auth/register
   - **Example:**
     ```json
     {
       "username": "example_user",
       "email": "example@example.com",
       "password": "examplepassword"
     }
     ```
   - **Response:** For successful user creation you will get a response 200 with a message and json object and if it fails for some reason then you will get status 500 with message Internal Server Error.
2. **Endpoint:** **`POST /auth/login`**
   - **Description:** Login with existing credentials.
   - **Payload:** JSON payload with text content of user data.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/auth/login
   - **Example:**
     ```json
     {
       "email": "example@example.com",
       "password": "examplepassword"
     }
     ```
   - **Response:** For successful login you will get a response 200 with a message and json object and if it fails for some reason then you will get status 500 with message Internal Server Error.
3. **Endpoint:** **`GET /auth/logout`**
   - **Description:** Logout the current user.
   - **Payload:** No request body needed.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/auth/logout
   - **Response:** For successful logout you will get a response 200 with a message and and if it fails for some reason then you will get status 500 with message Internal Server Error.
4. **Endpoint:** **`GET /auth/google`**
   - **Description:** Initiate Google OAuth2.0 authentication.
   - **Payload:** No request body needed.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/auth/google
   - **Response:** For successful signin with google you will get a response 200 with a message and json object and if it fails for some reason then you will get status 500 with message Internal Server Error.

### ◾Profile Management

1. **Endpoint:** **`GET /profile/me`**
   - **Description:** Get the profile of the authenticated user.
   - **Payload:** No request body needed.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/profile/me
   - **Note:** It requires `authentication token` in headers.
   - **Response:** For successful requests, you will receive a response with status code 200 along with a message and a JSON object. If the request fails for any reason, you will receive a status code 500 with the message Internal Server Error.
2. **Endpoint:** **`PATCH /profile/visibility`**
   - **Description:** Set profile visibility **(public/private)** for the authenticated user.
   - **Payload:** JSON payload with text content of user visibility status.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/profile/visibility
   - **Example:**
     ```json
     {
       "visibility": "private" //OR "public"
     }
     ```
   - **Note:** It requires `authentication token` in headers.
   - **Response:** For successful requests, you will receive a response with status code 200 along with a message and a JSON object. If the request fails for any reason, you will receive a status code 500 with the message Internal Server Error.
3. **Endpoint:** **`PATCH /profile/updateProfile`**

   - **Description:** Update profile information of the authenticated user.
   - **Payload:** JSON payload with text content of user updated profile data.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/profile/updateProfile
   - **Example:**
     ```json
     {
       "name": "New Name",
       "bio": "New Bio",
       "phone": "1234567890",
       "photo": "newphoto.jpg"
     }
     ```
   - **Note:** It requires `authentication token` in headers.
   - **Response:** For successful updation you will get a response 200 with a message and and if it fails for some reason then you will get status 500 with message Internal Server Error.

4. **Endpoint:** **`GET /profile/getAllPublicProfiles`**
   - **Description:** Get all public profiles of users.
   - **Payload:** No request body needed.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/profile/getAllPublicProfiles
   - **Note:** It requires `authentication token` in headers.
   - **Response:** For successful request you will get a response 200 with a message and and if it fails for some reason then you will get status 500 with message Internal Server Error.
5. **Endpoint:** **`GET /profile/getAllProfiles`**
   - **Description:** Get all profiles of users and it can be accessed by admin's user type only.
   - **Payload:** No request body needed.
   - **Post on Deployed Server:** You can directly post in the deployed route https://voosh-auth-api-assignment-bhavesh1129.up.railway.app/profile/getAllProfiles
   - **Note:** It requires `authentication token` in headers.
   - **Response:** For successful request you will get a response 200 with a message and and if it fails for some reason then you will get status 500 with message Internal Server Error.

## Additional Notes

- #### Rate Limiting:

  The application includes rate limiting based on IP using Express.js middleware. We made a separate middleware in the Middleware section for this purpose.

- #### Deployment:
  The Node.js application is deployed on Railway cloud hosting platform. The deployment link is [Voosh Backend Assignment](https://voosh-auth-api-assignment-bhavesh1129.up.railway.app).
