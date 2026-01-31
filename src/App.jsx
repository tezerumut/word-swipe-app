import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [canHear, setCanHear] = useState(true);
  const [canSpeak, setCanSpeak] = useState(true);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const currentData = VOCABULARY_DB[currentLevel][wordIndex];

  // Profesyonel Seslendirme
  const speakWord = (text) => {
    if (!canHear) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // Sesli Yanıtı Dinleme (Speech Recognition)
  const listenAndVerify = () => {
    if (!canSpeak) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tarayıcınız ses tanımayı desteklemiyor.");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript.toUpperCase();
      setIsListening(false);
      if (speechToText.includes(currentData.word)) {
        handleSwipe(true); // Kelime doğru telaffuz edildiyse otomatik sağa at
      }
    };
    recognition.onerror = () => setIsListening(false);
  };

  const handleSwipe = (known) => {
    if (known) setScore(score + 10);
    setDirection(known ? 1000 : -1000);

    setTimeout(() => {
      setDirection(0);
      if (wordIndex + 1 < VOCABULARY_DB[currentLevel].length) {
        setWordIndex(wordIndex + 1);
      } else if (levelIndex + 1 < levels.length) {
        alert(`${currentLevel} bitti! ${levels[levelIndex + 1]} seviyesine geçiliyor.`);
        setLevelIndex(levelIndex + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  return (
    <div style={s.container}>
      {/* Dashboard - Profesyonel Header */}
      <div style={s.header}>
        <div style={s.stats}>LEVEL: {currentLevel} | SCORE: {score}</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊 Ses Açık" : "🔇 Ses Kapalı"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤 Mikrofon Açık" : "🙊 Mikrofon Kapalı"}</button>
        </div>
      </div>

      {/* Tinder Kartı */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentData.word}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, x: 0 }}
          exit={{ x: direction, opacity: 0 }}
          style={s.card}
          onClick={() => { speakWord(currentData.word); listenAndVerify(); }}
        >
          <span style={s.hintLabel}>CLICK TO HEAR & SPEAK</span>
          <h1 style={s.word}>{currentData.word}</h1>
          <p style={s.definition}>{currentData.hint}</p>
          {isListening && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity }} style={s.listening}>Listening...</motion.div>}
        </motion.div>
      </AnimatePresence>

      {/* Kontroller */}
      <div style={s.footer}>
        <button onClick={() => handleSwipe(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleSwipe(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>
    </div>
  );
};

// CSS-in-JS: Modern ve Profesyonel Tasarım
const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", color: "#f8fafc" },
  header: { position: "absolute", top: 0, width: "100%", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e293b", background: "#1e293b" },
  stats: { fontSize: "14px", fontWeight: "bold", color: "#38bdf8" },
  toggleGroup: { display: "flex", gap: "10px" },
  toggle: (active) => ({ padding: "6px 12px", borderRadius: "8px", border: "none", cursor: "pointer", background: active ? "#334155" : "#7f1d1d", color: "#fff", fontSize: "12px" }),
  card: { width: "380px", height: "500px", background: "#1e293b", borderRadius: "24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px", cursor: "pointer", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)", border: "1px solid #334155", textAlign: "center" },
  word: { fontSize: "48px", letterSpacing: "4px", margin: "20px 0", color: "#fff" },
  definition: { color: "#94a3b8", fontSize: "18px", lineHeight: "1.6" },
  hintLabel: { fontSize: "10px", color: "#38bdf8", letterSpacing: "2px" },
  listening: { marginTop: "20px", color: "#fbbf24", fontWeight: "bold" },
  footer: { display: "flex", gap: "20px", marginTop: "40px" },
  btn: (clr) => ({ padding: "16px 32px", borderRadius: "12px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", cursor: "pointer", fontSize: "16px" })
};

export default App;
