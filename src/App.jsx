import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]); 
  const [showMistakeList, setShowMistakeList] = useState(false);
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
    if (!canHear || !text) return;
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
      
      if (currentData && result.includes(currentData.word)) {
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
      if (currentData && !mistakes.find(m => m.word === currentData.word)) {
        setMistakes(prev => [...prev, { word: currentData.word, meaning: currentData.meaning }]);
      }
    }
    
    setDirection(known ? 1000 : -1000);

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      setIsCorrectSpeech(false);
      
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else if (levelIndex + 1 < levels.length) {
        // Sonraki seviyeye geç
        setLevelIndex(prev => prev + 1);
        setWordIndex(0);
      } else {
        // TÜM KELİMELER BİTTİ
        setWordIndex(wordIndex + 1); 
      }
    }, 300);
  };

  // KELİMELER BİTTİĞİNDE GÖRÜNECEK EKRAN
  if (!currentData) {
    return (
      <div style={s.container}>
        <div style={s.card}>
          <h2 style={{color: "#22c55e"}}>TEBRİKLER! 🎉</h2>
          <p>Tüm kelimeleri tamamladın.</p>
          <div style={s.stats}>TOPLAM SKOR: {score} XP</div>
          <button onClick={() => window.location.reload()} style={s.restartBtn}>YENİDEN BAŞLA</button>
          {mistakes.length > 0 && (
             <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>
                ÇALIŞMA LİSTEMİ GÖR ({mistakes.length})
             </button>
          )}
        </div>
        {/* Modal burada da çalışmalı */}
        <AnimatePresence>
          {showMistakeList && <MistakeModal mistakes={mistakes} onClose={() => setShowMistakeList(false)} />}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊" : "🔇"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤" : "🙊"}</button>
        </div>
      </div>

      <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>
        📖 ÇALIŞMA LİSTEM ({mistakes.length})
      </button>

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
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
                {isListening && <div style={s.listening}>DİNLİYORUM...</div>}
              </motion.div>
            )}
            {!showDetails && <p style={s.tapHint}>TIKLA, DİNLE VE KONUŞ</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMistakeList && <MistakeModal mistakes={mistakes} onClose={() => setShowMistakeList(false)} />}
      </AnimatePresence>

      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>
    </div>
  );
};

// Alt Bileşen: Hata Listesi Modalı
const MistakeModal = ({ mistakes, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay}>
    <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={s.modalContent}>
      <div style={s.modalHeader}>
        <h3 style={{margin:0}}>Çalışılacak Kelimeler</h3>
        <button onClick={onClose} style={s.closeBtn}>✕</button>
      </div>
      <div style={s.scrollArea}>
        {mistakes.length === 0 ? <p style={{color:"#94a3b8", textAlign:"center"}}>Liste boş.</p> : 
          mistakes.map((m, i) => (
            <div key={i} style={s.mistakeItem}>
              <strong>{m.word}</strong>: {m.meaning}
            </div>
          ))
        }
      </div>
    </motion.div>
  </motion.div>
);

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden", padding: "10px" },
  header: { width: "100%", padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderRadius: "10px" },
  stats: { fontSize: "14px", fontWeight: "bold", color: "#38bdf8" },
  toggleGroup: { display: "flex", gap: "8px" },
  toggle: (active) => ({ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: active ? "#334155" : "#7f1d1d", color: "white" }),
  mistakeBtn: { marginTop: "10px", background: "transparent", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 15px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
  restartBtn: { marginTop: "20px", background: "#22c55e", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  cardWrapper: { width: "100%", maxWidth: "340px", height: "55vh", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "300px", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px", border: "1px solid #334155", textAlign: "center", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "80px", zIndex: 10, pointerEvents: "none", top: "15%" },
  word: { fontSize: "clamp(26px, 6vw, 36px)", letterSpacing: "2px" },
  tapHint: { fontSize: "10px", color: "#38bdf8", opacity: 0.6, marginTop: "10px" },
  details: { marginTop: "10px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "16px" },
  definition: { color: "#94a3b8", fontSize: "12px", marginTop: "5px" },
  listening: { marginTop: "8px", color: "#fbbf24", fontWeight: "bold", fontSize: "10px" },
  modalOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" },
  modalContent: { background: "#1e293b", width: "100%", borderRadius: "15px", padding: "20px", maxHeight: "70vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "10px", marginBottom: "10px" },
  closeBtn: { background: "none", border: "none", color: "#ef4444", fontSize: "20px" },
  scrollArea: { overflowY: "auto", flex: 1 },
  mistakeItem: { padding: "10px", borderBottom: "1px solid #0f172a", fontSize: "13px", textAlign: "left" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "340px" },
  btn: (clr) => ({ flex: 1, padding: "12px", borderRadius: "10px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold" })
};

export default App;
