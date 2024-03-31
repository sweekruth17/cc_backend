import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
dotenv.config();
import userRouter from "./routes/users";
import swaggerDocs from "./utils/swagger";

const app: Express = express();
const port: number = parseInt(<string>process.env.PORT, 10) || 3000;
const mongoDBUrl: string = process.env.MONGODB_URL || "";

app.use(bodyParser.json());
app.use("/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("server is alive");
});

const main = () => {
  // Connect to MongoDB
  try {
    mongoose.connect(mongoDBUrl);
    console.log("Application connected to mongoDB ......");
  } catch (error) {
    console.log("mongodb connextion failed pls check");
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    swaggerDocs(app, port);
  });
};

main();
