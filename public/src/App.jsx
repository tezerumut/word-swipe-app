import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  // Hafızayı kontrol et, hata varsa OXFORD_DATA'yı yükle
  const [pool, setPool] = useState(() => {
    try {
      const saved = localStorage.getItem("pool");
      return (saved && JSON.parse(saved).length > 0) ? JSON.parse(saved) : OXFORD_DATA;
    } catch {
      return OXFORD_DATA;
    }
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

  // Eğer pool boşsa veya yüklenemediyse uyarı ver
  if (!pool || pool.length === 0) {
    return (
      <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#1e272e', color:'white'}}>
        <button onClick={() => {localStorage.clear(); window.location.reload();}} style={{padding:'20px', borderRadius:'10px', cursor:'pointer'}}>
          Veri Yüklenemedi. Sıfırlamak İçin Tıkla
        </button>
      </div>
    );
  }

  return (
    <div style={{height:'100vh', background:'#1e272e', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', touchAction:'none', overflow:'hidden', fontFamily:'sans-serif'}}>
      <div style={{position:'absolute', top:20, color:'white'}}>Kalan: {pool.length}</div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={pool.length + index}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, { offset }) => {
            if (offset.x > 100) handleSwipe(true);
            else if (offset.x < -100) handleSwipe(false);
          }}
          style={{width:'300px', height:'400px', background:'white', borderRadius:'30px', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', cursor:'grab', boxShadow:'0 20px 40px rgba(0,0,0,0.5)'}}
        >
          <div onClick={() => setFlipped(!flipped)} style={{padding:'20px'}}>
            <h1 style={{fontSize:'40px', margin:0, color:'#2d3436'}}>{flipped ? pool[index].tr : pool[index].eng}</h1>
            <p style={{fontSize:'12px', color:'#ccc', marginTop:'20px'}}>Tıkla: Çevir | Sağa: Bildim | Sola: Zor</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
