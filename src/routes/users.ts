import express, { Response, Request } from "express";
import {
  userSignUp,
  userLogout,
  userSignIn,
  sensitiveRoute,
  userProtected,
} from "../controllers/userController";
import { userMiddleware } from "../middlewares/middleware";

const router = express.Router();
/**
 * @swagger
 * /user/signin:
 *   post:
 *     summary: Sign in a user
 *     description: Signs in a user with the provided email and password.
 *     tags:
 *       - User API's
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: swee@123.com
 *               username:
 *                 type: string
 *                 example: lol1
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: User successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully logged in.
 *                 JWT:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3ZWVAc29tZS5jb20iLCJ1c2VybmFtZSI6ImxvbDEiLCJpYXQiOjE2MTY3NjE3MjgsImV4cCI6MTYxNjc2NTMyOH0.Nan08Dv8K5uwfSWaVpKtjOjGzwxj7ZwQ3THd9dZwfyM
 *       '404':
 *         description: Invalid credentials or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error user not found or wrong password, check credentials again
 */

router.post("/signin", userSignIn);
/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account with the provided email, username, and password.
 *     tags:
 *       - User API's
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: swee@123.com
 *               username:
 *                 type: string
 *                 example: lol1
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: user with swee@123.com created successfully
 *               JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN3c2VlQDEyMy5jb20iLCJ1c2VybmFtZSI6ImxvbDEiLCJpYXQiOjE3MTE4ODk0NjQsImV4cCI6MTcxMTkwNzQ2NH0.WntD9lUp3Z5omHnTgz63x73brcJsCV_e8l4Mp52XpP
 *       '404':
 *         description: Invalid request body or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: Please enter valid credentials again
 */

router.post("/signup", userSignUp);
/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     description: Logs out a user by blacklisting their JWT token.
 *     tags:
 *       - User API's
 *     responses:
 *       '200':
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: user logged out
 *       '400':
 *         description: Invalid Authorization header or user already logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: user already logged out
 */
router.post("/logout", userLogout);
//protected route
/**
 * @swagger
 * /user/getdata:
 *   get:
 *     summary: Get sensitive data
 *     description: Retrieves sensitive data from a third-party API based on the provided category.
 *     tags:
 *       - User API's
 *     parameters:
 *       - in: query
 *         name: category
 *         description: The category of data to retrieve like Anime,Animals,Blockchain,Authentication & Authorization.
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         description: The maximum number of entries to retrieve.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *     responses:
 *       '200':
 *         description: Sensitive data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       API:
 *                         type: string
 *                       Description:
 *                         type: string
 *                       Auth:
 *                         type: string
 *                       HTTPS:
 *                         type: boolean
 *                       Cors:
 *                         type: string
 *                       Link:
 *                         type: string
 *                       Category:
 *                         type: string
 *             example:
 *               msg:
 *                 - API: "example-api"
 *                   Description: "Example API"
 *                   Auth: "apiKey"
 *                   HTTPS: true
 *                   Cors: "unknown"
 *                   Link: "https://example.com"
 *                   Category: "example"
 *       '400':
 *         description: Invalid limit parameter. Limit must be a positive number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Invalid limit parameter. Limit must be a positive number."
 *       '500':
 *         description: Failed to fetch data from the third-party API.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: "Failed to fetch data"
 */
router.get("/getdata", userMiddleware, sensitiveRoute);
// task4
/**
 * @swagger
 * /user/protected:
 *   get:
 *     summary: Protected route
 *     description: Returns a message indicating successful authentication with a valid JWT token.
 *     tags:
 *       - User API's
 *     responses:
 *       '200':
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *             example:
 *               msg: "You are successfully authenticated by middleware, i.e., JWT token is valid"
 */

router.get("/protected", userMiddleware, userProtected);

export default router;
