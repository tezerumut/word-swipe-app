import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]); // Yanlışları takip eder
  const [isListening, setIsListening] = useState(false);
  const [isCorrectSpeech, setIsCorrectSpeech] = useState(false);
  const [canHear, setCanHear] = useState(true);
  const [canSpeak, setCanSpeak] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const levelWords = VOCABULARY_DB[currentLevel] || [];
  const currentData = levelWords[wordIndex];
  const remaining = levelWords.length - (wordIndex + 1);

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
    if (known) {
      setScore(prev => prev + 10);
    } else {
      // Bilmiyorsa kelimeyi mistake listesine ekle
      setMistakes(prev => [...new Set([...prev, currentData.word])]);
    }
    
    setDirection(known ? 1000 : -1000);

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      setIsCorrectSpeech(false);
      
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else {
        // SEVİYE SONU RAPORU VE GEÇİŞ
        alert(`Tebrikler! ${currentLevel} bitti.\nSkor: ${score + (known ? 10 : 0)}\nYanlış Sayısı: ${mistakes.length + (known ? 0 : 1)}`);
        
        if (levelIndex + 1 < levels.length) {
          setLevelIndex(prev => prev + 1);
          setWordIndex(0);
          setMistakes([]); 
        }
      }
    }, 300);
  };

  if (!currentData) return <div style={s.container}>Tebrikler! Tüm seviyeler tamamlandı.</div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊" : "🔇"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤" : "🙊"}</button>
        </div>
      </div>

      <div style={s.metaInfo}>KALAN: {remaining} | YANLIŞLARIM: {mistakes.length}</div>

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
                <div style={s.exampleBox}><p>"{currentData.example}"</p></div>
                {isListening && <div style={s.listening}>DİNLİYORUM...</div>}
              </motion.div>
            ) : (
              <p style={s.tapHint}>TIKLA VE ÖĞREN</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden", padding: "10px 15px" },
  header: { width: "100%", padding: "8px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderRadius: "10px", marginTop: "5px" },
  stats: { fontSize: "12px", fontWeight: "bold", color: "#38bdf8" },
  metaInfo: { fontSize: "10px", color: "#94a3b8", marginTop: "5px" },
  toggleGroup: { display: "flex", gap: "8px" },
  toggle: (active) => ({ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: active ? "#334155" : "#7f1d1d", color: "white", cursor: "pointer" }),
  cardWrapper: { width: "100%", maxWidth: "340px", height: "55vh", position: "relative", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "300px", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", boxShadow: "0 15px 30px rgba(0,0,0,0.4)", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "70px", zIndex: 10, pointerEvents: "none", top: "15%" },
  word: { fontSize: "clamp(26px, 6vw, 36px)", letterSpacing: "2px", margin: "5px 0" },
  tapHint: { fontSize: "10px", color: "#38bdf8", opacity: 0.6, marginTop: "10px" },
  details: { width: "100%", marginTop: "5px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "15px", marginBottom: "5px" },
  definition: { color: "#94a3b8", fontSize: "12px", marginBottom: "8px", lineHeight: "1.3" },
  exampleBox: { background: "#0f172a", padding: "8px", borderRadius: "8px", fontSize: "11px", borderLeft: "3px solid #38bdf8", color: "#cbd5e1", textAlign: "left" },
  listening: { marginTop: "5px", color: "#fbbf24", fontWeight: "bold", fontSize: "10px" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "360px" },
  btn: (clr) => ({ flex: 1, padding: "12px", borderRadius: "10px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", fontSize: "12px" })
};

export default App;
