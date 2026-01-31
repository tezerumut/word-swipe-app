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
    const SpeechRecognition = window.Recognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toUpperCase();
      setIsListening(false);
      
      // Doğru telaffuzda sadece tik çıkar, kart yerinde kalır.
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
        alert(`${currentLevel} Level Complete! Next: ${levels[levelIndex + 1]}`);
        setLevelIndex(levelIndex + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  return (
    <div style={s.container}>
      {/* Header Paneli */}
      <div style={s.header}>
        <div style={s.stats}>LEVEL: {currentLevel} | SCORE: {score}</div>
        <div style={s.remaining}>REMAINING: {remaining}</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊 Hear ON" : "🔇 Hear OFF"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤 Speak ON" : "🙊 Speak OFF"}</button>
        </div>
      </div>

      {/* Manuel Swipe Kartı */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentData.word}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x > 150) handleManualAction(true);
            else if (offset.x < -150) handleManualAction(false);
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ x: direction, opacity: 0 }}
          style={s.card}
          onClick={() => { setShowDetails(true); speakWord(currentData.word); listen(); }}
        >
          {/* Sadece Görsel Onay */}
          {isCorrectSpeech && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} style={s.successBadge}>
              ✔
            </motion.div>
          )}

          <span style={s.hintLabel}>CLICK FOR DETAILS | SWIPE MANUALLY TO PASS</span>
          <h1 style={s.word}>{currentData.word}</h1>
          
          {showDetails && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
              <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
              <p style={s.definition}>{currentData.hint}</p>
              <div style={s.exampleBox}>
                <strong>EXAMPLE:</strong>
                <p>"{currentData.example}"</p>
              </div>
              {isListening && <div style={s.listening}>LISTENING...</div>}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Alt Manuel Butonlar */}
      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>I DON'T KNOW</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>I KNOW</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden" },
  header: { position: "absolute", top: 0, width: "100%", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderBottom: "1px solid #334155", zIndex: 100 },
  stats: { fontSize: "14px", fontWeight: "bold", color: "#38bdf8" },
  remaining: { fontSize: "12px", color: "#94a3b8" },
  toggleGroup: { display: "flex", gap: "10px" },
  toggle: (active) => ({ padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#334155" : "#7f1d1d", color: "white", fontSize: "11px" }),
  card: { position: "relative", width: "380px", minHeight: "530px", background: "#1e293b", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", cursor: "grab", border: "1px solid #334155", textAlign: "center", boxShadow: "0 25px 50px rgba(0,0,0,0.6)" },
  successBadge: { position: "absolute", top: "20%", color: "#22c55e", fontSize: "80px", z { textShadow: "0 0 20px rgba(34, 197, 94, 0.4)" }, pointerEvents: "none" },
  word: { fontSize: "44px", letterSpacing: "3px", margin: "15px 0", color: "#fff" },
  hintLabel: { fontSize: "10px", color: "#38bdf8", letterSpacing: "1.5px", marginBottom: "10px" },
  details: { width: "100%", marginTop: "20px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "18px", marginBottom: "10px" },
  definition: { color: "#94a3b8", fontSize: "15px", fontStyle: "italic", marginBottom: "15px" },
  exampleBox: { background: "#0f172a", padding: "15px", borderRadius: "12px", fontSize: "13px", textAlign: "left", borderLeft: "4px solid #38bdf8", color: "#cbd5e1" },
  listening: { marginTop: "15px", color: "#fbbf24", fontWeight: "bold", fontSize: "12px" },
  footer: { display: "flex", gap: "25px", marginTop: "40px" },
  btn: (clr) => ({ padding: "18px 35px", borderRadius: "15px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", cursor: "pointer", fontSize: "14px" })
};

export default App;
