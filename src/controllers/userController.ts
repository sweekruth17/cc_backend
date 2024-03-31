import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserDB } from "../db/db";
import zod from "zod";
import dotenv from "dotenv";
dotenv.config();

interface User {
  email: String;
  username: String;
  password: String;
}
//using zod lib for data validation
const emailSchema = zod.string().email();
//limit has to be positive
const limitSchema = zod.number().positive();
const passwordSchema = zod.string().min(6);
const jwtsecret = process.env.JWT_SECRET || "plsuseenvfile";

// JWT functions and core logic
const generateJWT = (user: User) => {
  const JwtPayload = { email: user.email, username: user.username };
  return jwt.sign(JwtPayload, jwtsecret, { expiresIn: "5h" });
};

//i have added JWT token in response for this also,generally after signup we wont redirect user to login again. It can be removed according to the requirement
export const userSignUp = async (req: Request, res: Response) => {
  console.log("hello");

  const userDetails: User = req.body;
  const { email, username, password } = userDetails;
  const checkEmail = emailSchema.safeParse(email);
  const checkPassword = passwordSchema.safeParse(password);
  const hashPass = await bcrypt.hash(password.toString(), 10);
  if (!checkEmail.success || !checkPassword.success) {
    return res
      .status(404)
      .json({ message: "Please enter valid credentials again" });
  }
  const result = await UserDB.findOne({ email: email.toString() });
  if (result) {
    return res
      .status(404)
      .json({ message: "Email id already taken pls sign in" });
  }
  const newUser = {
    email,
    username,
    password: hashPass,
  };
  const insertData = await UserDB.create(newUser);
  const token = generateJWT(userDetails);
  if (insertData) {
    return res
      .status(201)
      .json({ message: `user with ${email} created successfully`, JWT: token });
  }
};
export const userSignIn = async (req: Request, res: Response) => {
  const userDetails: User = req.body;
  const { email, username, password } = userDetails;
  const checkEmail = emailSchema.safeParse(email);
  const checkPassword = passwordSchema.safeParse(password);
  if (!checkEmail.success || !checkPassword.success) {
    return res
      .status(404)
      .json({ message: "Please enter valid credentials again" });
  }
  const result = await UserDB.findOne({ email: email.toString() });

  if (result) {
    const checkPasswordMatch = await bcrypt.compare(
      password.toString(),
      result.password
    );
    if (checkPasswordMatch) {
      const token = generateJWT(userDetails);
      return res
        .status(200)
        .json({ message: "User successfully logged In.", JWT: token });
    } else {
      return res
        .status(404)
        .json({ message: "wrong password check credentials again" });
    }
  } else {
    return res.status(404).json({ message: "Error user not found" });
  }
};

const blacklist: string[] = [""];

// for user logout there is nothing much to do when we are using JWT type  system for authication
// on client side it has to delete the jwt tocken from cookie storage
// here is required we can blacklist the jwt token
export const userLogout = async (req: Request, res: Response) => {
  const authorizationHeader = req.headers["authorization"];
  console.log(authorizationHeader);
  
  if (authorizationHeader) {
    const token = authorizationHeader.toString().split(" ")[1]; // as format is "Bearer <token>"

    if (!blacklist.includes(token)) {
      blacklist.push(token);
      res.status(200).json({ msg: "user logged out" }); // Or any other appropriate response
    } else {
      res.status(400).json({ msg: "user already logged out" }); // Or any other appropriate response
    }
  } else {
    console.log("Authorization header not found");
    res.status(400).json({ msg: "Authorization header not found" }); // Or any other appropriate response
  }
};

interface ApiEntry {
  API: string;
  Description: string;
  Auth: string;
  HTTPS: boolean;
  Cors: string;
  Link: string;
  Category: string;
}

//data can be consumed here or task 2 and the same route as JWT authication which is mentioned in task 4
const categories: string[] = [];
export const sensitiveRoute = async (req: Request, res: Response) => {
  let { category, limit } = req.query;
  limit === undefined ? 10 : limit;
  const checkLimit = await limitSchema.safeParseAsync(limit);
  if (checkLimit.success) {
    return res.status(400).json({
      error: "Invalid limit parameter. Limit must be a positive number.",
    });
  }
  try {
    const response = await fetch("https://api.publicapis.org/entries", {
      headers: {
        Accept: "application/json",
      },
    });
    const data = await response.json();
    console.log(data);

    if (!data || !data.entries) {
      return res.status(400).json({ error: "Invalid API response" });
    }
    //filtering based on request
    const filteredData: ApiEntry[] = data.entries
      .filter((entry: ApiEntry) => !category || entry.Category === category)
      .slice(0, limit);
   return res.status(200).json({ msg: filteredData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const userProtected = async (req: Request, res: Response) => {
  console.log("pro");

  return res.status(200).json({
    msg: "you are successfully authenticated by middleware ie JWT token is valid",
  });
};
