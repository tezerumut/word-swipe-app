import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isCorrectSpeech, setIsCorrectSpeech] = useState(false);
  const [canHear, setCanHear] = useState(true);
  const [canSpeak, setCanSpeak] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const currentData = VOCABULARY_DB[currentLevel][wordIndex];
  const remaining = VOCABULARY_DB[currentLevel].length - (wordIndex + 1);

  const speakWord = (text) => {
    if (!canHear) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const listen = () => {
    if (!canSpeak) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toUpperCase();
      setIsListening(false);
      if (result.includes(currentData.word)) {
        setIsCorrectSpeech(true);
        setTimeout(() => setIsCorrectSpeech(false), 2000); 
      }
    };
    recognition.onerror = () => setIsListening(false);
  };

  const handleManualAction = (known) => {
    if (known) setScore(score + 10);
    setDirection(known ? 1000 : -1000);

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      setIsCorrectSpeech(false);
      if (wordIndex + 1 < VOCABULARY_DB[currentLevel].length) {
        setWordIndex(wordIndex + 1);
      } else if (levelIndex + 1 < levels.length) {
        alert(`${currentLevel} Level Done!`);
        setLevelIndex(levelIndex + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  return (
    <div style={s.container}>
      {/* Üst Bar - Mobilde daha ince */}
      <div style={s.header}>
        <div style={s.stats}>LVL: {currentLevel} | XP: {score}</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊" : "🔇"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤" : "🙊"}</button>
        </div>
      </div>

      {/* Kalan Sayaç */}
      <div style={s.remaining}>REMAINING: {remaining}</div>

      {/* Ana Kart - Mobil ekran genişliğine duyarlı */}
      <div style={s.cardWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData.word}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) handleManualAction(true);
              else if (offset.x < -100) handleManualAction(false);
            }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ x: direction, opacity: 0 }}
            style={s.card}
            onClick={() => { setShowDetails(true); speakWord(currentData.word); listen(); }}
          >
            {isCorrectSpeech && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} style={s.successBadge}>✔</motion.div>
            )}

            <span style={s.hintLabel}>TAP FOR DETAILS • SWIPE TO PASS</span>
            <h1 style={s.word}>{currentData.word}</h1>
            
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
                <div style={s.exampleBox}>
                  <p>"{currentData.example}"</p>
                </div>
                {isListening && <div style={s.listening}>LISTENING...</div>}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alt Butonlar - Mobilde yan yana tam sığar */}
      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>SKIP</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>KNOW</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden", padding: "10px" },
  header: { width: "100%", padding: "15px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderRadius: "15px", marginBottom: "10px" },
  stats: { fontSize: "14px", fontWeight: "bold", color: "#38bdf8" },
  remaining: { fontSize: "12px", color: "#94a3b8", marginBottom: "15px" },
  toggleGroup: { display: "flex", gap: "10px" },
  toggle: (active) => ({ width: "35px", height: "35px", borderRadius: "10px", border: "none", cursor: "pointer", background: active ? "#334155" : "#7f1d1d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }),
  cardWrapper: { width: "100%", maxWidth: "400px", height: "60vh", position: "relative" },
  card: { width: "100%", height: "100%", background: "#1e293b", borderRadius: "25px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "80px", zIndex: 10, pointerEvents: "none" },
  word: { fontSize: "clamp(32px, 8vw, 44px)", letterSpacing: "2px", margin: "10px 0" },
  hintLabel: { fontSize: "10px", color: "#38bdf8", letterSpacing: "1px", opacity: 0.8 },
  details: { width: "100%", overflowY: "auto" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "16px", marginBottom: "8px" },
  definition: { color: "#94a3b8", fontSize: "13px", fontStyle: "italic", marginBottom: "10px", lineHeight: "1.4" },
  exampleBox: { background: "#0f172a", padding: "12px", borderRadius: "10px", fontSize: "12px", borderLeft: "3px solid #38bdf8", color: "#cbd5e1", textAlign: "left" },
  listening: { marginTop: "10px", color: "#fbbf24", fontWeight: "bold", fontSize: "11px" },
  footer: { display: "flex", gap: "15px", marginTop: "auto", marginBottom: "20px", width: "100%", maxWidth: "400px" },
  btn: (clr) => ({ flex: 1, padding: "15px", borderRadius: "12px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", fontSize: "14px", cursor: "pointer" })
};

export default App;
