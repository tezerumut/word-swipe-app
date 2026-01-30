import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const INITIAL_WORDS = [
  { eng: "Ability", tr: "Yetenek", ex: "She has the ___ to pass the exam.", opts: ["ability", "apple", "adult", "account"] },
  { eng: "Accept", tr: "Kabul etmek", ex: "I ___ your invitation.", opts: ["accept", "advice", "agree", "avoid"] },
  { eng: "Accurate", tr: "Doğru", ex: "This map is very ___.", opts: ["accurate", "active", "angry", "actual"] },
  { eng: "Achieve", tr: "Başarmak", ex: "You can ___ anything.", opts: ["achieve", "across", "adjust", "admire"] },
  { eng: "Advice", tr: "Tavsiye", ex: "Can you give me some ___?", opts: ["advice", "advance", "agency", "amount"] }
  // Buraya istediğin kadar kelimeyi aynı formatta ekleyebilirsin
];

export default function WordExpertApp() {
  const [pool, setPool] = useState(INITIAL_WORDS); // Kalan kelimeler
  const [index, setIndex] = useState(0);
  const [view, setView] = useState("learn"); // 'learn' veya 'quiz'
  const [flipped, setFlipped] = useState(false);

  const current = pool[index];

  const handleAction = (learned) => {
    if (learned) {
      // Kelimeyi havuzdan kalıcı olarak sil
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      if (index >= newPool.length) setIndex(0);
    } else {
      // Zorlandığı kelimeyi sona at, tekrar sorsun
      setIndex((index + 1) % pool.length);
    }
    setFlipped(false);
  };

  if (pool.length === 0) return <div style={styles.container}><h1>🏆 Tebrikler! Tüm kelimeleri öğrendin.</h1><button onClick={() => window.location.reload()} style={styles.btn}>Baştan Başla</button></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.stat}>Kalan: {pool.length}</div>
        <button onClick={() => setView(view === "learn" ? "quiz" : "learn")} style={styles.modeBtn}>
          {view === "learn" ? "🎯 Quiz Modu" : "📖 Kart Modu"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={pool.length + index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
          {view === "learn" ? (
            <div onClick={() => setFlipped(!flipped)} style={styles.cardContent}>
              {!flipped ? <h1>{current.eng}</h1> : <div><h2>{current.tr}</h2><p>{current.ex.replace("___", current.eng)}</p></div>}
            </div>
          ) : (
            <div style={styles.quizBox}>
              <p>{current.ex}</p>
              <div style={styles.grid}>
                {current.opts.map(o => <button key={o} onClick={() => { if(o === current.eng.toLowerCase()) handleAction(true); else alert("Yanlış!"); }} style={styles.optBtn}>{o}</button>)}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {view === "learn" && (
        <div style={styles.actions}>
          <button onClick={() => handleAction(false)} style={{...styles.actionBtn, background:'#ff7675'}}>Zorlandım</button>
          <button onClick={() => handleAction(true)} style={{...styles.actionBtn, background:'#55efc4'}}>Öğrendim</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#2d3436', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', padding: '20px' },
  header: { display: 'flex', gap: '20px', marginBottom: '30px' },
  stat: { background: '#636e72', padding: '5px 15px', borderRadius: '15px' },
  modeBtn: { background: '#fdcb6e', border: 'none', padding: '5px 15px', borderRadius: '15px', fontWeight: 'bold' },
  card: { width: '100%', maxWidth: '350px', height: '400px', background: 'white', borderRadius: '30px', padding: '30px', color: '#2d3436', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' },
  optBtn: { padding: '10px', borderRadius: '10px', border: '1px solid #dfe6e9', background: '#f5f6fa' },
  actions: { marginTop: '30px', display: 'flex', gap: '20px' },
  actionBtn: { padding: '15px 25px', borderRadius: '15px', border: 'none', color: 'white', fontWeight: 'bold' }
};
