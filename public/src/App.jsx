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
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} style={styles.card}>
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={styles.logo} 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <h1 style={{fontSize:'26px', color:'#2d3436', margin:'10px 0'}}>Kelime Avcısı</h1>
          <form onSubmit={(e) => {
            e.preventDefault();
            const name = e.target.username.value;
            setUser(name);
            localStorage.setItem("username", name);
          }} style={{display:'flex', flexDirection:'column', gap:'12px', width:'100%'}}>
            <input name="username" placeholder="İsminizi yazın..." required style={styles.input} />
            <button type="submit" style={styles.loginBtn}>Öğrenmeye Başla</button>
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
        <span style={{...styles.badge, background:'#f1c40f', color:'#000'}}>💰 {points}</span>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.resetBtn}>✕ Sıfırla</button>
      </div>

      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}}></div>
      </div>

      <AnimatePresence mode="wait">
        {pool.length > 0 ? (
          <motion.div 
            key={pool.length + index}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            style={styles.card}
          >
            {view === "learn" ? (
              <div onClick={() => setFlipped(!flipped)} style={{cursor:'pointer'}}>
                {!flipped ? <h1 style={{fontSize:'40px'}}>{current.eng}</h1> : <h2>{current.tr}</h2>}
                <p style={{fontSize:'12px', color:'#ccc', marginTop:'20px'}}>Çevirmek için tıkla</p>
              </div>
            ) : (
              <div style={{width:'100%'}}>
                <p style={{fontWeight:'bold', marginBottom:'20px'}}>{current.ex}</p>
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
            <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.loginBtn}>Başa Dön</button>
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
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', width: '320px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  logo: { width: '80px', height: '80px', borderRadius: '15px', marginBottom: '15px', objectFit: 'cover' },
  topBar: { position: 'absolute', top: 20, display: 'flex', gap: '10px' },
  badge: { background: '#34495e', color: 'white', padding: '5px 15px', borderRadius: '15px', fontSize: '13px' },
  resetBtn: { background: '#ff7675', color: 'white', border: 'none', borderRadius: '10px', padding: '5px 10px', cursor: 'pointer' },
  progressContainer: { width: '280px', height: '10px', background: '#34495e', borderRadius: '5px', marginBottom: '20px' },
  progressBar: { height: '100%', background: '#55efc4', borderRadius: '5px', transition: '0.4s' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' },
  loginBtn: { padding: '12px', background: '#55efc4', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  quizGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  optBtn: { padding: '12px', background: '#f5f6fa', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer' },
  footer: { marginTop: '20px' },
  modeBtn: { padding: '10px 25px', background: '#0984e3', color: 'white', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' }
};
