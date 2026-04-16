const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//Middleware
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // EXACTLY matches your Vite frontend URL
    credentials: true, // REQUIRED because you use 'withCredentials: true' in React
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);
app.use(express.json());
app.use(cookieParser());

/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

/* using a all the routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
