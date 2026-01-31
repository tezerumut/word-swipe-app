import { db } from "./firebase";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]); 
  const [knownWordsInLevel, setKnownWordsInLevel] = useState(0); 
  const [showMistakeList, setShowMistakeList] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCorrectSpeech, setIsCorrectSpeech] = useState(false); 
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const levelWords = useMemo(() => VOCABULARY_DB[currentLevel] || [], [currentLevel]);
  const currentData = levelWords[wordIndex];

  const speakWord = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const listen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript.toUpperCase();
      setIsListening(false);
      if (currentData && result.includes(currentData.word.toUpperCase())) {
        setIsCorrectSpeech(true);
        setTimeout(() => setIsCorrectSpeech(false), 2000); 
      }
    };
    recognition.onerror = () => setIsListening(false);
  };

  const handleManualAction = (known) => {
    let currentKnownCount = knownWordsInLevel;
    if (known) {
      setScore(prev => prev + 10);
      currentKnownCount += 1;
      setKnownWordsInLevel(currentKnownCount);
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
      } else {
        // LİSTE SONU: KESİNLİKLE BURADA TAKILMAYACAK
        if (currentKnownCount === levelWords.length) {
          if (levelIndex + 1 < levels.length) {
            alert("Tebrikler! Seviyeyi %100 başarıyla tamamladın. Bir sonraki seviye yükleniyor...");
            setLevelIndex(prev => prev + 1);
            setWordIndex(0);
            setKnownWordsInLevel(0);
          } else {
            alert("Muhteşem! Tüm Oxford listesini bitirdin.");
          }
        } else {
          alert(`Tüm kelimeleri öğrenmedin (${currentKnownCount}/${levelWords.length}). Başa dönülüyor!`);
          setWordIndex(0);
          setKnownWordsInLevel(0);
        }
      }
    }, 300);
  };

  // EĞER KELİME YOKSA (HATA ÖNLEYİCİ)
  if (!currentData && levelWords.length > 0) {
     return <div style={s.container}>Yükleniyor...</div>;
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.levelProgress}>BİLİNEN: {knownWordsInLevel} / {levelWords.length}</div>
      </div>

      <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>📖 ÇALIŞMA LİSTEM ({mistakes.length})</button>

      <div style={s.cardWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData?.word || "end"}
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
            onClick={() => { setShowDetails(true); speakWord(currentData?.word); listen(); }}
          >
            {isCorrectSpeech && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} style={s.successBadge}>✔</motion.div>}
            <h1 style={s.word}>{currentData?.word}</h1>
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData?.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData?.hint}</p>
                {isListening && <div style={s.listening}>DİNLİYORUM...</div>}
              </motion.div>
            )}
            {!showDetails && <p style={s.tapHint}>TIKLA, DİNLE VE KONUŞ</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showMistakeList && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay}>
            <div style={s.modalContent}>
              <div style={s.modalHeader}>
                <h3 style={{margin:0}}>Çalışılacaklar</h3>
                <button onClick={() => setShowMistakeList(false)} style={s.closeBtn}>✕</button>
              </div>
              <div style={s.scrollArea}>
                {mistakes.map((m, i) => (
                  <div key={i} style={s.mistakeItem}><strong>{m.word}</strong>: {m.meaning}</div>
                ))}
              </div>
            </div>
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
  container: { height: "100vh", backgroundColor: "#0f172a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", fontFamily: "Inter, sans-serif", color: "#f8fafc", padding: "10px", overflow: "hidden" },
  header: { width: "100%", padding: "10px", display: "flex", justifyContent: "space-between", background: "#1e293b", borderRadius: "10px" },
  stats: { fontSize: "14px", fontWeight: "bold", color: "#38bdf8" },
  levelProgress: { fontSize: "11px", color: "#94a3b8", alignSelf: "center" },
  mistakeBtn: { marginTop: "10px", background: "transparent", color: "#fbbf24", border: "1px solid #fbbf24", padding: "6px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: "bold" },
  cardWrapper: { width: "100%", maxWidth: "340px", height: "55vh", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "300px", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "80px", zIndex: 10, pointerEvents: "none", top: "15%" },
  word: { fontSize: "clamp(26px, 6vw, 36px)", letterSpacing: "2px" },
  tapHint: { fontSize: "10px", color: "#38bdf8", opacity: 0.6, marginTop: "10px" },
  details: { marginTop: "10px" },
  meaning: { color: "#22c55e", fontWeight: "bold", fontSize: "16px" },
  definition: { color: "#94a3b8", fontSize: "12px", marginTop: "5px" },
  listening: { marginTop: "8px", color: "#fbbf24", fontSize: "10px", fontWeight: "bold" },
  modalOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalContent: { background: "#1e293b", width: "100%", borderRadius: "15px", padding: "20px", maxHeight: "70vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "10px", marginBottom: "10px" },
  closeBtn: { background: "none", border: "none", color: "#ef4444", fontSize: "20px" },
  scrollArea: { overflowY: "auto", flex: 1 },
  mistakeItem: { padding: "10px", borderBottom: "1px solid #0f172a", textAlign: "left", fontSize: "14px" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "340px" },
  btn: (clr) => ({ flex: 1, padding: "14px", borderRadius: "10px", border: `2px solid ${clr}`, color: clr, background: "transparent", fontWeight: "bold" })
};

export default App;
