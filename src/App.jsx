import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OXFORD_DATA = {
  "A1": [
    { eng: "Always", tr: "Her zaman", ex: "I always drink water." },
    { eng: "Become", tr: "Hale gelmek", ex: "It becomes cold in winter." },
    { eng: "Common", tr: "Yaygın", ex: "English is a common language." },
    { eng: "During", tr: "Boyunca/Esnasında", ex: "I slept during the film." },
    { eng: "Explain", tr: "Açıklamak", ex: "Can you explain this?" }
  ],
  "A2": [
    { eng: "Believe", tr: "İnanmak", ex: "I believe in you." },
    { eng: "Describe", tr: "Betimlemek", ex: "Describe your house." },
    { eng: "Future", tr: "Gelecek", ex: "What is your future plan?" }
  ],
  "B1-C2": [
    { eng: "Achieve", tr: "Başarmak", ex: "She achieved her goal." },
    { eng: "Ambiguous", tr: "Belirsiz", ex: "The law is ambiguous." }
  ]
};

export default function OxfordMarathon() {
  const [level, setLevel] = useState("A1");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ correct: [], wrong: [] });
  const [showReport, setShowReport] = useState(false);
  
  const currentWords = OXFORD_DATA[level];
  const word = currentWords[index];

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const handleNext = (isLearned) => {
    const currentWordData = { ...word, level };
    
    setResults(prev => ({
      correct: isLearned ? [...prev.correct, currentWordData] : prev.correct,
      wrong: !isLearned ? [...prev.wrong, currentWordData] : prev.wrong
    }));

    setFlipped(false);
    if (index < currentWords.length - 1) {
      setIndex(i => i + 1);
    } else {
      setShowReport(true); // Seviye bitince raporu otomatik aç
    }
  };

  return (
    <div style={styles.container}>
      {/* Rapor Modalı */}
      <AnimatePresence>
        {showReport && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={styles.modalOverlay}>
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} style={styles.modal}>
              <h2 style={{ color: "#2d3436" }}>📊 Öğrenme Raporu</h2>
              <div style={styles.reportScroll}>
                <h3 style={{ color: "#10ac84" }}>✅ Öğrenilenler ({results.correct.length})</h3>
                {results.correct.map((w, i) => <p key={i} style={styles.reportItem}>{w.eng}: {w.tr}</p>)}
                
                <h3 style={{ color: "#ee5253", marginTop: "20px" }}>❌ Tekrar Edilecekler ({results.wrong.length})</h3>
                {results.wrong.map((w, i) => <p key={i} style={styles.reportItem}>{w.eng}: {w.tr}</p>)}
              </div>
              <button style={styles.closeBtn} onClick={() => setShowReport(false)}>Kapat ve Devam Et</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={styles.levelBar}>
        {Object.keys(OXFORD_DATA).map(lvl => (
          <button key={lvl} onClick={() => { setLevel(lvl); setIndex(0); }} style={{...styles.levelBtn, backgroundColor: level === lvl ? "#fff" : "transparent", color: level === lvl ? "#764ba2" : "#fff"}}>{lvl}</button>
        ))}
      </div>

      <button style={styles.reportToggle} onClick={() => setShowReport(true)}>📊 Listeyi Gör</button>

      <div style={styles.header}>
        <h1 style={styles.title}>{level} Maratonu</h1>
        <p>İlerleme: {index + 1} / {currentWords.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={level + index} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} style={styles.card} onClick={() => { setFlipped(!flipped); if(!flipped) speak(word.eng); }}>
          {!flipped ? (
            <div style={styles.front}>
              <h2 style={styles.mainWord}>{word.eng}</h2>
              <span style={styles.hint}>Türkçesi için dokun</span>
            </div>
          ) : (
            <div style={styles.back}>
              <h2 style={styles.trWord}>{word.tr}</h2>
              <p style={styles.example}>{word.ex}</p>
              <button style={styles.speakBtn} onClick={(e) => { e.stopPropagation(); speak(word.eng); }}>🔊 Dinle</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.actions}>
        <button style={{...styles.btn, background: "#ff7675"}} onClick={() => handleNext(false)}>✕ Zorlandım</button>
        <button style={{...styles.btn, background: "#55efc4"}} onClick={() => handleNext(true)}>✓ Öğrendim</button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "sans-serif", position: "relative", overflow: "hidden" },
  levelBar: { display: "flex", gap: "10px", marginBottom: "20px", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "50px" },
  levelBtn: { border: "1px solid #fff", borderRadius: "20px", padding: "5px 15px", cursor: "pointer", fontWeight: "bold" },
  reportToggle: { position: "absolute", top: "20px", right: "20px", background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "10px 15px", borderRadius: "10px", cursor: "pointer" },
  header: { textAlign: "center", marginBottom: "20px" },
  title: { fontSize: "20px", margin: "0" },
  card: { width: "320px", height: "400px", background: "white", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2d3436", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", padding: "30px", textAlign: "center" },
  mainWord: { fontSize: "40px", margin: "0" },
  hint: { fontSize: "12px", color: "#b2bec3", marginTop: "20px" },
  trWord: { fontSize: "30px", color: "#764ba2" },
  example: { fontSize: "16px", color: "#636e72", marginTop: "20px", fontStyle: "italic" },
  speakBtn: { marginTop: "20px", background: "#f1f2f6", border: "none", padding: "10px 20px", borderRadius: "20px" },
  actions: { marginTop: "30px", display: "flex", gap: "20px" },
  btn: { padding: "15px 30px", borderRadius: "50px", border: "none", color: "#2d3436", fontWeight: "bold", fontSize: "16px", cursor: "pointer" },
  modalOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "white", padding: "30px", borderRadius: "20px", width: "85%", maxHeight: "80%", overflowY: "hidden", display: "flex", flexDirection: "column" },
  reportScroll: { overflowY: "auto", margin: "20px 0", textAlign: "left" },
  reportItem: { color: "#2d3436", borderBottom: "1px solid #eee", padding: "5px 0" },
  closeBtn: { background: "#764ba2", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" }
};
