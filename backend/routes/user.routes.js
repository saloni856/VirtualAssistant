import express from "express";
import { getCurrentUser, updateAssistant, askToAssistant } from "../controllers/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

// GET current user (requires auth)
router.get("/current", isAuth, getCurrentUser);

// POST update assistant (name + optional image)
router.post("/update", isAuth, upload.single("assistantImage"), updateAssistant);

// POST ask assistant (sends a command to the assistant)
router.post("/ask", isAuth, askToAssistant);

export default router;
// import express from "express";
// import isAuth from "../middleware/isAuth.js";
// import User from "../models/User.js";

// const router = express.Router();

// router.get("/current", isAuth, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;


 