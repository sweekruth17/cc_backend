import { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtsecret = process.env.JWT_SECRET || "plsuseenvfile";
export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  var authorizationHeader = req.headers["authorization"],
    token,
    check;
    console.log(req.headers);
    
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    //if user dont have jwt or has wrong one
    return res.status(401).json({
      message: "Unauthorized: Missing or invalid authorization header",
    });
  }

  token = authorizationHeader.toString().split(" ")[1];
  try {
    check = jwt.verify(token, jwtsecret);
  } catch (error) {
    //we might have to redirect user to login page again from client side
    console.log(error);

    return res.status(404).json({ message: "Auth/JWT invalid !! " });
  }
  next();

};
