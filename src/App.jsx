import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";
import { db } from "./firebase"; 
import { doc, setDoc, getDoc } from "firebase/firestore";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [knownWordsInLevel, setKnownWordsInLevel] = useState(0);
  const [showMistakeList, setShowMistakeList] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentLevel = levels[levelIndex];
  const levelWords = useMemo(() => VOCABULARY_DB[currentLevel] || [], [currentLevel]);
  const currentData = levelWords[wordIndex];

  // ☁️ BULUTTAN VERİ ÇEK (Sadece Açılışta)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", "umut_user");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const d = docSnap.data();
          setScore(d.score || 0);
          setMistakes(d.mistakes || []);
          setLevelIndex(d.levelIndex || 0);
          setKnownWordsInLevel(d.knownWordsInLevel || 0);
        }
      } catch (e) { console.log("Bulut verisi henüz yok."); }
    };
    fetchData();
  }, []);

  // ☁️ BULUTA KAYDET (Her işlemde arka planda çalışır)
  const sync = (s, m, l, k) => {
    setDoc(doc(db, "users", "umut_user"), {
      score: s, mistakes: m, levelIndex: l, knownWordsInLevel: k, lastUpdate: new Date()
    });
  };

  const handleAction = (known) => {
    let nScore = score, nKnown = knownWordsInLevel, nMistakes = [...mistakes];
    
    if (known) {
      nScore += 10;
      nKnown += 1;
    } else {
      if (currentData && !mistakes.find(m => m.word === currentData.word)) {
        nMistakes.push({ word: currentData.word, meaning: currentData.meaning });
      }
    }

    setScore(nScore);
    setKnownWordsInLevel(nKnown);
    setMistakes(nMistakes);
    
    // Swipe yönünü belirle ve fırlat
    setDirection(known ? 1000 : -1000);

    // Senkronize et
    sync(nScore, nMistakes, levelIndex, nKnown);

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else {
        if (nKnown === levelWords.length) {
          alert("Tebrikler!");
          setLevelIndex(prev => prev + 1); setWordIndex(0); setKnownWordsInLevel(0);
        } else {
          setWordIndex(0); setKnownWordsInLevel(0);
        }
      }
    }, 300);
  };

  if (!currentData) return <div style={{background:"#0f172a", height:"100vh"}}></div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>{currentLevel} • {score} XP</div>
        <div>{knownWordsInLevel} / {levelWords.length}</div>
      </div>
      
      <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>LİSTEM ({mistakes.length})</button>

      <div style={s.cardWrapper}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentData.word}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100) handleAction(true);
              else if (info.offset.x < -100) handleAction(false);
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ x: direction, opacity: 0 }}
            style={s.card}
            onClick={() => setShowDetails(!showDetails)}
          >
            <h1 style={s.word}>{currentData.word}</h1>
            {showDetails && (
              <div style={s.details}>
                <h2 style={{color: "#22c55e"}}>{currentData.meaning}</h2>
                <p style={{color: "#94a3b8"}}>{currentData.hint}</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={s.footer}>
        <button onClick={() => handleAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleAction(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>

      {showMistakeList && (
        <div style={s.modal} onClick={() => setShowMistakeList(false)}>
          <div style={s.modalContent} onClick={e => e.stopPropagation()}>
            <h3>Kelimelerim</h3>
            {mistakes.map((m, i) => <div key={i} style={s.mItem}>{m.word}: {m.meaning}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { height: "100vh", background: "#0f172a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: 10, fontFamily: "sans-serif", overflow: "hidden" },
  header: { width: "100%", display: "flex", justifyContent: "space-between", padding: 20, background: "#1e293b", borderRadius: 15 },
  mistakeBtn: { marginTop: 10, background: "none", border: "1px solid #fbbf24", color: "#fbbf24", padding: "5px 15px", borderRadius: 20 },
  cardWrapper: { flex: 1, display: "flex", alignItems: "center", width: "100%", maxWidth: 350 },
  card: { width: "100%", background: "#1e293b", padding: 50, borderRadius: 30, textAlign: "center", border: "1px solid #334155" },
  word: { fontSize: 40, margin: 0 },
  details: { marginTop: 20 },
  footer: { display: "flex", gap: 10, width: "100%", maxWidth: 350, marginBottom: 20 },
  btn: (c) => ({ flex: 1, padding: 15, borderRadius: 12, border: `2px solid ${c}`, color: c, background: "none", fontWeight: "bold" }),
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" },
  modalContent: { background: "#1e293b", padding: 20, borderRadius: 15, width: "80%", maxHeight: "60vh", overflowY: "auto" },
  mItem: { padding: "10px 0", borderBottom: "1px solid #334155" }
};

export default App;
