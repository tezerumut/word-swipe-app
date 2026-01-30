import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ALL_WORDS = [
  { eng: "Ability", tr: "Yetenek", ex: "She has the ___ to pass the exam.", correct: "ability", options: ["ability", "apple", "account", "adult"] },
  { eng: "Accept", tr: "Kabul etmek", ex: "I ___ your invitation.", correct: "accept", options: ["accept", "advice", "agree", "avoid"] },
  { eng: "Accurate", tr: "Doğru, kesin", ex: "This map is very ___.", correct: "accurate", options: ["accurate", "angry", "active", "actual"] },
  { eng: "Achieve", tr: "Başarmak", ex: "You can ___ anything.", correct: "achieve", options: ["achieve", "across", "adjust", "admire"] },
  { eng: "Advice", tr: "Tavsiye", ex: "Can you give me some ___?", correct: "advice", options: ["advice", "advance", "agency", "amount"] }
  // Buraya daha fazla kelime eklenecek...
];

export default function WordProApp() {
  const [mode, setMode] = useState("learn"); // 'learn' veya 'quiz'
  const [pool, setPool] = useState(ALL_WORDS); // Mevcut kelimeler
  const [struggleList, setStruggleList] = useState([]); // Yanlış bilinenler
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const currentWord = pool[index];

  // Öğrenme modunda "Biliyorum" denirse listeden kalıcı çıkar
  const markAsLearned = () => {
    const newPool = pool.filter((_, i) => i !== index);
    setPool(newPool);
    if (index >= newPool.length) setIndex(0);
    setFlipped(false);
  };

  // "Zorlandım" denirse struggle listesine ekle
  const markAsStruggle = () => {
    if (!struggleList.find(w => w.eng === currentWord.eng)) {
      setStruggleList([...struggleList, currentWord]);
    }
    nextWord();
  };

  const nextWord = () => {
    setFlipped(false);
    setIndex((index + 1) % pool.length);
  };

  const handleQuizAnswer = (option) => {
    if (option === currentWord.correct) {
      setScore({ ...score, correct: score.correct + 1 });
      markAsLearned();
    } else {
      setScore({ ...score, wrong: score.wrong + 1 });
      markAsStruggle();
    }
  };

  if (pool.length === 0) return <div style={styles.container}><h1>🏆 Tebrikler! Tüm kelimeleri temizledin.</h1><button onClick={() => setPool(ALL_WORDS)} style={styles.btn}>Sıfırla</button></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>Havuz: {pool.length}</div>
        <div style={styles.badge}>Zor Liste: {struggleList.length}</div>
        <button onClick={() => setMode(mode === "learn" ? "quiz" : "learn")} style={styles.modeBtn}>
          {mode === "learn" ? "🎯 Test Moduna Geç" : "📖 Öğrenme Modu"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={currentWord.eng} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={styles.card}>
          {mode === "learn" ? (
            <div onClick={() => setFlipped(!flipped)} style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
              {!flipped ? (
                <h1 style={styles.wordEng}>{currentWord.eng}</h1>
              ) : (
                <div>
                  <h2 style={styles.wordTr}>{currentWord.tr}</h2>
                  <p style={styles.wordEx}>{currentWord.ex.replace("___", currentWord.eng)}</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={styles.quizEx}>{currentWord.ex}</p>
              <div style={styles.optionsGrid}>
                {currentWord.options.map(opt => (
                  <button key={opt} onClick={() => handleQuizAnswer(opt)} style={styles.optionBtn}>{opt}</button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {mode === "learn" && (
        <div style={styles.actions}>
          <button onClick={markAsStruggle} style={{...styles.actionBtn, background: "#ff7675"}}>✕ Zor</button>
          <button onClick={markAsLearned} style={{...styles.actionBtn, background: "#55efc4"}}>✓ Öğrendim</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: "100vh", background: "#1e272e", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  header: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap", justifyContent: "center" },
  badge: { background: "#485e6a", padding: "5px 15px", borderRadius: "20px", fontSize: "14px" },
  modeBtn: { background: "#f1c40f", border: "none", padding: "8px 15px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" },
  card: { width: "100%", maxWidth: "350px", height: "400px", background: "white", borderRadius: "25px", padding: "30px", color: "#2d3436", textAlign: "center", boxShadow: "0 15px 35px rgba(0,0,0,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  wordEng: { fontSize: "48px", color: "#2d3436" },
  wordTr: { fontSize: "32px", color: "#341f97" },
  wordEx: { fontSize: "18px", marginTop: "20px", fontStyle: "italic", color: "#576574" },
  quizEx: { fontSize: "20px", marginBottom: "30px", fontWeight: "bold" },
  optionsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" },
  optionBtn: { padding: "12px", borderRadius: "10px", border: "1px solid #dcdde1", background: "#f5f6fa", fontSize: "16px", cursor: "pointer", transition: "0.3s" },
  actions: { marginTop: "30px", display: "flex", gap: "20px" },
  actionBtn: { padding: "15px 30px", borderRadius: "30px", border: "none", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "18px" },
  btn: { padding: "10px 20px", marginTop: "20px", borderRadius: "10px", border: "none", background: "#55efc4", cursor: "pointer" }
};
