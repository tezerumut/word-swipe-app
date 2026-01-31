import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState(null);

  const currentData = OXFORD_DATA[currentIndex];

  const handleSwipe = (isCorrect) => {
    if (isCorrect) setScore(score + 10);
    setDirection(isCorrect ? 1000 : -1000); // Sağa (+1000) veya Sola (-1000) fırlatma
    
    setTimeout(() => {
      setDirection(null);
      setCurrentIndex((prev) => (prev + 1) % OXFORD_DATA.length);
    }, 300);
  };

  return (
    <div style={{ 
      height: "100vh", backgroundColor: "#0f172a", display: "flex", 
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Inter', sans-serif", overflow: "hidden", color: "#f8fafc"
    }}>
      
      {/* Üst Panel: Puan ve İlerleme */}
      <div style={{ position: "absolute", top: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "28px", fontWeight: "800", color: "#38bdf8" }}>SCORE: {score}</div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "8px", letterSpacing: "2px" }}>
          LEVEL 1 • WORD {currentIndex + 1} / {OXFORD_DATA.length}
        </div>
      </div>

      {/* Swipe Kart Alanı */}
      <div style={{ position: "relative", width: "350px", height: "450px" }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ x: direction, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: "absolute", width: "100%", height: "100%",
              backgroundColor: "#1e293b", borderRadius: "24px",
              border: "1px solid #334155", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", padding: "40px",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            <div style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "700", marginBottom: "15px" }}>DEFINITION</div>
            <p style={{ fontSize: "19px", textAlign: "center", lineHeight: "1.6", color: "#e2e8f0", marginBottom: "40px" }}>
              "{currentData.hint}"
            </p>
            
            <div style={{ 
              fontSize: "34px", letterSpacing: "10px", fontWeight: "900", 
              color: "#f8fafc", borderBottom: "3px solid #38bdf8", paddingBottom: "10px" 
            }}>
              {currentData.word.split('').map(() => "_").join(' ')}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Kontrol Butonları */}
      <div style={{ display: "flex", gap: "30px", marginTop: "60px" }}>
        <button onClick={() => handleSwipe(false)} style={btnStyle("#ef4444")}>✕</button>
        <button onClick={() => handleSwipe(true)} style={btnStyle("#22c55e")}>✓</button>
      </div>

      <p style={{ marginTop: "20px", color: "#475569", fontSize: "12px" }}>
        Swipe Right to confirm (✓) | Swipe Left to skip (✕)
      </p>
    </div>
  );
}

const btnStyle = (color) => ({
  width: "75px", height: "75px", borderRadius: "50%", border: `2px solid ${color}`,
  backgroundColor: "transparent", color: color, fontSize: "28px", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", transition: "0.2s"
});
