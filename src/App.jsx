import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words"; // words.js dosyasından kelimeleri çeker

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

  const fullReset = () => {
    if(confirm("Tüm ilerlemen silinecek ve başa döneceksin. Emin misin?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} style={styles.card}>
          {/* Logo Dosyası: public/logo.png olmalı */}
          <img 
            src="/logo.png" 
            alt="Logo" 
            style={styles.logo} 
            onError={(e) => e.target.style.display = 'none'} 
          />
          <h1 style={{fontSize:'28px', color:'#2d3436', margin:'10px 0'}}>Kelime Avcısı 🎯</h1>
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
  const progress = ((OXFORD_DATA.length - pool.length) / OXFORD_DATA.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.userInfo}>
          <span style={styles.badge}>👤 {user}</span>
          <span style={{...styles.badge, background:'#f1c40f', color:'#000'}}>💰 {points}</span>
        </div>
        <button onClick={fullReset} style={styles.resetBtn}>✕ Çıkış</button>
      </div>

      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}}></div>
        <span style={styles.progressText}>İlerleme: %{Math.round(progress)}</span>
      </div>

      <AnimatePresence mode="wait">
        {pool.length > 0 ? (
          <motion.div 
            key={pool.length + index}
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
            style={{...styles.card, borderTop: shake ? '5px solid #ff7675' : 'none'}}
          >
            {view === "learn" ? (
              <div onClick={() => setFlipped(!flipped)} style={styles.cardInner}>
                {!flipped ? (
                  <h1 style={{fontSize:'45px', margin:0}}>{current.eng}</h1>
                ) : (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <h2 style={{color:'#4834d4', fontSize:'32px', margin:0}}>{current.tr}</h2>
                    <p style={styles.example}>{current.ex.replace("___", current.eng)}</p>
                  </motion.div>
                )}
                <small style={{color:'#b2bec3', marginTop:'20px'}}>Çevirmek için dokun</small>
              </div>
            ) : (
              <div style={{width:'100%'}}>
                <p style={styles.quizQuestion}>{current.ex}</p>
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
            <h1>🏆 TEBRİKLER!</h1>
            <p>Tüm kelimeleri bitirdin!</p>
            <button onClick={fullReset} style={styles.loginBtn}>Yeniden Başla</button>
          </div>
        )}
      </AnimatePresence>

      <div style={styles.footer}>
        <button onClick={() => setView(view === 'learn' ? 'quiz' : 'learn')} style={styles.modeBtn}>
          {view === 'learn' ? '🎯 Quiz Modu' : '📖 Kartlar'}
        </button>
        {view === 'learn' && pool.length > 0 && (
          <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
            <button onClick={() => handleAction(false)} style={styles.skipBtn}>Zor ✕</button>
            <button onClick={() => handleAction(true)} style={styles.doneBtn}>Biliyorum ✓</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' },
  userInfo: { display: 'flex', gap: '8px' },
  badge: { background: '#485e6a', padding: '6px 12px', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '12px' },
  resetBtn: { background: '#ff7675', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  logo: { width: '100px', height: '100px', marginBottom: '15px', borderRadius: '25px', objectFit: 'cover' },
  progressContainer: { width: '80%', maxWidth: '350px', height: '18px', background: '#34495e', borderRadius: '10px', marginBottom: '25px', position: 'relative', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#55efc4', transition: 'width 0.5s ease' },
  progressText: { position: 'absolute', width: '100%', textAlign: 'center', fontSize: '10px', top: '3px', color: 'white', fontWeight: 'bold' },
  card: { background: 'white', padding: '30px', borderRadius: '40px', width: '100%', maxWidth: '360px', height: '420px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' },
  loginForm: { width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '18px', outline: 'none' },
  loginBtn: { padding: '15px', background: '#55efc4', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' },
  cardInner: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  example: { fontStyle: 'italic', color: '#636e72', marginTop: '15px', fontSize: '17px' },
  quizQuestion: { fontSize: '19px', fontWeight: 'bold', color: '#2d3436', marginBottom: '20px' },
  quizGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' },
  optBtn: { padding: '14px', borderRadius: '15px', border: '1px solid #dfe6e9', background: '#f5f6fa', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modeBtn: { background: '#0984e3', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  skipBtn: { padding: '14px 25px', borderRadius: '15px', border: 'none', background: '#b2bec3', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  doneBtn: { padding: '14px 25px', borderRadius: '15px', border: 'none', background: '#55efc4', color: 'white', fontWeight: 'bold', cursor: 'pointer' }
};
