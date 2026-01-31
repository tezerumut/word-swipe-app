import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => {
    const saved = localStorage.getItem("pool");
    try { return saved ? JSON.parse(saved) : OXFORD_DATA; } catch { return OXFORD_DATA; }
  });
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem("pool", JSON.stringify(pool));
    localStorage.setItem("points", points);
  }, [pool, points]);

  const handleSwipe = (isCorrect) => {
    if (isCorrect) {
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      setPoints(p => p + 10);
      if (index >= newPool.length) setIndex(0);
    } else {
      setIndex((index + 1) % (pool.length || 1));
    }
    setFlipped(false);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{scale:0.8}} animate={{scale:1}} style={styles.card}>
          <img src="/logo.png" style={styles.logo} onError={(e) => e.target.style.display='none'} />
          <h1 style={{color:'#2d3436'}}>Kelime Avcısı</h1>
          <button onClick={() => {setUser("Öğrenci"); localStorage.setItem("username", "Öğrenci");}} style={styles.loginBtn}>BAŞLA</button>
        </motion.div>
      </div>
    );
  }

  const progress = ((OXFORD_DATA.length - pool.length) / OXFORD_DATA.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.badge}>💰 {points} Puan</div>
        <div style={styles.badge}>📚 Kalan: {pool.length}</div>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.reset}>Sıfırla</button>
      </div>

      <div style={styles.progressContainer}>
        <div style={{...styles.progressBar, width: `${progress}%`}}></div>
      </div>

      <AnimatePresence mode="wait">
        {pool.length > 0 ? (
          <motion.div
            key={pool.length + index}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) handleSwipe(true);
              else if (offset.x < -100) handleSwipe(false);
            }}
            whileDrag={{ scale: 1.05, rotate: offset.x > 0 ? 10 : -10 }}
            style={styles.card}
          >
            <div onClick={() => setFlipped(!flipped)} style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
               <h1 style={{fontSize:'45px', margin:0, color:'#2d3436'}}>{flipped ? pool[index].tr : pool[index].eng}</h1>
               {flipped && <p style={{color:'#636e72', marginTop:'20px'}}>{pool[index].ex}</p>}
               <p style={styles.hint}>Çevir: Tıkla | Bildim: Sağa ➔ | Bilemedim: ⬅ Sola</p>
            </div>
          </motion.div>
        ) : (
          <div style={styles.card}>
            <h1 style={{fontSize:'50px'}}>🏆</h1>
            <h2>Tebrikler!</h2>
            <p>Tüm kelimeleri bitirdin.</p>
            <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.loginBtn}>Yeniden Başla</button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', touchAction: 'none', overflow: 'hidden', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '40px', borderRadius: '40px', width: '320px', height: '450px', textAlign: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', cursor: 'grab', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' },
  logo: { width: '100px', height: '100px', borderRadius: '20px', marginBottom: '20px' },
  topBar: { position: 'absolute', top: 20, display:'flex', gap:'10px', alignItems:'center' },
  badge: { background: '#34495e', color: 'white', padding: '8px 15px', borderRadius: '15px', fontSize: '14px', fontWeight:'bold' },
  reset: { background: '#ff7675', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '15px', cursor: 'pointer' },
  progressContainer: { width: '250px', height: '8px', background: '#34495e', borderRadius: '10px', marginBottom: '30px' },
  progressBar: { height: '100%', background: '#55efc4', borderRadius: '10px', transition: 'width 0.3s' },
  loginBtn: { padding: '15px 40px', background: '#55efc4', border: 'none', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', fontSize:'18px' },
  hint: { fontSize: '11px', color: '#b2bec3', marginTop: '40px', fontWeight:'bold' }
};
