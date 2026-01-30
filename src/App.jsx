import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD_LAYERS = {
  stage1: [
    { id: 1, eng: "Frequent", tr: "Sık rastlanan", sentence: "Frequent exercise is good for health." },
    { id: 2, eng: "Essential", tr: "Temel, zorunlu", sentence: "Water is essential for life." },
    { id: 3, eng: "Achieve", tr: "Başarmak", sentence: "You can achieve your goals." },
    { id: 4, eng: "Convey", tr: "İletmek", sentence: "Please convey my message to him." },
    { id: 5, eng: "Resilient", tr: "Dayanıklı", sentence: "She is a resilient person." }
  ],
  // Buraya zamanla 1000, 3000 ve 5000 kelime gruplarını ekleyeceğiz
};

export default function WordMastery() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const currentWords = WORD_LAYERS.stage1;
  const word = currentWords[index];

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (flipped) speak(word.eng);
  }, [flipped]);

  const handleNext = (isLearned) => {
    if (isLearned) setLearnedCount(c => c + 1);
    setFlipped(false);
    setTimeout(() => {
      if (index < currentWords.length - 1) setIndex(i => i + 1);
      else alert("Tebrikler! İlk seviyeyi tamamladın. Sırada 3000 kelime hedefi var!");
    }, 200);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Word Marathon: Stage 1</h2>
        <div style={styles.progressBar}>
          <div style={{...styles.progressFill, width: `${(learnedCount/currentWords.length)*100}%`}}></div>
        </div>
        <p>İlerleme: {learnedCount} / {currentWords.length}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ rotateY: 90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: -90, opacity: 0 }}
          style={styles.card}
          onClick={() => setFlipped(!flipped)}
        >
          {!flipped ? (
            <div style={styles.cardFront}>?</div>
          ) : (
            <div style={styles.cardBack}>
              <h1 style={styles.wordEng}>{word.eng}</h1>
              <h3 style={styles.wordTr}>{word.tr}</h3>
              <p style={styles.sentence}>"{word.sentence}"</p>
              <button onClick={(e) => { e.stopPropagation(); speak(word.eng); }} style={styles.audioBtn}>🔊 Tekrar Dinle</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.btnGroup}>
        <button style={{...styles.btn, backgroundColor: "#ff4b2b"}} onClick={() => handleNext(false)}>Zorlandım ✕</button>
        <button style={{...styles.btn, backgroundColor: "#2ecc71"}} onClick={() => handleNext(true)}>Öğrendim ✓</button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8f9fa", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { textAlign: "center", marginBottom: "30px", width: "80%" },
  title: { color: "#2c3e50", margin: "10px 0" },
  progressBar: { width: "100%", height: "10px", background: "#dfe6e9", borderRadius: "5px", overflow: "hidden", margin: "10px 0" },
  progressFill: { height: "100%", background: "#3498db", transition: "width 0.3s ease" },
  card: { width: "320px", height: "450px", background: "white", borderRadius: "25px", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: "30px", position: "relative" },
  cardFront: { fontSize: "80px", color: "#3498db", fontWeight: "bold" },
  cardBack: { textAlign: "center" },
  wordEng: { fontSize: "38px", color: "#2c3e50", margin: "0" },
  wordTr: { fontSize: "22px", color: "#e67e22", margin: "10px 0" },
  sentence: { fontSize: "16px", color: "#7f8c8d", fontStyle: "italic", marginTop: "20px" },
  audioBtn: { marginTop: "20px", padding: "8px 15px", borderRadius: "20px", border: "1px solid #3498db", background: "none", color: "#3498db", cursor: "pointer" },
  btnGroup: { display: "flex", gap: "20px", marginTop: "40px" },
  btn: { padding: "15px 35px", borderRadius: "30px", border: "none", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }
};
