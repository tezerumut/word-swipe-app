import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// TEST KELİMELERİ (Burayı sonra 5000 kelimeye bağlayacağız)
const KELIMELER = [
  { id: 1, eng: "Opportunity", tr: "Fırsat", ph: "/ˌɒp.əˈtjuː.nə.ti/" },
  { id: 2, eng: "Success", tr: "Başarı", ph: "/səkˈses/" },
  { id: 3, eng: "Constant", tr: "Sürekli", ph: "/ˈkɒn.stənt/" },
  { id: 4, eng: "Improve", tr: "Geliştirmek", ph: "/ɪmˈpruːv/" },
  { id: 5, eng: "Challenge", tr: "Zorluk/Mücadele", ph: "/ˈtʃæl.ɪndʒ/" }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [showTr, setShowTr] = useState(false);
  const [learnedCount, setLearnedCount] = useState(0);

  // Sesli Telaffuz
  const speak = (text) => {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Biraz yavaş ve net konuşsun
    window.speechSynthesis.speak(utterance);
  };

  const handleSwipe = (direction) => {
    if (direction === "right") {
      setLearnedCount(prev => prev + 1); // Biliyorum sayacı
    }
    setShowTr(false);
    setIndex(prev => prev + 1);
  };

  if (index >= KELIMELER.length) {
    return (
      <div style={centerStyle}>
        <h2>🏆 Harika!</h2>
        <p>Bu seti bitirdin. Toplam {learnedCount} kelime öğrendin.</p>
        <button onClick={() => setIndex(0)} style={refreshBtn}>Baştan Başla</button>
      </div>
    );
  }

  const currentWord = KELIMELER[index];

  return (
    <div style={containerStyle}>
      {/* İlerleme Çubuğu */}
      <div style={progressContainer}>
        <div style={{...progressFill, width: `${(index / KELIMELER.length) * 100}%`}}></div>
      </div>

      <div style={headerStyle}>WordSwipe <span style={{color:'#3b82f6'}}>EN-TR</span></div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWord.id}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(e, info) => {
            if (info.offset.x > 100) handleSwipe("right"); // Sağa: Biliyorum
            if (info.offset.x < -100) handleSwipe("left"); // Sola: Bilmiyorum
          }}
          initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ 
            x: index % 2 === 0 ? 500 : -500, 
            opacity: 0,
            rotate: index % 2 === 0 ? 45 : -45
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          style={cardStyle}
        >
          <div style={badge}>{index + 1} / {KELIMELER.length}</div>
          
          <div style={{fontSize: '42px', fontWeight: '900', color: '#1e293b'}}>{currentWord.eng}</div>
          <div style={{fontSize: '16px', color: '#94a3b8', margin: '5px 0', fontFamily: 'monospace'}}>{currentWord.ph}</div>
          
          <button onClick={() => speak(currentWord.eng)} style={soundBtn}>🔊 Dinle</button>
          
          <div onClick={() => setShowTr(!showTr)} style={trBox}>
            {showTr ? (
              <motion.div initial={{y:10}} animate={{y:0}} style={{color: '#10b981', fontWeight:'800'}}>
                {currentWord.tr}
              </motion.div>
            ) : (
              <span style={{color:'#94a3b8', fontSize:'14px'}}>Türkçesini görmek için tıkla</span>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={footerStyle}>
        <div style={{textAlign:'center', color:'#ef4444'}}>⬅️ BİLMİYORUM<br/><small>(Tekrar Et)</small></div>
        <div style={{textAlign:'center', color:'#10b981'}}>BİLİYORUM ➡️<br/><small>(Öğrendim)</small></div>
      </div>
    </div>
  );
}

// STİLLER
const containerStyle = { height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif', overflow: 'hidden', position: 'relative' };
const headerStyle = { position: 'absolute', top: '40px', fontWeight: '900', fontSize: '20px', letterSpacing:'-1px' };
const cardStyle = { width: '85%', maxWidth: '340px', height: '480px', backgroundColor: '#fff', borderRadius: '35px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'grab', touchAction: 'none', position:'relative', border: '1px solid #f1f5f9' };
const badge = { position:'absolute', top:'25px', right:'25px', backgroundColor:'#f1f5f9', padding:'5px 12px', borderRadius:'15px', fontSize:'12px', color:'#64748b', fontWeight:'700' };
const soundBtn = { marginTop: '30px', padding: '15px 30px', borderRadius: '20px', border: 'none', backgroundColor: '#f1f5f9', color: '#1e293b', cursor: 'pointer', fontWeight: 'bold', fontSize:'16px', display:'flex', alignItems:'center', gap:'10px' };
const trBox = { marginTop: '50px', minHeight:'60px', display:'flex', alignItems:'center', justifyContent:'center', padding:'0 20px', textAlign:'center', cursor: 'pointer' };
const footerStyle = { position: 'absolute', bottom: '50px', width: '90%', display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '900', letterSpacing:'1px' };
const centerStyle = { height: '100vh', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', padding:'20px', textAlign:'center' };
const progressContainer = { position:'absolute', top:0, left:0, width:'100%', height:'6px', backgroundColor:'#e2e8f0' };
const progressFill = { height:'100%', backgroundColor:'#3b82f6', transition:'width 0.3s ease' };
const refreshBtn = { marginTop:'20px', padding:'12px 25px', borderRadius:'12px', border:'none', backgroundColor:'#1e293b', color:'#fff', fontWeight:'700' };
