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
        setLevelIndex(levelIndex + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  return (
    <div style={s.container}>
      {/* İnce Header */}
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.remaining}>REMAINING: {remaining}</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊" : "🔇"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤" : "🙊"}</button>
        </div>
      </div>

      {/* Küçük ve Esnek Kart Alanı */}
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

            <h1 style={s.word}>{currentData.word}</h1>
            
            {showDetails ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
                <div style={s.exampleBox}>
                  <p>"{currentData.example}"</p>
                </div>
                {isListening && <div style={s.listening}>LISTENING...</div>}
              </motion.div>
            ) : (
              <p style={s.tapHint}>TAP TO REVEAL</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Alttan Yükseltilmiş Butonlar */}
      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>SKIP</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>KNOW</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden", padding: "10px 15px" },
  header: { width: "100%", padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderRadius: "12px", marginTop: "5px" },
  stats: { fontSize: "13px", fontWeight: "bold", color: "#38bdf8" },
  remaining: { fontSize: "11px", color: "#94a3b8" },
  toggleGroup: { display: "flex", gap: "5px" },
  toggle: (active) => ({ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#334155" : "#7f1d1d", fontSize: "14px" }),
  cardWrapper: { width: "100%", maxWidth: "360px", height: "55vh", position: "relative", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "320px", maxHeight: "100%", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", boxShadow: "0 15px 30px rgba(0,0,0,0.4)", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "60px", zIndex: 10, pointerEvents: "none", top: "20%" },
  word: { fontSize: "clamp(28px, 7vw, 38px)", letterSpacing: "2px", margin: "5px 0" },
  tapHint: { fontSize: "10px", color: "#38bdf8", opacity: 0.6, marginTop: "10px" },
  details: { width: "100%", marginTop: "10px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "15px", marginBottom: "5px" },
  definition: { color: "#94a3b8", fontSize: "12px", marginBottom: "8px", lineHeight: "1.3" },
  exampleBox: { background: "#0f172a", padding: "10px", borderRadius: "8px", fontSize: "11px", borderLeft: "3px solid #38bdf8", color: "#cbd5e1", textAlign: "left" },
  listening: { marginTop: "8px", color: "#fbbf24", fontWeight: "bold", fontSize: "10px" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "360px" },
  btn: (clr) => ({ flex: 1, padding: "12px", borderRadius: "10px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", fontSize: "13px" })
};

export default App;
