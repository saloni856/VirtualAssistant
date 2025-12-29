import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp = async(req,res)=>{
  try{
    const{name,email,password}=req.body
    const existEmail=await User.findOne({email})
if(existEmail){
  return res.status(400).json({message:"email already exists !"})
}

if(password.length<6){
  return res.status(400).json({message:"password must be at least 6 character !"})
}

const hashedPassword= await bcrypt.hash(password,10)

const user=await User.create({
  name,password:hashedPassword,email
})

const token = await genToken(user._id);
res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",
  secure: false,
});

return res.status(201).json({
  message: "Sign up successful",
  token,
  user: { _id: user._id, name: user.name, email: user.email, assistantName: user.assistantName || null },
});

  }catch(error){
return res.status(500).json({message:"sign up error ${error}"})
  }
}

export const Login = async(req,res)=>{
  try{
    const{email,password}=req.body
const user=await User.findOne({email})
if (!user) {
  return res.status(400).json({ message: "Email does not exist!" });
}


const isMatch=await bcrypt.compare(password,user.password)

if(!isMatch){
   return res.status(400).json({message:" incorrect password !"})
}


const token = await genToken(user._id);
res.cookie("token", token, {
  httpOnly: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax",
  secure: false,
});

return res.status(200).json({
  message: "Login successful",
  token,
  user: { _id: user._id, name: user.name, email: user.email, assistantName: user.assistantName || null },
});

  }catch(error){
return res.status(500).json({message:"login error ${error}"})
  }
}

export const logOut=async(req,res)=>{
  try{
res.clearCookie("token")
return res.status(200).json({message:"logout successfully  "})
  }catch(error){
return res.status(500).json({ message: `login error ${error}` });
  
  }
}

// import genToken from "../config/token.js";
// import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";

// export const signUp = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existEmail = await User.findOne({ email });
//     if (existEmail) {
//       return res.status(400).json({ message: "email already exists!" });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ message: "password must be at least 6 characters!" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const token = genToken(user._id);
      

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

      
//     return res.status(201).json({
//       message: "Sign up successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         assistantName: user.assistantName || null,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: `sign up error ${error}` });
//   }
// };

// export const Login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Email does not exist!" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Incorrect password!" });

//     const token = genToken(user._id);

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       secure: false,
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     return res.status(200).json({
//       message: "Login successful",
//       token,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         assistantName: user.assistantName || null,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: `login error ${error}` });
//   }
// };
