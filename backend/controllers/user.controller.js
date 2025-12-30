 import uploadOnCloudinary from "../config/cloudinary.js"
 import geminiResponse from "../gemini.js"
import User from"../models/user.model.js"
import moment from "moment"


import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const provider = process.env.AI_PROVIDER; 
// "openai" | "gemini" | "groq"

export const askAI = async (req, res) => {
  const { prompt, history } = req.body;

  let reply = "";

  if (provider === "openai") {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });
    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [...history, { role: "user", content: prompt }],
    });
    reply = r.choices[0].message.content;
  }

  if (provider === "gemini") {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const r = await model.generateContent(prompt);
    reply = r.response.text();
  }

  if (provider === "groq") {
    const groq = new Groq({ apiKey: process.env.GROQ_KEY });
    const r = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    });
    reply = r.choices[0].message.content;
  }

  res.json({ reply });
};



export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // set from auth middleware
    console.log("getCurrentUser called, req.userId:", userId);

    if (!userId) {
      console.error("getCurrentUser: missing req.userId");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Looking up user in DB with id:", userId);
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    return res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "get current user error" });
  }
};

export const updateAssistant=async(req,res)=>{
  try{
     const{assistantName,imageUrl}=req.body
     let assistantImage;
  if(req.file){
    assistantImage=await uploadOnCloudinary(req.file.path)
  }   
  else{
    assistantImage=imageUrl
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { assistantName, assistantImage },
    { new: true }
  ).select("-password");

  return res.status(200).json({ user });
  } 
  catch(error){
     return res.status(400).json({message:" updateAssistant error"})
  }
}
export const askToAssistant=async(req,res)=>{
  try{
    const {command}=req.body
    const user=await User.findById(req.userId);
    user.history.push(command)
    user.save()
    const userName=user.name
    const assistantName=user.assistantName
    const result=await geminiResponse(command,assistantName,userName)

    const jsonMatch=result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      return res.status(400).json({response:"sorry,i can't understand"})
    }
    const gemResult=JSON.parse(jsonMatch[0])
    console.log(gemResult)
    const type=gemResult.type
    switch(type){
      case 'get-date':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:`current date is ${moment().format("YYYY-MM-DD")}`
        });
        case 'get-time':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:`current time is ${moment().format("hh:mm:A")}`
        });
       case 'get-month':
        return res.json({
          type,
          userInput: gemResult.userInput,
          response:`current month is ${moment().format("MMMM")}`
        });
        case 'google-search':
        case 'youtube-search':
        case 'youtube-play':
        case 'general':
        case 'calculator-open':
        case 'instagram-open':
        case 'facebook-open':
        case 'weather-show':
          return res.json({
            type,
          userInput: gemResult.userInput,
          response:gemResult.response,
          });
          default:
           return res.status(400).json({response : "I didn't understand that command."})


        }
        
  }catch(error){
    return res.status(500).json({response : "ask assistant error"})

  }
}


