import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => {
    const saved = localStorage.getItem("pool");
    try { return saved ? JSON.parse(saved) : OXFORD_DATA; } catch { return OXFORD_DATA; }
  });
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem("pool", JSON.stringify(pool));
  }, [pool]);

  const handleSwipe = (isCorrect) => {
    if (isCorrect) {
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      if (index >= newPool.length) setIndex(0);
    } else {
      setIndex((index + 1) % (pool.length || 1));
    }
    setFlipped(false);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <img src="/logo.png" style={styles.logo} onError={(e) => e.target.style.display='none'} />
          <h1>Kelime Avcısı</h1>
          <button onClick={() => {setUser("Öğrenci"); localStorage.setItem("username", "Öğrenci");}} style={styles.btn}>BAŞLA</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <span>Kalan: {pool.length}</span>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.reset}>Sıfırla</button>
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
            whileDrag={{ scale: 1.1, rotate: 5 }}
            style={styles.card}
          >
            <div onClick={() => setFlipped(!flipped)} style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
               <h1 style={{fontSize:'40px'}}>{flipped ? pool[index].tr : pool[index].eng}</h1>
               <p style={{fontSize:'12px', color:'#ccc', marginTop:'20px'}}>Çevir: Tıkla | Bildim: Sağa At | Zor: Sola At</p>
            </div>
          </motion.div>
        ) : (
          <div style={styles.card}><h1>BİTTİ! 🎉</h1><button onClick={() => window.location.reload()}>Tekrarla</button></div>
        )}
      </AnimatePresence>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#1e272e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', touchAction: 'none', overflow: 'hidden', fontFamily: 'sans-serif' },
  card: { background: 'white', padding: '30px', borderRadius: '30px', width: '300px', height: '420px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', cursor: 'grab' },
  logo: { width: '80px', height: '80px', borderRadius: '15px', marginBottom: '20px' },
  btn: { padding: '15px 40px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' },
  topBar: { position: 'absolute', top: 20, color: 'white', display: 'flex', gap: '20px' },
  reset: { background: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }
};
