# DiChoTienLoi API Deployment Guide

Follow these steps to set up and run the DiChoTienLoi API on your local machine.

## Step 1: Create Database

1. Create a new database named `dichotienloi`.
2. Import the SQL file located at `./src/database.dichotienloi.sql` to set up the database structure and initial data.

## Step 2: Set Up Environment Variables

1. Create a `.env` file in the root directory.
2. Add the following environment variables and fill in the values as needed:

   ```plaintext
   PORT=YOUR_PORT_NUMBER

   # Secret for sessions
   SESSION_SECRET=YOUR_SESSION_SECRET

   # JWT secrets
   JWT_ACCESS_SECRET=YOUR_JWT_ACCESS_SECRET
   JWT_REFRESH_SECRET=YOUR_JWT_REFRESH_SECRET

   # Cloudinary configuration
   CLOUDINARY_CLOUD_NAME=YOUR_CLOUDINARY_CLOUD_NAME
   CLOUDINARY_API_KEY=YOUR_CLOUDINARY_API_KEY
   CLOUDINARY_API_SECRET=YOUR_CLOUDINARY_API_SECRET

## Step 3: Start Database Server
    Make sure your database server is running and accessible before starting the API server.

## Step 4: Run the API
    Run the following command to start the API server:

    ```npm start
    
The API should now be running on the port specified in your .env file.