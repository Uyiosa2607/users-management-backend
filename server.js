
import express  from "express";

import dotenv from "dotenv";

import cors from "cors";

import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    //origin: "https://users-management-70e1.onrender.com",
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
  })
);

app.use(cookieParser());

import connectDB from "./db.js"

import router from "./routes/auth.js";

app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api", router);

app.get("/", (req, res) => {

    res.status(200).send("Backend Server is up and running")

});

app.listen(PORT, () => console.log(`Server has started and running on Port ${PORT}`));

