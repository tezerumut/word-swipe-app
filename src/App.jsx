import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

export default function App() {
  const [level, setLevel] = useState("A1");
  const [index, setIndex] = useState(0);
  const [canHear, setCanHear] = useState(true);
  const [canSpeak, setCanSpeak] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);

  const currentWord = VOCABULARY_DB[level][index];

  // Kelime Telaffuzu
  const playAudio = () => {
    if (canHear) {
      const audio = new Audio(currentWord.audio);
      audio.play();
    }
  };

  const handleSwipe = (known) => {
    setShowMeaning(false);
    if (index + 1 < VOCABULARY_DB[level].length) {
      setIndex(index + 1);
    } else {
      alert(`${level} seviyesi bitti! Bir üst seviyeye hazırsın.`);
      // Seviye atlama mantığı buraya eklenecek
    }
  };

  return (
    <div style={{ height: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "Inter", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      
      {/* Üst Durum Çubuğu */}
      <div style={{ position: "absolute", top: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setCanHear(!canHear)} style={utilBtn}>{canHear ? "🔊 Duyabiliyorum" : "🔇 Duyamıyorum"}</button>
        <button onClick={() => setCanSpeak(!canSpeak)} style={utilBtn}>{canSpeak ? "🎤 Konuşabiliyorum" : "🙊 Konuşamıyorum"}</button>
      </div>

      <div style={{ marginBottom: "20px", color: "#38bdf8", fontWeight: "bold" }}>Level: {level} | Progress: {index + 1}/{VOCABULARY_DB[level].length}</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.word}
          onClick={() => { setShowMeaning(true); playAudio(); }}
          style={cardStyle}
          whileTap={{ scale: 0.95 }}
        >
          <h1 style={{ fontSize: "40px", letterSpacing: "5px" }}>{currentWord.word}</h1>
          {showMeaning && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ color: "#94a3b8" }}>{currentWord.hint}</p>
              {canSpeak && <p style={{ color: "#22c55e", marginTop: "10px" }}>Şimdi tekrarla...</p>}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={{ display: "flex", gap: "40px", marginTop: "40px" }}>
        <button onClick={() => handleSwipe(false)} style={actionBtn("#ef4444")}>BİLMİYORUM (SOL)</button>
        <button onClick={() => handleSwipe(true)} style={actionBtn("#22c55e")}>BİLİYORUM (SAĞ)</button>
      </div>
    </div>
  );
}

const cardStyle = { width: "350px", height: "450px", backgroundColor: "#1e293b", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid #334155", padding: "20px" };
const utilBtn = { padding: "8px 15px", borderRadius: "8px", border: "1px solid #334155", backgroundColor: "#1e293b", color: "#94a3b8", cursor: "pointer" };
const actionBtn = (clr) => ({ padding: "15px 30px", borderRadius: "12px", border: `2px solid ${clr}`, backgroundColor: "transparent", color: clr, fontWeight: "bold", cursor: "pointer" });
