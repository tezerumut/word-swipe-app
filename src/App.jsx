import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Kelimeleri doğrudan buraya koyuyoruz ki Apple cihazlarda dosya yolu hatası vermesin
const OXFORD_DATA = {
  "A1-A2 (Başlangıç)": [
    { eng: "Ability", tr: "Yetenek", ex: "She has the ability to pass the exam." },
    { eng: "Abandon", tr: "Terk etmek", ex: "Never abandon your dreams." },
    { eng: "Absolute", tr: "Kesin, tam", ex: "It is the absolute truth." },
    { eng: "Academic", tr: "Akademik", ex: "He has a successful academic career." },
    { eng: "Accept", tr: "Kabul etmek", ex: "I accept your invitation." },
    { eng: "Accompany", tr: "Eşlik etmek", ex: "May I accompany you?" },
    { eng: "Account", tr: "Hesap", ex: "I need to open a bank account." },
    { eng: "Accurate", tr: "Doğru, kesin", ex: "This map is very accurate." },
    { eng: "Achieve", tr: "Başarmak", ex: "You can achieve anything." },
    { eng: "Acknowledge", tr: "Kabul etmek", ex: "He acknowledged his mistake." },
    { eng: "Across", tr: "Karşıdan karşıya", ex: "The cat ran across the street." },
    { eng: "Act", tr: "Hareket etmek", ex: "You must act quickly." },
    { eng: "Active", tr: "Aktif", ex: "She is very active in sports." },
    { eng: "Actual", tr: "Gerçek", ex: "The actual cost was higher." },
    { eng: "Adapt", tr: "Uyum sağlamak", ex: "It's hard to adapt to a new city." },
    { eng: "Add", tr: "Eklemek", ex: "Add some salt to the soup." },
    { eng: "Address", tr: "Adres", ex: "What is your home address?" },
    { eng: "Adjust", tr: "Ayarlamak", ex: "Adjust the seat height." },
    { eng: "Admire", tr: "Hayran olmak", ex: "I admire your courage." },
    { eng: "Admit", tr: "Kabul etmek", ex: "He admitted he was wrong." }
  ],
  "B1-B2 (Orta)": [
    { eng: "Bargain", tr: "Pazarlık / Kelepir", ex: "This house is a real bargain." },
    { eng: "Calculate", tr: "Hesaplamak", ex: "We need to calculate the cost." },
    { eng: "Capacity", tr: "Kapasite", ex: "The hall has a large capacity." }
  ]
};

export default function OxfordApp() {
  const [level, setLevel] = useState("A1-A2 (Başlangıç)");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ learned: [], struggle: [] });
  const [showReport, setShowReport] = useState(false);

  const words = OXFORD_DATA[level];
  const word = words[index];

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    }
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
        {Object.keys(OXFORD_DATA).map(lvl => (
          <button key={lvl} onClick={() => {setLevel(lvl); setIndex(0); setResults({learned:[], struggle:[]});}} style={{...styles.lvlBtn, border: level === lvl ? "2px solid white" : "none"}}>{lvl.split(' ')[0]}</button>
        ))}
      </div>

      <div style={styles.progress}>Kalan: {words.length - index}</div>

      <AnimatePresence mode="wait">
        <motion.div key={level + index} initial={{x: 50, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -50, opacity: 0}} style={styles.card} onClick={() => {setFlipped(!flipped); if(!flipped) speak(word.eng);}}>
          {!flipped ? (
            <h1 style={styles.wordMain}>{word.eng}</h1>
          ) : (
            <div>
              <h2 style={styles.wordTr}>{word.tr}</h2>
              <p style={styles.wordEx}>"{word.ex}"</p>
              <button style={styles.speakBtn} onClick={(e) => {e.stopPropagation(); speak(word.eng);}}>🔊 Dinle</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.actions}>
        <button style={{...styles.actionBtn, background: "#ff7675"}} onClick={() => handleAction(false)}>✕</button>
        <button style={{...styles.actionBtn, background: "#55efc4"}} onClick={() => handleAction(true)}>✓</button>
      </div>

      {showReport && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{margin: 0}}>Öğrenme Raporu 📊</h3>
            <div style={styles.list}>
              <p style={{color: "green", fontWeight: "bold"}}>Biliyorum: {results.learned.length}</p>
              <p style={{color: "red", fontWeight: "bold"}}>Çalışmalıyım: {results.struggle.length}</p>
            </div>
            <button style={styles.closeBtn} onClick={() => {setShowReport(false); setIndex(0); setResults({learned:[], struggle:[]});}}>Baştan Başla</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif", color: "white", padding: "20px", overflow: "hidden" },
  topBar: { display: "flex", gap: "10px", marginBottom: "20px" },
  lvlBtn: { background: "rgba(255,255,255,0.2)", color: "white", padding: "8px 15px", borderRadius: "15px", border: "none", fontWeight: "bold" },
  progress: { marginBottom: "15px", opacity: 0.8 },
  card: { width: "100%", maxWidth: "320px", height: "400px", background: "white", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "25px", color: "#2d3436", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" },
  wordMain: { fontSize: "42px", fontWeight: "bold" },
  wordTr: { color: "#764ba2", fontSize: "32px", fontWeight: "bold" },
  wordEx: { fontStyle: "italic", marginTop: "20px", color: "#636e72", fontSize: "18px" },
  speakBtn: { marginTop: "25px", padding: "10px 20px", background: "#f1f2f6", border: "none", borderRadius: "20px", color: "#764ba2", fontWeight: "bold" },
  actions: { marginTop: "40px", display: "flex", gap: "30px" },
  actionBtn: { width: "75px", height: "75px", borderRadius: "50%", border: "none", color: "white", fontSize: "24px", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" },
  overlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modal: { background: "white", color: "#2d3436", padding: "30px", borderRadius: "25px", width: "85%", textAlign: "center" },
  list: { margin: "20px 0" },
  closeBtn: { width: "100%", padding: "15px", background: "#764ba2", color: "white", border: "none", borderRadius: "15px", fontWeight: "bold" }
};
