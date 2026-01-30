import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Oxford 3000/5000 Bazlı Genişletilmiş Kelime Bankası
const OXFORD_DATA = {
  "A1-A2": [
    { eng: "Ability", tr: "Yetenek", ex: "She has the ability to pass the exam." },
    { eng: "Accept", tr: "Kabul etmek", ex: "I accept your invitation." },
    { eng: "Accident", tr: "Kaza", ex: "It was a car accident." },
    { eng: "Achieve", tr: "Başarmak", ex: "He achieved his goal." },
    { eng: "Address", tr: "Adres", ex: "What is your home address?" },
    { eng: "Admire", tr: "Hayran olmak", ex: "I admire your courage." },
    { eng: "Advice", tr: "Tavsiye", ex: "Let me give you some advice." },
    { eng: "Afford", tr: "Maddi gücü yetmek", ex: "I can't afford a new car." },
    { eng: "Agreement", tr: "Anlaşma", ex: "We signed the agreement." },
    { eng: "Allow", tr: "İzin vermek", ex: "My parents allow me to go out." },
    // ... (Buraya yüzlerce kelime daha eklenebilir)
  ],
  "B1-B2": [
    { eng: "Abstract", tr: "Soyut", ex: "Truth is an abstract concept." },
    { eng: "Accurate", tr: "Doğru, kesin", ex: "Is this information accurate?" },
    { eng: "Bargain", tr: "Pazarlık / Kelepir", ex: "This house is a bargain." },
    { eng: "Candidate", tr: "Aday", ex: "He is a candidate for mayor." },
    { eng: "Debt", tr: "Borç", ex: "I need to pay my debt." },
    { eng: "Efficient", tr: "Verimli", ex: "This is an efficient way to work." },
    { eng: "Frequent", tr: "Sık rastlanan", ex: "He is a frequent visitor." },
    { eng: "Guarantee", tr: "Garanti", ex: "I guarantee you will like it." },
    { eng: "Hesitate", tr: "Tereddüt etmek", ex: "Don't hesitate to ask." },
    { eng: "Influence", tr: "Etki", ex: "Television has a big influence." }
  ],
  "C1-C2": [
    { eng: "Ambiguous", tr: "Belirsiz", ex: "The ending of the movie was ambiguous." },
    { eng: "Convey", tr: "Aktarmak / İletmek", ex: "Please convey my message." },
    { eng: "Demolish", tr: "Yıkmak (Bina vb.)", ex: "They demolished the old hotel." },
    { eng: "Elaborate", tr: "Detaylandırmak", ex: "Can you elaborate on that?" },
    { eng: "Flawless", tr: "Kusursuz", ex: "Her English is flawless." },
    { eng: "Incentive", tr: "Teşvik", ex: "Money is a powerful incentive." },
    { eng: "Legitimate", tr: "Meşru / Yasal", ex: "It is a legitimate business." },
    { eng: "Obscure", tr: "Anlaşılması güç", ex: "The meaning is obscure." },
    { eng: "Profound", tr: "Derin / Kapsamlı", ex: "A profound sense of guilt." },
    { eng: "Resilient", tr: "Dirençli", ex: "Children are often very resilient." }
  ]
};

