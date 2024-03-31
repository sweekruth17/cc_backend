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
  
### .env file structure
 ````bash
MONGODB_URL=''
SECRET_TOKEN = ""
JWT_SECRET=''
PORT = 3000
````
