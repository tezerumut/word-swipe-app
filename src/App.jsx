import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]); 
  const [knownWordsInLevel, setKnownWordsInLevel] = useState(0); // Bu seviyede kaç tane "Biliyorum" dendi?
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
      setKnownWordsInLevel(prev => prev + 1);
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
      
      // KURAL: Eğer bu seviyedeki tüm kelimeleri "Biliyorum" demediysen seviye bitemez!
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else {
        // Liste sonuna geldik, kontrol et: Hepsi bilindi mi?
        if (knownWordsInLevel + (known ? 1 : 0) === levelWords.length) {
          if (levelIndex + 1 < levels.length) {
            alert(`Tebrikler! ${currentLevel} bitti. Tüm kelimeleri öğrendin, bir sonraki seviyeye geçiyorsun.`);
            setLevelIndex(prev => prev + 1);
            setWordIndex(0);
            setKnownWordsInLevel(0);
          } else {
            alert("Muhteşem! Oxford listesinin tamamını (A1-C2) bitirdin!");
          }
        } else {
          // Eksik var, listeyi başa sar (sadece bilinmeyenler için döngü devam eder)
          alert(`Bu seviyeyi bitirmek için tüm kelimeleri 'Biliyorum' tarafına atmalısın. Başa dönülüyor...`);
          setWordIndex(0);
          // Burada bilinen kelimeleri istersen listeden çıkartacak bir filtre de ekleyebiliriz.
        }
      }
    }, 300);
  };

  if (!currentData) return <div style={s.container}>Yükleniyor...</div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.stats}>{currentLevel} • {score} XP</div>
        <div style={s.levelProgress}>Tamamlanan: {knownWordsInLevel} / {levelWords.length}</div>
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
            {isCorrectSpeech && <motion.div initial={{ scale: 0 }} animate={{ scale: 1.2 }} style={s.successBadge}>✔</motion.div>}
            <h1 style={s.word}>{currentData.word}</h1>
            {showDetails && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={s.details}>
                <div style={s.meaning}>{currentData.meaning.toUpperCase()}</div>
                <p style={s.definition}>{currentData.hint}</p>
              </motion.div>
            )}
            {!showDetails && <p style={s.tapHint}>TIKLA VE KONUŞ</p>}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Çalışma Listesi Modalı */}
      <AnimatePresence>
        {showMistakeList && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={s.modalOverlay}>
            <div style={s.modalContent}>
              <div style={s.modalHeader}>
                <h3>Bilemediğim Kelimeler</h3>
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
  levelProgress: { fontSize: "12px", color: "#94a3b8" },
  mistakeBtn: { marginTop: "10px", background: "transparent", color: "#fbbf24", border: "1px solid #fbbf24", padding: "8px 15px", borderRadius: "20px", fontSize: "11px", fontWeight: "bold" },
  cardWrapper: { width: "100%", maxWidth: "340px", height: "50vh", display: "flex", alignItems: "center" },
  card: { width: "100%", minHeight: "280px", background: "#1e293b", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", border: "1px solid #334155", textAlign: "center", position: "relative" },
  successBadge: { position: "absolute", color: "#22c55e", fontSize: "80px", top: "15%" },
  word: { fontSize: "32px", letterSpacing: "2px" },
  tapHint: { fontSize: "10px", color: "#38bdf8", opacity: 0.6 },
  details: { marginTop: "10px" },
  meaning: { color: "#22c55e", fontWeight: "bold" },
  definition: { color: "#94a3b8", fontSize: "12px", marginTop: "5px" },
  modalOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" },
  modalContent: { background: "#1e293b", width: "100%", borderRadius: "15px", padding: "20px", maxHeight: "80vh", display: "flex", flexDirection: "column" },
  modalHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #334155", paddingBottom: "10px" },
  closeBtn: { background: "none", border: "none", color: "#ef4444", fontSize: "20px" },
  scrollArea: { overflowY: "auto", flex: 1 },
  mistakeItem: { padding: "10px", borderBottom: "1px solid #0f172a", textAlign: "left" },
  footer: { display: "flex", gap: "10px", marginBottom: "20px", width: "100%", maxWidth: "340px" },
  btn: (clr) => ({ flex: 1, padding: "14px", borderRadius: "10px", border: `2px solid ${clr}`, color: clr, background: "transparent", fontWeight: "bold" })
};

export default App;
