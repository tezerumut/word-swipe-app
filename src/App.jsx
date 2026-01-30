import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KELIMELER = [
  { id: 1, eng: "Opportunity", tr: "Fırsat", ph: "/ˌɒp.əˈtjuː.nə.ti/" },
  { id: 2, eng: "Success", tr: "Başarı", ph: "/səkˈses/" },
  { id: 3, eng: "Constant", tr: "Sürekli", ph: "/ˈkɒn.stənt/" },
  { id: 4, eng: "Improve", tr: "Geliştirmek", ph: "/ɪmˈpruːv/" },
  { id: 5, eng: "Challenge", tr: "Zorluk/Mücadele", ph: "/ˈtʃæl.ɪndʒ/" }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showTr, setShowTr] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  const speak = (text) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = (learned) => {
    if (learned) setLearnedCount(prev => prev + 1);
    setShowTr(false);
    if (index < KELIMELER.length - 1) {
      setIndex(prev => prev + 1);
    } else {
      alert(`Harika! ${KELIMELER.length} kelimeyi tamamladın.`);
      setIndex(0);
      setLearnedCount(0);
    }
  };

  const currentWord = KELIMELER[index];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.progress}>Öğrenilen: {learnedCount} / {KELIMELER.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          style={styles.card}
          onClick={() => {
            setShowTr(!showTr);
            if (!showTr) speak(currentWord.eng);
          }}
        >
          <div style={styles.wordEng}>{currentWord.eng}</div>
          <div style={styles.ph}>{currentWord.ph}</div>
          
          {showTr && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={styles.wordTr}
            >
              {currentWord.tr}
            </motion.div>
          )}
          
          <div style={styles.hint}>Kartı çevirmek için dokun</div>
        </motion.div>
      </AnimatePresence>

      <div style={styles.buttonContainer}>
        <button 
          style={{...styles.button, backgroundColor: "#ff4b2b"}} 
          onClick={() => handleNext(false)}
        >
          Tekrar Et ✕
        </button>
        <button 
          style={{...styles.button, backgroundColor: "#2ecc71"}} 
          onClick={() => handleNext(true)}
        >
          Öğrendim ✓
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "sans-serif",
    padding: "20px",
    touchAction: "none"
  },
  header: { marginBottom: "30px", fontSize: "18px", fontWeight: "bold", color: "#333" },
  card: {
    width: "300px",
    height: "450px",
    backgroundColor: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: "20px",
    textAlign: "center",
    position: "relative"
  },
  wordEng: { fontSize: "36px", fontWeight: "bold", color: "#2c3e50" },
  ph: { fontSize: "16px", color: "#7f8c8d", marginTop: "10px" },
  wordTr: { fontSize: "28px", color: "#e67e22", marginTop: "30px", fontWeight: "500" },
  hint: { position: "absolute", bottom: "30px", fontSize: "12px", color: "#bdc3c7" },
  buttonContainer: { display: "flex", gap: "20px", marginTop: "40px" },
  button: {
    padding: "15px 30px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
  }
};
