// import express from "express"
// import { Login, logOut, signUp } from "../controllers/auth.controller.js"
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// // const authRouter=express.Router()
// authRouter.post("/signup",signUp)
// authRouter.post("/login",Login)
// authRouter.post("/logout",logOut)
// // export default authRouter


// import express from "express";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";


// const authRouter= express.Router();

// // Login Route
// authRouter.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await user.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid password" });

//     // Create JWT
//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Set httpOnly cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,       // true if using HTTPS
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.json({ message: "Login successful", token,
//       user: { id: user._id, name: user.name ,email:user.email} });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });




// export default authRouter;


import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js"; 
import { signUp, Login } from "../controllers/auth.controller.js";

const authRouter = express.Router();
authRouter.post("/signup", signUp);
authRouter.post("/login", Login);

export default authRouter;
