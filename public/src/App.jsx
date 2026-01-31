import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words"; // words.js'den veriyi çeker

export default function WordMasterApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => {
    const saved = localStorage.getItem("pool");
    return saved ? JSON.parse(saved) : OXFORD_DATA;
  });
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [view, setView] = useState("learn");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("pool", JSON.stringify(pool));
  }, [points, pool]);

  const handleAction = (isCorrect) => {
    if (isCorrect) {
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      setPoints(p => p + 10);
      if (index >= newPool.length) setIndex(0);
      setFlipped(false);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setIndex((index + 1) % pool.length);
      setFlipped(false);
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={styles.card}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={styles.logo} 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <h1 style={{ fontSize: '26px', color: '#2d3436', margin: '10px 0' }}>Kelime Avcısı</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.username.value;
            setUser(name);
            localStorage.setItem("username", name);
          }} style={styles.loginForm}>
            <input name="username" placeholder="İsminizi yazın..." required style={styles.input} />
            <button type="submit" style={styles.loginBtn}>Başla</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const current = pool[index];
  const progress = OXFORD_DATA.length > 0 ? ((OXFORD_DATA.length - pool.length) / OXFORD_DATA.length) * 100 : 0;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span style={styles.badge}>👤 {user}</span>
        <span style={{ ...styles.badge, background: '#f1c40f', color: '#000' }}>💰 {points}</span>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={styles.resetBtn}>✕ Sıfırla</button>
      </div>

      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }}></div>
      </div>

      <AnimatePresence mode="wait">
        {pool.length > 0 ? (
          <motion.div
            key={pool.length + index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) handleAction(true); // Sağa kaydırma: Bildim
              else if (offset.x < -100) handleAction(false); // Sola kaydırma: Zor
            }}
            whileDrag={{ scale: 1.05, rotate: 5 }}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            style={{ ...styles.card, cursor: 'grab', touchAction: 'none' }}
          >
            {view === "learn" ? (
              <div onClick={() => setFlipped(!flipped)} style={{ width: '100%' }}>
                {!flipped ? (
                  <h1 style={{ fontSize: '40px', margin: 0 }}>{current.eng}</h1>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 style={{ color: '#4834d4', fontSize: '32px', margin: 0 }}>{current.tr}</h2>
                    <p style={styles.example}>{current.ex.replace("___", current.eng)}</p>
                  </motion.div>
                )}
                <p style={styles.hint}>Sola: Zor ✕ | Sağa: Bildim ✓</p>
              </div>
            ) : (
              <div style={{ width: '100%' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '20px' }}>{current.ex}</p>
                <div style={styles.quizGrid}>
                  {current.opts.map((o, i) => (
                    <button key={i} onClick={() => handleAction(o.toLowerCase() === current.eng.toLowerCase())} style={styles.optBtn}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div style={styles.card}>
            <h2>Tebrikler! 🎉</h2>
            <p>Tüm kelimeleri öğrendin.</p>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={styles.loginBtn}>Başa Dön</button>
          </div>
        )}
      </AnimatePresence>

      <div style={styles.footer}>
        <button onClick={() => setView(view === 'learn' ? 'quiz' : 'learn')} style={styles.modeBtn}>
          {view === 'learn' ? '🎯 Quiz Modu' : '📖 Kartlar'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif', overflow: 'hidden' },
  card: { background: 'white', padding: '30px', borderRadius: '35px', width: '100%', maxWidth: '340px', height: '400px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' },
  logo: { width: '85px', height: '85px', borderRadius: '20px', marginBottom: '15px', objectFit: 'cover' },
  topBar: { position: 'absolute', top: 20, display: 'flex', gap: '8px' },
  badge: { background: '#34495e', color: 'white', padding: '6px 15px', borderRadius: '15px', fontSize: '13px', fontWeight: 'bold' },
  resetBtn: { background: '#ff7675', border: 'none', borderRadius: '10px', color: 'white', padding: '6px 12px', cursor: 'pointer' },
  progressContainer: { width: '280px', height: '10px', background: '#34495e', borderRadius: '5px', marginBottom: '25px' },
  progressBar: { height: '100%', background: '#55efc4', borderRadius: '5px', transition: 'width 0.4s' },
  loginForm: { width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' },
  input: { padding: '15px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '16px' },
  loginBtn: { padding: '15px', background: '#55efc4', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' },
  example: { fontStyle: 'italic', color: '#636e72', marginTop: '15px', fontSize: '16px' },
  hint: { fontSize: '11px', color: '#b2bec3', marginTop: '30px', fontWeight: 'bold' },
  quizGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optBtn: { padding: '12px', background: '#f5f6fa', border: '1px solid #ddd', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  footer: { marginTop: '25px' },
  modeBtn: { padding: '10px 25px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }
};
