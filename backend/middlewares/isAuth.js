import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  try {
    console.log("COOKIES RECEIVED:", req.cookies);

    const authHeader = req.headers?.authorization;
    const cookieToken = req.cookies?.token;

    // Prefer cookie token, fall back to Authorization header
    let token = cookieToken || null;
    if (!token && authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      console.log("isAuth: no token provided");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Auth token:", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    req.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isAuth;


// import jwt from "jsonwebtoken";
// import user.rou
//  const isAuth = (req, res, next) => {
//   try {
//     // console.log("COOKIES RECEIVED:", req.cookies);

//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({ message: "Not authenticated" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.userId = decoded.userId;

//     next();
//   } catch (error) {
//     console.error("Auth error:", error);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };
// export default isAuth;


// import jwt from "jsonwebtoken";

// export const authMiddleware = (req, res, next) => {
//   const token = req.cookies.token;   // IMPORTANT

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   try {
//     const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid Token" });
//   }
// };
