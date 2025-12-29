// import jwt from "jsonwebtoken"

// const genToken=(UserId)=>{
//   try{
//     const token = jwt.sign({UserId},process.env.JWT_SECRET,{expiresIn:"10d"})
//     return token
//   }
//   catch(error){
// console.error(error)
//   }
// }

// export default genToken

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
