import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// BURASI KELİME DEPOSU - Burayı istediğin kadar uzatabilirsin
const MASTER_DATA = {
  "A1-A2 (Başlangıç)": [
    { eng: "Ability", tr: "Yetenek", ex: "She has the ability to pass." },
    { eng: "Accept", tr: "Kabul etmek", ex: "I accept your offer." },
    { eng: "Achieve", tr: "Başarmak", ex: "You can achieve anything." },
    { eng: "Almost", tr: "Neredeyse", ex: "I am almost there." },
    { eng: "Believe", tr: "İnanmak", ex: "Believe in yourself." },
    { eng: "Common", tr: "Yaygın", ex: "It is a common mistake." },
    { eng: "Decide", tr: "Karar vermek", ex: "Decide your future." },
    { eng: "Enough", tr: "Yeterli", ex: "That is enough for today." },
    { eng: "Follow", tr: "Takip etmek", ex: "Follow the rules." },
    { eng: "Happen", tr: "Olmak/Meydana gelmek", ex: "What happened?" }
  ],
  "B1-B2 (Orta)": [
    { eng: "Accurate", tr: "Doğru/Kesin", ex: "Is it accurate?" },
    { eng: "Benefit", tr: "Fayda", ex: "It has many benefits." },
    { eng: "Challenge", tr: "Zorluk", ex: "Life is a challenge." },
    { eng: "Describe", tr: "Tanımlamak", ex: "Describe the person." },
    { eng: "Efficient", tr: "Verimli", ex: "Work in an efficient way." }
  ],
  "C1-C2 (İleri)": [
    { eng: "Ambiguous", tr: "Belirsiz", ex: "The answer was ambiguous." },
    { eng: "Elaborate", tr: "Detaylandırmak", ex: "Please elaborate." },
    { eng: "Flawless", tr: "Kusursuz", ex: "Your work is flawless." }
  ]
};

export default function KidsWordApp() {
  const [level, setLevel] = useState("A1-A2 (Başlangıç)");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ learned: [], struggle: [] });
  const [showReport, setShowReport] = useState(false);

  const words = MASTER_DATA[level];
  const word = words[index];

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const handleAction = (isLearned) => {
    const currentWord = words[index];
    setResults(prev => ({
      learned: isLearned ? [...prev.learned, currentWord] : prev.learned,
      struggle: !isLearned ? [...prev.struggle, currentWord] : prev.struggle
    }));
    setFlipped(false);
    if (index < words.length - 1) setIndex(i => i + 1);
    else setShowReport(true);
  };

  return (
    <div style={styles.container}>
      <div style={styles.navScroll}>
        {Object.keys(MASTER_DATA).map(l => (
          <button key={l} onClick={() => {setLevel(l); setIndex(0); setResults({learned:[], struggle:[]});}} style={{...styles.navBtn, backgroundColor: level === l ? "#fff" : "rgba(255,255,255,0.3)", color: level === l ? "#6c5ce7" : "#fff"}}>{l}</button>
        ))}
      </div>

      <div style={styles.cardArea}>
        <AnimatePresence mode="wait">
          <motion.div key={level + index} initial={{x: 100, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -100, opacity: 0}} style={styles.card} onClick={() => {setFlipped(!flipped); if(!flipped) speak(word.eng);}}>
            {!flipped ? (
              <div>
                <h1 style={styles.wordText}>{word.eng}</h1>
                <p style={styles.hint}>Türkçesi için dokun 👆</p>
              </div>
            ) : (
              <div>
                <h2 style={styles.trText}>{word.tr}</h2>
                <p style={styles.exText}>"{word.ex}"</p>
                <button style={styles.audioBtn} onClick={(e) => {e.stopPropagation(); speak(word.eng);}}>🔊 Dinle</button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={styles.btnGroup}>
        <button style={{...styles.actionBtn, background: "#ff7675"}} onClick={() => handleAction(false)}>Zor ✕</button>
        <button style={{...styles.actionBtn, background: "#55efc4"}} onClick={() => handleAction(true)}>Biliyorum ✓</button>
      </div>

      {showReport && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{color: "#2d3436"}}>Günün Özeti 🌟</h2>
            <div style={styles.scroll}>
              <h4 style={{color: "#10ac84"}}>✅ Öğrendiklerin ({results.learned.length})</h4>
              {results.learned.map((w, i) => <p key={i} style={styles.item}>{w.eng}: {w.tr}</p>)}
              <h4 style={{color: "#ee5253", marginTop: "15px"}}>❌ Tekrar Etmelisin ({results.struggle.length})</h4>
              {results.struggle.map((w, i) => <p key={i} style={styles.item}>{w.eng}: {w.tr}</p>)}
            </div>
            <button style={styles.closeBtn} onClick={() => setShowReport(false)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "linear-gradient(to bottom, #6c5ce7, #a29bfe)", display: "flex", flexDirection: "column", alignItems: "center", padding: "15px", fontFamily: "sans-serif", overflow: "hidden" },
  navScroll: { display: "flex", gap: "10px", width: "100%", overflowX: "auto", padding: "10px 0" },
  navBtn: { border: "none", padding: "8px 15px", borderRadius: "20px", fontWeight: "bold", whiteSpace: "nowrap", cursor: "pointer" },
  cardArea: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center" },
  card: { width: "320px", height: "450px", background: "white", borderRadius: "35px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" },
  wordText: { fontSize: "45px", color: "#2d3436", margin: 0 },
  hint: { color: "#b2bec3", marginTop: "20px" },
  trText: { fontSize: "35px", color: "#6c5ce7", fontWeight: "bold" },
  exText: { marginTop: "20px", color: "#636e72", fontStyle: "italic", fontSize: "18px" },
  audioBtn: { marginTop: "25px", padding: "12px 25px", borderRadius: "25px", border: "1px solid #6c5ce7", background: "none", color: "#6c5ce7", fontWeight: "bold" },
  btnGroup: { display: "flex", gap: "25px", marginBottom: "30px" },
  actionBtn: { width: "100px", height: "100px", borderRadius: "50%", border: "none", color: "white", fontWeight: "bold", fontSize: "20px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { background: "white", padding: "30px", borderRadius: "30px", width: "90%", maxHeight: "80%" },
  scroll: { overflowY: "auto", maxHeight: "400px", textAlign: "left" },
  item: { color: "#2d3436", borderBottom: "1px solid #eee", padding: "8px 0" },
  closeBtn: { width: "100%", padding: "15px", marginTop: "20px", borderRadius: "20px", border: "none", background: "#6c5ce7", color: "white", fontWeight: "bold" }
};
