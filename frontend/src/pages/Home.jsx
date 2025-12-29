// // Home.jsx — Optimized: no-speech fixes + safe recognition starts

// import React, { useContext, useState, useEffect, memo } from "react";
// import { userDataContext } from "../context/userContext";
// import { useNavigate } from "react-router-dom";
// import api from "../api";
// import aiImg from "../assets/ai.gif";
// import userImg from "../assets/mic.webp";
// import { BiMenu } from "react-icons/bi";
// import { RxCross2 } from "react-icons/rx";
// import { motion, AnimatePresence } from "framer-motion";

// /* =========================
//    Reusable Sidebar Button
// ========================= */
// const SidebarButton = memo(({ onClick, children }) => (
//   <button
//     onClick={onClick}
//     className="w-full bg-white/80 hover:bg-white transition rounded-xl px-6 py-3 font-semibold backdrop-blur-md shadow"
//   >
//     {children}
//   </button>
// ));

// export default function Home() {
//   const { userData, setUserData } = useContext(userDataContext);
//   const navigate = useNavigate();

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [listening, setListening] = useState(false);

//   /*  Logout*/
//   const handleLogout = async () => {
//     try {
//       await api.get("/api/auth/logout");
//     } finally {
//       setUserData(null);
//       navigate("/signin");
//     }
//   };

//   /* =========================
//      Close menu on resize (UX)
//   ========================= */
//   useEffect(() => {
//     const closeOnResize = () => {
//       if (window.innerWidth >= 1024) setMenuOpen(false);
//     };
//     window.addEventListener("resize", closeOnResize);
//     return () => window.removeEventListener("resize", closeOnResize);
//   }, []);

//   return (
//     <div className="relative min-h-screen w-full bg-gradient-to-t from-black to-[#030353] flex">

//       {/* ================= DESKTOP SIDEBAR ================= */}
//       <aside className="hidden lg:flex w-72 h-screen bg-white/10 backdrop-blur-xl border-r border-white/20 p-6 flex-col gap-4">
//         <h2 className="text-white text-xl font-bold mb-4">Menu</h2>
//         <SidebarButton onClick={() => navigate("/Customize")}>
//           Customize Assistant
//         </SidebarButton>
//         <SidebarButton onClick={handleLogout}>Log Out</SidebarButton>
//       </aside>

//       {/* ================= MOBILE HAMBURGER ================= */}
//       <button
//         className="lg:hidden fixed top-5 right-5 z-50 text-white"
//         onClick={() => setMenuOpen(true)}
//         aria-label="Open menu"
//       >
//         <BiMenu size={32} />
//       </button>

//       {/* ================= MOBILE SLIDE-IN MENU ================= */}
//       <AnimatePresence>
//         {menuOpen && (
//           <motion.div
//             initial={{ x: "100%" }}
//             animate={{ x: 0 }}
//             exit={{ x: "100%" }}
//             transition={{ type: "spring", stiffness: 260, damping: 30 }}
//             className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xl p-6 flex flex-col gap-4"
//           >
//             <button
//               className="absolute top-5 right-5 text-white"
//               onClick={() => setMenuOpen(false)}
//               aria-label="Close menu"
//             >
//               <RxCross2 size={30} />
//             </button>

//             <h2 className="text-white text-xl font-bold mb-6">Menu</h2>

//             <SidebarButton onClick={() => navigate("/Customize")}>
//               Customize Assistant
//             </SidebarButton>

//             <SidebarButton onClick={handleLogout}>Log Out</SidebarButton>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 flex flex-col items-center gap-6 p-6">

//         {/* Assistant Card */}
//         <div className="mt-16 w-[300px] sm:w-[470px] md:w-[120px] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl bg-white/10 backdrop-blur-lg">
//           <img
//             src={userData?.assistantImage || userImg}
//             alt="Assistant"
//             className="w-full h-full object-cover"
//           />
//         </div>

//         {/* Mic Button */}
//         <button
//           onClick={() => setListening(!listening)}
//           className="bg-white/90 hover:bg-white transition px-8 py-3 rounded-full font-semibold shadow"
//         >
//           {listening ? "Stop Listening" : "Start Listening"}
//         </button>

//         <h1 className="text-white text-xl font-semibold text-center">
//           I'm JARVIS — {userData?.assistantName}
//         </h1>

//         <img
//           src={listening ? aiImg : userImg}
//           alt="Status"
//           className="w-[140px]"
//         />
//       </main>
//     </div>
//   );
// }

