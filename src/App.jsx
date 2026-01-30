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

export default function WordExpertApp() {import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Burası senin hazinen. 100 kelimeyi bu formatta aşağıya ekleyebilirsin.
const OXFORD_100 = [
  { eng: "Ability", tr: "Yetenek", ex: "She has the ___ to pass the exam.", opts: ["ability", "apple", "adult", "account"] },
  { eng: "Accept", tr: "Kabul etmek", ex: "I ___ your invitation.", opts: ["accept", "advice", "agree", "avoid"] },
  { eng: "Accurate", tr: "Doğru", ex: "This map is very ___.", opts: ["accurate", "active", "angry", "actual"] },
  { eng: "Achieve", tr: "Başarmak", ex: "You can ___ anything.", opts: ["achieve", "across", "adjust", "admire"] },
  { eng: "Advice", tr: "Tavsiye", ex: "Can you give me some ___?", opts: ["advice", "advance", "agency", "amount"] },
  { eng: "Afford", tr: "Gücü yetmek", ex: "I can't ___ a new car.", opts: ["afford", "afraid", "after", "again"] },
  { eng: "Agree", tr: "Katılmak", ex: "I ___ with your opinion.", opts: ["agree", "agent", "ahead", "aim"] },
  { eng: "Ancient", tr: "Antik", ex: "I love ___ history.", opts: ["ancient", "anger", "angle", "animal"] },
  { eng: "Apply", tr: "Başvurmak", ex: "You should ___ for the job.", opts: ["apply", "apple", "appear", "area"] },
  { eng: "Arrange", tr: "Düzenlemek", ex: "I'll ___ the meeting.", opts: ["arrange", "arrive", "art", "army"] }
  // ... Listeyi bu şekilde 100'e kadar doldurabilirsin.
];

export default function WordExpertApp() {
  const [pool, setPool] = useState(OXFORD_100);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState("learn"); 
  const [flipped, setFlipped] = useState(false);
  const [points, setPoints] = useState(0);

  const current = pool[index];

  const handleAction = (learned) => {
    if (learned) {
      // Kelimeyi havuzdan silerek düşürüyoruz (Para kazandıran özellik!)
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      setPoints(prev => prev + 10);
      if (index >= newPool.length) setIndex(0);
    } else {
      // Zorlandığı kelimeyi havuzun sonuna atıyoruz
      setIndex((index + 1) % pool.length);
    }
    setFlipped(false);
  };

  if (pool.length === 0) return (
    <div style={styles.container}>
      <motion.div initial={{scale:0}} animate={{scale:1}} style={styles.card}>
        <h1>🏆 MÜKEMMEL!</h1>
        <p>100 Kelimenin hepsini tertemiz ettin.</p>
        <h2>Toplam Puan: {points}</h2>
        <button onClick={() => window.location.reload()} style={styles.btn}>Baştan Fethet</button>
      </motion.div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.badge}>Kalan: {pool.length}</div>
        <div style={styles.badge}>Puan: {points} 💰</div>
        <button onClick={() => setView(view === "learn" ? "quiz" : "learn")} style={styles.modeBtn}>
          {view === "learn" ? "🎯 Quiz'e Geç" : "📖 Kartlara Dön"}
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={pool.length + index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} style={styles.card}>
          {view === "learn" ? (
            <div onClick={() => setFlipped(!flipped)} style={styles.cardContent}>
              {!flipped ? <h1 style={styles.wordEng}>{current.eng}</h1> : 
              <div>
                <h2 style={styles.wordTr}>{current.tr}</h2>
                <p style={styles.wordEx}>{current.ex.replace("___", current.eng)}</p>
                <small>(Çevirmek için tıkla)</small>
              </div>}
            </div>
          ) : (
            <div style={styles.quizBox}>
              <h3 style={styles.quizTitle}>Boşluğu Doldur:</h3>
              <p style={styles.quizEx}>"{current.ex}"</p>
              <div style={styles.grid}>
                {current.opts.map(o => (
                  <button key={o} onClick={() => {
                    if(o === current.eng.toLowerCase()) { handleAction(true); } 
                    else { alert("Yanlış! Tekrar dene."); handleAction(false); }
                  }} style={styles.optBtn}>{o}</button>
                ))}
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
  container: { height: '100vh', background: '#1e272e', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: '"Poppins", sans-serif', padding: '20px' },
  header: { display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap', justifyContent: 'center' },
  badge: { background: '#485e6a', padding: '8px 20px', borderRadius: '25px', fontSize: '14px', fontWeight: 'bold' },
  modeBtn: { background: '#f1c40f', border: 'none', padding: '8px 20px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  card: { width: '100%', maxWidth: '360px', height: '420px', background: 'white', borderRadius: '40px', padding: '30px', color: '#2d3436', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' },
  wordEng: { fontSize: '54px', margin: 0, color: '#2d3436' },
  wordTr: { fontSize: '36px', color: '#341f97', margin: '0 0 10px 0' },
  wordEx: { fontSize: '18px', fontStyle: 'italic', color: '#636e72' },
  quizEx: { fontSize: '20px', fontWeight: '600', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' },
  optBtn: { padding: '15px', borderRadius: '15px', border: '2px solid #f1f2f6', background: '#f5f6fa', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  actions: { marginTop: '40px', display: 'flex', gap: '30px' },
  actionBtn: { padding: '18px 35px', borderRadius: '35px', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' },
  btn: { padding: '10px 25px', marginTop: '20px', borderRadius: '15px', border: 'none', background: '#55efc4', cursor: 'pointer', fontWeight: 'bold' }
};

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
