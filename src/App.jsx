import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const currentData = VOCABULARY_DB[currentLevel][wordIndex];
  const totalWordsInLevel = VOCABULARY_DB[currentLevel].length;
  const remainingWords = totalWordsInLevel - (wordIndex + 1);

  const speak = (text) => {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "en-US";
    window.speechSynthesis.speak(msg);
  };

  const handleSwipeAction = (known) => {
    if (known) setScore(score + 10);
    setDirection(known ? 1000 : -1000); // Gerçek Swipe Efekti

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      if (wordIndex + 1 < totalWordsInLevel) {
        setWordIndex(wordIndex + 1);
      } else if (levelIndex + 1 < levels.length) {
        alert(`${currentLevel} Seviyesi Tamamlandı! Yeni Seviye: ${levels[levelIndex + 1]}`);
        setLevelIndex(levelIndex + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  return (
    <div style={s.container}>
      {/* Üst Bilgi Paneli */}
      <div style={s.header}>
        <div style={s.stats}>
          <span>LEVEL: {currentLevel}</span>
          <span style={{marginLeft: "20px", color: "#22c55e"}}>SCORE: {score}</span>
        </div>
        <div style={s.remaining}>KALAN KELİME: {remainingWords}</div>
      </div>

      {/* Tinder Kartı (Drag/Swipe Aktif) */}
      <div style={s.cardWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData.word}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x > 100) handleSwipeAction(true);
              else if (offset.x < -100) handleSwipeAction(false);
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ x: direction, opacity: 0 }}
            style={s.card}
            onClick={() => { setShowDetails(true); speak(currentData.word); }}
          >
            <span style={s.topHint}>KARTI KAYDIR VEYA TIKLA</span>
            <h1 style={s.word}>{currentData.word}</h1>
            
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
                <div style={s.exampleBox}>
                  <strong>SENTENCE:</strong>
                  <p>"{currentData.example}"</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt Kontrol Butonları */}
      <div style={s.footer}>
        <button onClick={() => handleSwipeAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM (SOL)</button>
        <button onClick={() => handleSwipeAction(true)} style={s.btn("#22c55e")}>BİLİYORUM (SAĞ)</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#f8fafc", overflow: "hidden" },
  header: { position: "absolute", top: 0, width: "100%", padding: "20px 40px", display: "flex", justifyContent: "space-between", background: "#1e293b", borderBottom: "1px solid #334155" },
  stats: { fontSize: "16px", fontWeight: "bold", color: "#38bdf8" },
  remaining: { fontSize: "14px", color: "#94a3b8", fontWeight: "600" },
  cardWrapper: { position: "relative", width: "380px", height: "520px", perspective: "1000px" },
  card: { width: "100%", height: "100%", background: "#1e293b", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px", cursor: "grab", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", border: "1px solid #334155", textAlign: "center" },
  word: { fontSize: "44px", letterSpacing: "3px", margin: "10px 0", color: "#fff" },
  topHint: { fontSize: "10px", color: "#38bdf8", letterSpacing: "2px", marginBottom: "20px" },
  details: { marginTop: "20px", width: "100%" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "18px", marginBottom: "10px" },
  definition: { color: "#94a3b8", fontSize: "15px", fontStyle: "italic", marginBottom: "20px" },
  exampleBox: { background: "#0f172a", padding: "15px", borderRadius: "15px", fontSize: "14px", color: "#cbd5e1", borderLeft: "4px solid #38bdf8" },
  footer: { display: "flex", gap: "20px", marginTop: "40px" },
  btn: (clr) => ({ padding: "16px 28px", borderRadius: "14px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", cursor: "pointer", fontSize: "14px", transition: "0.3s" })
};

export default App;
