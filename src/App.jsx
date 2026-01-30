import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WORD_LAYERS = {
  stage1: [
    { id: 1, eng: "Abandon", tr: "Terk etmek", sentence: "Never abandon your dreams." },
    { id: 2, eng: "Ability", tr: "Yetenek", sentence: "She has the ability to speak five languages." },
    { id: 3, eng: "Accurate", tr: "Doğru, kesin", sentence: "The report was accurate and detailed." },
    { id: 4, eng: "Beneficial", tr: "Faydalı", sentence: "Regular exercise is beneficial for everyone." },
    { id: 5, eng: "Candidate", tr: "Aday", sentence: "He is a strong candidate for the job." },
    { id: 6, eng: "Determine", tr: "Belirlemek", sentence: "Your actions determine your future." },
    { id: 7, eng: "Evidence", tr: "Kanıt", sentence: "There is no evidence to support this claim." },
    { id: 8, eng: "Flexible", tr: "Esnek", sentence: "Working hours are very flexible here." },
    { id: 9, eng: "Genuine", tr: "Gerçek, samimi", sentence: "She showed genuine interest in our project." },
    { id: 10, eng: "Halt", tr: "Durdurmak", sentence: "Production came to a sudden halt." }
  ]
};

export default function WordMarathon() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);
  const words = WORD_LAYERS.stage1;
  const word = words[index];

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const handleNext = (isLearned) => {
    if (isLearned) setLearnedCount(c => c + 1);
    setFlipped(false);
    setTimeout(() => {
      if (index < words.length - 1) setIndex(i => i + 1);
      else alert("Harika! İlk 10 kelimeyi devirdin. Hedef: 1000!");
    }, 300);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🚀 1000 Word Challenge</h1>
        <div style={styles.progressContainer}>
          <div style={{...styles.progressFill, width: `${(learnedCount/words.length)*100}%`}}></div>
        </div>
        <p style={styles.stats}>Başarı: %{Math.round((learnedCount/words.length)*100)}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          style={styles.card}
          onClick={() => { setFlipped(!flipped); if(!flipped) speak(word.eng); }}
        >
          {!flipped ? (
            <div style={styles.front}>
              <span style={styles.tapHint}>Öğrenmek için dokun</span>
              <h2 style={styles.mainWord}>{word.eng}</h2>
              <button style={styles.listenIcon}>🔊</button>
            </div>
          ) : (
            <div style={styles.back}>
              <h2 style={styles.trWord}>{word.tr}</h2>
              <div style={styles.divider}></div>
              <p style={styles.example}>{word.sentence}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.actions}>
        <button style={{...styles.btn, background: "#ee5253"}} onClick={() => handleNext(false)}>Tekrar Et</button>
        <button style={{...styles.btn, background: "#10ac84"}} onClick={() => handleNext(true)}>Öğrendim!</button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "sans-serif" },
  header: { width: "300px", textAlign: "center", marginBottom: "20px" },
  title: { fontSize: "22px", marginBottom: "15px" },
  progressContainer: { height: "8px", background: "rgba(255,255,255,0.2)", borderRadius: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#00d2d3", transition: "0.5s" },
  stats: { marginTop: "5px", fontSize: "14px", opacity: 0.8 },
  card: { width: "320px", height: "420px", background: "white", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2d3436", boxShadow: "0 20px 40px rgba(0,0,0,0.3)", padding: "40px", textAlign: "center", position: "relative" },
  front: { display: "flex", flexDirection: "column", alignItems: "center" },
  tapHint: { fontSize: "12px", color: "#b2bec3", marginBottom: "20px", textTransform: "uppercase" },
  mainWord: { fontSize: "42px", margin: "0" },
  listenIcon: { marginTop: "20px", background: "none", border: "none", fontSize: "24px" },
  back: { display: "flex", flexDirection: "column", alignItems: "center" },
  trWord: { fontSize: "32px", color: "#222f3e" },
  divider: { width: "50px", height: "4px", background: "#764ba2", margin: "20px 0" },
  example: { fontSize: "18px", fontStyle: "italic", color: "#576574" },
  actions: { marginTop: "30px", display: "flex", gap: "15px" },
  btn: { padding: "15px 30px", borderRadius: "50px", border: "none", color: "white", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }
};
