### Featues about Typescript-Backend project
- Secure Authentication: Implements JWT-based authentication with dedicated routes for:
  - User Sign-in
  - User Sign-up
  - User Logout
- Its connected with mongoDB for Persitant Data.
- Zod Validation: Enforces robust data validation using the Zod library, ensuring data integrity during user registration and other operations.
- Password Encryption: Stores user passwords securely using industry-standard password encryption algorithms.
- And Middleware for the protected routes.
- With Swagger docementation and UI
### Live link : https://cc-backend-p7yb.onrender.com/docs/
### .env file structure
 ````bash
MONGODB_URL=''
SECRET_TOKEN = ""
JWT_SECRET=''
PORT = 3000
````
### Steps to run locally
 ````bash
npm install
tsc -b
node dist/db/db.js #to create tables in DB
npm run dev
````
