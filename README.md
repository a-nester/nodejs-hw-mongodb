# Backend Application for Managing Contacts and Users

## Overview

This backend application is built using Node.js and Express.js to create a scalable and efficient RESTful API. It uses MongoDB as a NoSQL database for flexible data storage, while Handlebars generates dynamic email templates for user communication. Security is ensured through bcrypt for password hashing and JWT for secure session management. File uploads are handled with Multer, and images are stored using Cloudinary. Additionally, Swagger is used for API documentation, and OAuth 2.0 facilitates secure access to Google APIs.

## Features

- **User Management**:
  - Register, login, and manage user sessions with JWT tokens.
  - Password reset functionality with a reset link sent via email.
  - Login with Google OAuth 2.0
- **Contacts Management**:
  - Create, update, and manage contacts.
  - Upload user photos, which are stored in Cloudinary with URLs saved in MongoDB.
- **API Documentation**:
  - RESTful API documentation available through Swagger.

## Technology Stack

- **Node.js**: Server-side runtime environment.
- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing user data, contacts, and session information.
- **Handlebars**: Template engine for dynamic email templates.
- **Swagger**: API documentation tool.
- **bcrypt**: Library for hashing and comparing passwords.
- **JWT (JSON Web Tokens)**: Secure method for transmitting user session data.
- **Multer**: Middleware for handling `multipart/form-data`, used for uploading files.
- **Nodemailer**: Node.js module for sending emails.
- **Cloudinary**: Cloud-based service for storing and managing images.
- **OAuth2**: OAuth 2.0 to Access Google API.

## Installation

### Prerequisites

- Node.js
- MongoDB
- Cloudinary Account (for image storage)
- Google OAuth2

### Steps to Set Up

1. **Clone the repository:**

   ```bash
   git clone https://github.com/a-nester/nodejs-hw-mongodb.git
   cd your-repository
  ```

2. **Install dependencies:**
 ```bash
 npm install
 ```

3. **Set up environment variables:**
  Create a .env file in the root of your project and add the following:
 ```env
 PORT=
MONGODB_USER=
MONGODB_PASSWORD=
MONGODB_URL=
MONGODB_DB=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=
JWT_SECRET=
APP_DOMAIN=

CLOUD_NAME=
API_KEY=
API_SECRET=
ENABLE_CLOUDINARY=

GOOGLE_AUTH_CLIENT_ID=
GOOGLE_AUTH_CLIENT_SECRET=
 ```

4. **Run the application:**
 ```bash
 npm run dev
 ```

5. **Access the API Documentation:**
After running the application, you can access the Swagger API documentation at:
 ```bash
 local:
 http://localhost:3000/api-docs
 on server:
 https://nodejs-hw-mongodb-j3zc.onrender.com/api-docs/
 ```

## Usage

**User Registration and Authentication**

- Users can register with an email and password and name.
- Upon registration, a token is issued for session management.
- Users can reset their password by receiving a reset link via email.

**Contact Management**

- Users can create and manage their contacts.
- Each contact can have an associated photo, which is uploaded via the API and stored in Cloudinary.
- The URL to the photo is stored in MongoDB for easy retrieval.

**API Endpoints**
Here are some of the key API endpoints:

- User Authentication

  - POST /auth/register: Register a new user.
  - POST /auth/login: Login and receive a JWT token.
  - POST /auth/refresh: Refresh session accessToken.
  - POST /auth/logout: Logout clear cookies and remove session from database.
  - POST /auth/send-reset-email: Request a password reset link.
  - POST /auth/reset-pwd: Reset user password.
  - GET  /auth/get-oauth-url: Get Google OAuth URL.
  - POST /auth/confirm-oauth: Google OAuth2 user login.

- Contacts

  - GET /contacts: Get all contacts.
  - GET /contacts/{contactId}: Get contact by id.
  - POST /contacts: Create a new contact with an optional photo.
  - PATCH /contacts/{contactId}: Update contacts parameters.
  - DELETE /contacts/{contactId}: Delete an existing Contact.

For a full list of endpoints and their details, refer to the [Swagger documentation](https://nodejs-hw-mongodb-j3zc.onrender.com/api-docs/).
