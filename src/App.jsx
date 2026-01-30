import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Kelimeler aynı (OXFORD_100 listesini buraya aynı şekilde koyduğunu varsayıyorum)
const OXFORD_100 = [
  { eng: "Ability", tr: "Yetenek", ex: "She has the ___ to pass the exam.", opts: ["ability", "apple", "adult", "account"] },
  { eng: "Accept", tr: "Kabul etmek", ex: "I ___ your invitation.", opts: ["accept", "advice", "agree", "avoid"] },
  { eng: "Accurate", tr: "Doğru", ex: "This map is very ___.", opts: ["accurate", "active", "angry", "actual"] },
  // ... (Burada 100 kelime olduğunu varsay)
  { eng: "Design", tr: "Tasarım", ex: "I like the ___.", opts: ["design", "describe", "destroy", "detail"] }
];

export default function WordMasterApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => JSON.parse(localStorage.getItem("pool")) || OXFORD_100);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [view, setView] = useState("learn");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shake, setShake] = useState(false); // Hata yapınca kartı salla

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
      setShake(true); // Hata animasyonunu tetikle
      setTimeout(() => setShake(false), 500);
      setIndex((index + 1) % pool.length);
      setFlipped(false);
    }
  };

  const resetProgress = () => {
    if(confirm("Tüm ilerlemeni sıfırlamak istiyor musun?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} style={styles.card}>
          <h1 style={{fontSize:'32px', color:'#2d3436'}}>Kelime Avcısı 🎯</h1>
          <p style={{color:'#636e72'}}>İngilizce serüvenine başla!</p>
          <form onSubmit={(e) => { e.preventDefault(); setUser(e.target.username.value); localStorage.setItem("username", e.target.username.value); }} style={{width:'100%', display:'flex', flexDirection:'column', gap:'15px'}}>
            <input name="username" placeholder="İsminizi girin..." required style={styles.input} />
            <button type="submit" style={styles.loginBtn}>Giriş Yap</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const current = pool[index];
  const progress = ((OXFORD_100.length - pool.length) / OXFORD_100.length) * 100;

  return (
    <div style={styles.container}>
      {/* Üst Panel */}
      <div style={styles.topBar}>
        <div style={styles.userInfo}>
          <span style={styles.userBadge}>👤 {user}</span>
          <span style={styles.scoreBadge}>💰 {points} Puan</span>
        </div>
        <button onClick={resetProgress} style={styles.resetBtn}>✕ Sıfırla</button>
      </div>

      {/* İlerleme Çubuğu */}
      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}}></div>
        <span style={styles.progressText}>Tamamlanan: %{Math.round(progress)}</span>
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
                  <h1 style={{fontSize:'50px', margin:0}}>{current.eng}</h1>
                ) : (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <h2 style={{color:'#4834d4', fontSize:'36px', margin:0}}>{current.tr}</h2>
                    <p style={styles.example}>{current.ex.replace("___", current.eng)}</p>
                  </motion.div>
                )}
                <small style={{color:'#b2bec3', marginTop:'20px'}}>Çevirmek için tıkla</small>
              </div>
            ) : (
              <div style={{width:'100%'}}>
                <p style={styles.quizQuestion}>{current.ex}</p>
                <div style={styles.quizGrid}>
                  {current.opts.map(o => (
                    <button key={o} onClick={() => handleAction(o === current.eng.toLowerCase())} style={styles.optBtn}>
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
            <button onClick={resetProgress} style={styles.loginBtn}>Yeniden Başla</button>
          </div>
        )}
      </AnimatePresence>

      <div style={styles.footer}>
        <button onClick={() => setView(view === 'learn' ? 'quiz' : 'learn')} style={styles.modeBtn}>
          {view === 'learn' ? '🎯 Quiz Modu' : '📖 Öğrenme Modu'}
        </button>
        {view === 'learn' && pool.length > 0 && (
          <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
            <button onClick={() => handleAction(false)} style={styles.skipBtn}>Pas Geç</button>
            <button onClick={() => handleAction(true)} style={styles.doneBtn}>Öğrendim ✓</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'system-ui' },
  topBar: { position: 'absolute', top: 0, left: 0, right: 0, padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)' },
  userInfo: { display: 'flex', gap: '10px' },
  userBadge: { background: '#485e6a', padding: '6px 15px', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '13px' },
  scoreBadge: { background: '#f1c40f', padding: '6px 15px', borderRadius: '15px', color: '#000', fontWeight: 'bold', fontSize: '13px' },
  resetBtn: { background: '#ff7675', border: 'none', color: 'white', padding: '6px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  progressContainer: { width: '80%', maxWidth: '350px', height: '20px', background: '#34495e', borderRadius: '10px', marginBottom: '25px', position: 'relative', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#55efc4', transition: 'width 0.5s ease' },
  progressText: { position: 'absolute', width: '100%', textAlign: 'center', fontSize: '10px', top: '4px', color: 'white', fontWeight: 'bold' },
  card: { background: 'white', padding: '30px', borderRadius: '40px', width: '100%', maxWidth: '360px', height: '420px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative' },
  cardInner: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  example: { fontStyle: 'italic', color: '#636e72', marginTop: '20px', fontSize: '18px' },
  quizQuestion: { fontSize: '20px', fontWeight: 'bold', color: '#2d3436', marginBottom: '25px' },
  quizGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' },
  optBtn: { padding: '15px', borderRadius: '15px', border: '1px solid #dfe6e9', background: '#f5f6fa', fontWeight: '600', cursor: 'pointer', color: '#2d3436' },
  footer: { marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modeBtn: { background: '#0984e3', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  skipBtn: { padding: '15px 30px', borderRadius: '20px', border: 'none', background: '#b2bec3', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  doneBtn: { padding: '15px 30px', borderRadius: '20px', border: 'none', background: '#55efc4', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  input: { padding: '18px', borderRadius: '15px', border: '2px solid #eee', fontSize: '18px', outline: 'none' },
  loginBtn: { padding: '18px', background: '#55efc4', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }
};
