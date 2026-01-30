import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_3000 } from "./words"; // Yeni dosyadan veriyi çekiyoruz

export default function OxfordApp() {
  const [level, setLevel] = useState("A1-A2");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ learned: [], struggle: [] });
  const [showReport, setShowReport] = useState(false);

  const words = OXFORD_3000[level];
  const word = words[index];

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const handleAction = (isLearned) => {
    setResults(prev => ({
      learned: isLearned ? [...prev.learned, word] : prev.learned,
      struggle: !isLearned ? [...prev.struggle, word] : prev.struggle
    }));
    setFlipped(false);
    if (index < words.length - 1) setIndex(i => i + 1);
    else setShowReport(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        {Object.keys(OXFORD_3000).map(lvl => (
          <button key={lvl} onClick={() => {setLevel(lvl); setIndex(0);}} style={{...styles.lvlBtn, border: level === lvl ? "2px solid white" : "none"}}>{lvl}</button>
        ))}
      </div>

      <div style={styles.progress}>Kalan: {words.length - index}</div>

      <AnimatePresence mode="wait">
        <motion.div key={level + index} initial={{rotateY: 90}} animate={{rotateY: 0}} exit={{rotateY: -90}} style={styles.card} onClick={() => {setFlipped(!flipped); if(!flipped) speak(word.eng);}}>
          {!flipped ? (
            <h1 style={styles.wordMain}>{word.eng}</h1>
          ) : (
            <div>
              <h2 style={styles.wordTr}>{word.tr}</h2>
              <p style={styles.wordEx}>{word.ex}</p>
              <button style={styles.speakBtn} onClick={(e) => {e.stopPropagation(); speak(word.eng);}}>🔊 Dinle</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.actions}>
        <button style={{...styles.actionBtn, background: "#ff7675"}} onClick={() => handleAction(false)}>Zor ✕</button>
        <button style={{...styles.actionBtn, background: "#55efc4"}} onClick={() => handleAction(true)}>Biliyorum ✓</button>
      </div>

      {showReport && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Sonuçlar 📊</h3>
            <div style={styles.list}>
              <p style={{color: "green"}}>Öğrenilen: {results.learned.length}</p>
              <p style={{color: "red"}}>Tekrar: {results.struggle.length}</p>
            </div>
            <button style={styles.closeBtn} onClick={() => {setShowReport(false); setIndex(0);}}>Yeniden Başla</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "#4834d4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "white" },
  topBar: { display: "flex", gap: "10px", marginBottom: "20px" },
  lvlBtn: { background: "rgba(255,255,255,0.2)", color: "white", padding: "8px 15px", borderRadius: "10px", border: "none" },
  card: { width: "300px", height: "400px", background: "white", borderRadius: "25px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px", color: "#2d3436", cursor: "pointer", boxShadow: "0 10px 30px rgba(0,0,0,0.3)" },
  wordMain: { fontSize: "40px" },
  wordTr: { color: "#4834d4", fontSize: "28px" },
  wordEx: { fontStyle: "italic", marginTop: "15px", color: "#636e72" },
  actions: { marginTop: "30px", display: "flex", gap: "20px" },
  actionBtn: { width: "80px", height: "80px", borderRadius: "50%", border: "none", color: "white", fontSize: "20px", fontWeight: "bold" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "white", color: "#2d3436", padding: "30px", borderRadius: "20px", width: "80%" },
  closeBtn: { width: "100%", padding: "10px", background: "#4834d4", color: "white", border: "none", borderRadius: "10px", marginTop: "10px" }
};
