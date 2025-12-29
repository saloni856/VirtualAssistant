// import express from "express"
// import dotenv from "dotenv"
// dotenv.config()
// import connectDb from "./config/db.js"
// import authRouter from "./routes/auth.routes.js"
// import cors from "cors"
// import cookieParser from "cookie-parser"
// import userRouter from "./routes/user.routes.js"
// const app = express()
// app.use(cors({
//   origin:"http://localhost:5173",
//   credentials:true
// }))
// const port = process.env.PORT || 5000

// app.use(express.json())
// app.use(cookieParser())
// app.use("/api/auth",authRouter)
// app.use("/api/user",userRouter)

// app.listen(port,()=>{
//   connectDb()
//   console.log("Server Started")
// })

import dotenv from "dotenv";
dotenv.config();

import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import logRequests from "./middlewares/logRequests.js";

const app = express();

// FIX 1 — CORS
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Request logging for debugging
app.use(logRequests);

// FIX 2 — Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// FIX 3 — Define port
const port = process.env.PORT || 5000;

// FIX 4 — Start server
app.listen(port, () => {
  connectDb();
  console.log("Server started on port", port);
});

// Central error handler — logs errors and returns JSON
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

// Log unhandled promise rejections and uncaught exceptions
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// const app = express();

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// app.use(express.json());
// app.use(cookieParser());

// import userRouter from "./routes/userRoutes.js";
// app.use("/api/user", userRouter);

// app.listen(8000, () => console.log("Server running on port 8000"));