// 

import { useContext, useState, useEffect, memo, useCallback, useRef } from "react";
import { userDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/mic.webp";
import { BiMenu } from "react-icons/bi";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";

const SidebarButton = memo(({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full bg-white/5 hover:bg-white/10 text-white transition-all rounded-xl px-6 py-3 font-semibold backdrop-blur-md border border-white/10 shadow-lg text-left active:scale-95 lg:active:scale-100"
  >
    {children}
  </button>
));

export default function Home() {
  const { userData, setUserData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  /* =========================
      SPEAKING LOGIC
  ========================= */
  const speak = useCallback((text) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voices = synthRef.current.getVoices();
    // Logic to select a clear English voice
    utterance.voice = voices.find(v => v.lang.startsWith("en-GB") || v.name.includes("Male")) || voices[0];
    utterance.rate = 1.0;

    utterance.onstart = () => { setIsSpeaking(true); setIsProcessing(false); };
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  }, []);

  /* =========================
      INITIAL GREETING
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => {
      speak(`Systems initialized. How can I help you, ${userData?.assistantName || "Commander"}?`);
    }, 1200);
    return () => clearTimeout(timer);
  }, [userData, speak]);

  /* =========================
      COMMAND & SEARCH LOGIC
  ========================= */
  const processCommand = async (command) => {
    const lowerCommand = command.toLowerCase().trim();
    setIsProcessing(true);

    // 1. Check for Search Commands first
    if (lowerCommand.startsWith("search for") || lowerCommand.startsWith("google")) {
      const query = lowerCommand.replace("search for", "").replace("google", "").trim();
      speak(`Accessing global database for ${query}.`);
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
      setIsProcessing(false);
      return;
    }

    // 2. Default AI Backend Call
    try {
      const response = await api.post("/api/ai/chat", { prompt: command });
      speak(response.data.reply || "I have processed your request.");
    } catch (err) {
      console.error("Connection Error:", err);
      // Fallback if server is down (ECONNREFUSED)
      speak("System offline. I am currently unable to reach the neural network. Please check your backend connection.");
    } finally {
      setIsProcessing(false);
    }
  };

  /* =========================
      SPEECH RECOGNITION
  ========================= */
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.onstart = () => { setListening(true); setTranscript("Listening..."); };
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setTranscript(text);
      setListening(false);
      processCommand(text);
    };
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
  }, [speak]);

  const toggleInteraction = () => {
    if (isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    } else if (listening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
    }
  };

  return (
    <div className="relative h-screen w-full bg-[#010114] flex overflow-hidden text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#04044d_0%,#000_100%)] opacity-80 pointer-events-none" />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-64 h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 p-8 flex-col gap-4 z-20">
        <div className="mb-10">
          <p className="text-blue-500 font-mono text-[10px] tracking-widest uppercase">System HUD</p>
          <h2 className="text-2xl font-bold">JARVIS</h2>
        </div>
        <SidebarButton onClick={() => navigate("/Customize")}>Assistant Settings</SidebarButton>
        <SidebarButton onClick={async () => { await api.get("/api/auth/logout"); setUserData(null); navigate("/signin"); }}>Log Out</SidebarButton>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 p-6">
        <div className="relative mb-12">
          <motion.div 
            animate={(listening || isSpeaking) ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
            transition={{ repeat: Infinity, duration: 3 }}
            className={`w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 transition-all duration-700 ${
              (listening || isSpeaking) ? 'border-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'border-white/10'
            }`}
          >
            <img src={userData?.assistantImage || userImg} className={`w-full h-full object-cover transition-all ${isProcessing ? 'brightness-50' : ''}`} />
          </motion.div>
          {isProcessing && <div className="absolute inset-[-12px] border-t-2 border-blue-500 rounded-full animate-spin" />}
        </div>

        <div className="text-center mb-12 px-4 max-w-2xl">
          <p className="text-xl md:text-3xl font-extralight tracking-wide leading-relaxed min-h-[100px]">
            {transcript || "Standing by..."}
          </p>
        </div>

        <button 
          onClick={toggleInteraction} 
          className={`w-24 h-24 flex items-center justify-center rounded-full transition-all duration-300 shadow-2xl ${listening ? "bg-red-600 shadow-red-900 scale-110" : "bg-white hover:bg-blue-400 active:scale-95"}`}
        >
          <img src={(listening || isSpeaking) ? aiImg : userImg} className="w-12 h-12 object-contain" />
        </button>
      </main>
    </div>
  );
}