export default function UltimateMarathon() {
  const [level, setLevel] = useState("A1-A2");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ learned: [], struggle: [] });
  const [view, setView] = useState("app"); // 'app' veya 'report'

  const words = OXFORD_DATA[level];
  const word = words[index];

  const speak = (text) => {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
  };

  const handleAction = (learned) => {
    setResults(prev => ({
      learned: learned ? [...prev.learned, word] : prev.learned,
      struggle: !learned ? [...prev.struggle, word] : prev.struggle
    }));
    
    setFlipped(false);
    if (index < words.length - 1) {
      setIndex(i => i + 1);
    } else {
      setView("report");
    }
  };

  if (view === "report") {
    return (
      <div style={styles.container}>
        <div style={styles.modal}>
          <h2 style={{color: "#2d3436"}}>🏁 Seviye Özeti</h2>
          <div style={styles.scrollArea}>
            <h3 style={{color: "#10ac84"}}>✅ Ezberlenenler ({results.learned.length})</h3>
            {results.learned.map((w, i) => <p key={i} style={styles.listItem}>{w.eng} - {w.tr}</p>)}
            <h3 style={{color: "#ee5253", marginTop: "20px"}}>❌ Tekrar Gerekli ({results.struggle.length})</h3>
            {results.struggle.map((w, i) => <p key={i} style={styles.listItem}>{w.eng} - {w.tr}</p>)}
          </div>
          <button style={styles.mainBtn} onClick={() => {setView("app"); setIndex(0); setResults({learned:[], struggle:[]});}}>Sıfırla ve Devam Et</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.nav}>
        {Object.keys(OXFORD_DATA).map(l => (
          <button key={l} onClick={() => {setLevel(l); setIndex(0);}} style={{...styles.navBtn, border: level === l ? "2px solid white" : "none"}}>{l}</button>
        ))}
      </div>

      <div style={styles.counter}>Kalan Kelime: {words.length - index}</div>

      <AnimatePresence mode="wait">
        <motion.div key={level + index} initial={{x: 100, opacity: 0}} animate={{x: 0, opacity: 1}} exit={{x: -100, opacity: 0}} style={styles.card} onClick={() => {setFlipped(!flipped); if(!flipped) speak(word.eng);}}>
          {!flipped ? (
            <div>
              <h1 style={styles.bigWord}>{word.eng}</h1>
              <p style={{color: "#b2bec3"}}>Görmek için tıkla</p>
            </div>
          ) : (
            <div>
              <h2 style={{color: "#764ba2", fontSize: "32px"}}>{word.tr}</h2>
              <p style={styles.example}>{word.ex}</p>
              <button style={styles.audioIcon} onClick={(e) => {e.stopPropagation(); speak(word.eng);}}>🔊</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.actionGroup}>
        <button style={{...styles.actionBtn, background: "#ff7675"}} onClick={() => handleAction(false)}>✕</button>
        <button style={{...styles.actionBtn, background: "#55efc4"}} onClick={() => handleAction(true)}>✓</button>
      </div>

      <button style={styles.reportBtn} onClick={() => setView("report")}>📋 Mevcut Listeyi Gör</button>
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "#6c5ce7", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "white" },
  nav: { display: "flex", gap: "10px", marginBottom: "20px" },
  navBtn: { background: "rgba(255,255,255,0.2)", color: "white", padding: "8px 15px", borderRadius: "10px", border: "none", cursor: "pointer" },
  counter: { marginBottom: "10px", opacity: 0.8 },
  card: { width: "320px", height: "400px", background: "white", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#2d3436", boxShadow: "0 15px 30px rgba(0,0,0,0.2)", padding: "30px", textAlign: "center" },
  bigWord: { fontSize: "45px", margin: 0, color: "#2d3436" },
  example: { marginTop: "20px", color: "#636e72", fontStyle: "italic" },
  audioIcon: { marginTop: "20px", background: "#f1f2f6", border: "none", borderRadius: "50%", width: "50px", height: "50px", cursor: "pointer" },
  actionGroup: { marginTop: "30px", display: "flex", gap: "40px" },
  actionBtn: { width: "70px", height: "70px", borderRadius: "50%", border: "none", color: "white", fontSize: "24px", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" },
  reportBtn: { marginTop: "30px", background: "none", border: "1px solid white", color: "white", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" },
  modal: { background: "white", padding: "30px", borderRadius: "20px", width: "320px", maxHeight: "80vh", display: "flex", flexDirection: "column" },
  scrollArea: { overflowY: "auto", margin: "20px 0", textAlign: "left" },
  listItem: { color: "#2d3436", padding: "5px 0", borderBottom: "1px solid #eee", fontSize: "14px" },
  mainBtn: { background: "#6c5ce7", color: "white", border: "none", padding: "12px", borderRadius: "10px", cursor: "pointer" }
};
