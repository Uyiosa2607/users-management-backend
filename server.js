
import express  from "express";

import dotenv from "dotenv";

import cors from "cors";

import cookieParser from "cookie-parser";

import connectDB from "./db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";


dotenv.config();

connectDB();

const app = express();

app.use(
  cors({
    origin: "https://users-management-70e1.onrender.com",
    credentials: true
  })
);

app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);
app.use("/api",userRoutes);

app.get("/", (req, res) => {

    res.status(200).send("Backend Server is up and running")

});

app.listen(PORT, () => console.log(`Server has started and running on Port ${PORT}`));

