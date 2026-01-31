import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]); // Bilinmeyen kelimelerin tam listesi
  const [showMistakeList, setShowMistakeList] = useState(false); // Liste görünürlüğü
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

  const handleManualAction = (known) => {
    if (known) {
      setScore(prev => prev + 10);
    } else {
      // Kelimeyi ve anlamını "Çalışma Listesi"ne ekle (Eğer zaten yoksa)
      if (!mistakes.find(m => m.word === currentData.word)) {
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
        alert(`${currentLevel} Bitti! Bilmediğin ${mistakes.length} kelime birikti.`);
        setLevelIndex(prev => prev + 1);
        setWordIndex(0);
      }
    }, 300);
  };

  if (!currentData) return <div style={s.container}>Yükleniyor...</div>;

  return (
    <div style={s.container}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.toggleGroup}>
          <button onClick={() => setCanHear(!canHear)} style={s.toggle(canHear)}>{canHear ? "🔊" : "🔇"}</button>
          <button onClick={() => setCanSpeak(!canSpeak)} style={s.toggle(canSpeak)}>{canSpeak ? "🎤" : "🙊"}</button>
        </div>
      </div>

      {/* Hata Listesi Butonu */}
      <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>
        📖 ÇALIŞMA LİSTEM ({mistakes.length})
      </button>

      {/* Kart Alanı */}
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
            onClick={() => { setShowDetails(true); speakWord(currentData.word); }}
          >
            <h1 style={s.word}>{currentData.word}</h1>
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Yanlış Kelimeler Modalı (Açılır Liste) */}
      <AnimatePresence>
        {showMistakeList && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={s.modalContent}>
              <div style={s.modalHeader}>
                <h3>Çalışılacak Kelimeler</h3>
                <button onClick={() => setShowMistakeList(false)} style={s.closeBtn}>✕</button>
              </div>
              <div style={s.scrollArea}>
                {mistakes.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#94a3b8" }}>Henüz kelime eklenmedi.</p>
                ) : (
                  mistakes.map((m, i) => (
                    <div key={i} style={s.mistakeItem}>
                      <span style={{ fontWeight: "bold" }}>{m.word}</span>
                      <span style={{ color: "#22c55e" }}>{m.meaning}</span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>
    </div>
  );
};

const s = {
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif", color: "#f8fafc", overflow: "hidden", padding: "10px 15px" },
  header: { width: "100%", padding: "8px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#1e293b", borderRadius: "10px" },
  stats: { fontSize: "12px", fontWeight: "bold", color: "#38bdf8" },
  toggleGroup: { display: "flex", gap: "8px" },
  toggle: (active) => ({ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: active ? "#334155" : "#7f1d1d", cursor: "pointer" }),
  mistakeBtn: { marginTop: "10px", background: "#334155", color: "#38bdf8", border: "1px solid #38bdf8", padding: "8px 15px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold", cursor: "pointer" },
  cardWrapper: { width: "100%", maxWidth: "340px", height: "50vh", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "280px", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", position: "relative" },
  word: { fontSize: "clamp(24px, 6vw, 34px)", letterSpacing: "2px" },
  details: { marginTop: "10px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "15px" },
  definition: { color: "#94a3b8", fontSize: "12px", marginTop: "5px" },
  modalOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" },
  modalContent: { background: "#1e293b", width: "100%", maxWidth: "320px", borderRadius: "15px", padding: "20px", maxHeight: "80vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #334155", paddingBottom: "10px", marginBottom: "10px" },
  closeBtn: { background: "none", border: "none", color: "#ef4444", fontSize: "18px", cursor: "pointer" },
  scrollArea: { overflowY: "auto", flex: 1 },
  mistakeItem: { display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #0f172a", fontSize: "14px" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "340px" },
  btn: (clr) => ({ flex: 1, padding: "12px", borderRadius: "10px", border: `2px solid ${clr}`, background: "transparent", color: clr, fontWeight: "bold", fontSize: "12px" })
};

export default App;
