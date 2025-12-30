

import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
  } catch (error) {
    console.error("genToken error:", error);
    return null;
  }
};

export default genToken;
