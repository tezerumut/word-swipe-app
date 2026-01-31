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
  const [isListening, setIsListening] = useState(false);
  const [isCorrectSpeech, setIsCorrectSpeech] = useState(false);

  const currentLevel = levels[levelIndex];
  const levelWords = useMemo(() => VOCABULARY_DB[currentLevel] || [], [currentLevel]);
  const currentData = levelWords[wordIndex];

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
      } catch (e) { console.log("Bulut verisi hazır."); }
    };
    fetchData();
  }, []);

  const sync = (s, m, l, k) => {
    setDoc(doc(db, "users", "umut_user"), {
      score: s, mistakes: m, levelIndex: l, knownWordsInLevel: k, lastUpdate: new Date()
    });
  };

  const speakWord = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.speak(u);
  };

  const listen = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;
    const rec = new SpeechRec();
    rec.lang = "en-US";
    rec.start();
    setIsListening(true);
    rec.onresult = (e) => {
      const res = e.results[0][0].transcript.toUpperCase();
      setIsListening(false);
      if (currentData && res.includes(currentData.word.toUpperCase())) {
        setIsCorrectSpeech(true);
        setTimeout(() => setIsCorrectSpeech(false), 1500);
      }
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
  };

  const handleAction = (known) => {
    let nScore = score, nKnown = knownWordsInLevel, nMistakes = [...mistakes];
    if (known) { nScore += 10; nKnown += 1; }
    else if (!mistakes.find(m => m.word === currentData.word)) {
      nMistakes.push({ word: currentData.word, meaning: currentData.meaning });
    }

    setScore(nScore); setKnownWordsInLevel(nKnown); setMistakes(nMistakes);
    setDirection(known ? 1000 : -1000);
    sync(nScore, nMistakes, levelIndex, nKnown);

    setTimeout(() => {
      setDirection(0);
      setShowDetails(false);
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else {
        setWordIndex(0); setKnownWordsInLevel(0);
      }
    }, 300);
  };

  if (!currentData) return <div style={s.loader}>Yükleniyor...</div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={{fontSize: 18, fontWeight: "bold"}}>{currentLevel} • {score} XP</div>
        <div style={{opacity: 0.8}}>{knownWordsInLevel} / {levelWords.length}</div>
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
            onClick={() => { 
              if(!showDetails) { setShowDetails(true); speakWord(currentData.word); listen(); }
              else { speakWord(currentData.word); }
            }}
          >
            {isCorrectSpeech && <div style={s.tick}>✔</div>}
            <h1 style={s.word}>{currentData.word}</h1>
            
            {showDetails && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} style={s.details}>
                <h2 style={{color: "#22c55e", margin: "10px 0"}}>{currentData.meaning}</h2>
                <p style={s.hintText}>{currentData.hint}</p>
                
                {/* BURASI ÇOK ÖNEMLİ: EKRANDA GÖRMEN GEREKEN KUTU */}
                <div style={s.sentenceBox}>
                   <p style={s.sentenceEn}>"{currentData.example}"</p>
                </div>
                
                {isListening && <p style={s.listeningTag}>DİNLİYORUM...</p>}
              </motion.div>
            )}
            {!showDetails && <p style={s.tapHint}>TIKLA & KONUŞ • KAYDIR</p>}
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
            <h3>Yanlışlarım</h3>
            {mistakes.map((m, i) => <div key={i} style={s.mItem}>{m.word}: {m.meaning}</div>)}
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { height: "100vh", background: "#0f172a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 20px", fontFamily: "sans-serif", overflow: "hidden" },
  header: { width: "100%", maxWidth: 400, display: "flex", justifyContent: "space-between", padding: "20px 0" },
  mistakeBtn: { background: "rgba(251, 191, 36, 0.1)", border: "1px solid #fbbf24", color: "#fbbf24", padding: "8px 20px", borderRadius: 25, fontSize: 12 },
  cardWrapper: { flex: 1, display: "flex", alignItems: "center", width: "100%", maxWidth: 380 },
  card: { width: "100%", background: "#1e293b", padding: "40px 30px", borderRadius: 35, textAlign: "center", border: "1px solid #334155", position: "relative" },
  word: { fontSize: 40, margin: 0, fontWeight: "800" },
  tick: { position: "absolute", top: 15, right: 20, color: "#22c55e", fontSize: 40 },
  tapHint: { fontSize: 12, color: "#38bdf8", opacity: 0.6, marginTop: 40 },
  details: { marginTop: 20 },
  hintText: { color: "#94a3b8", fontSize: 14, fontStyle: "italic" },
  sentenceBox: { marginTop: 20, padding: 15, background: "rgba(255, 255, 255, 0.05)", borderRadius: 15, border: "1px solid #334155" },
  sentenceEn: { color: "#f8fafc", fontSize: 15, margin: 0, fontWeight: "500", fontStyle: "italic" },
  listeningTag: { color: "#fbbf24", fontSize: 12, fontWeight: "bold", marginTop: 15 },
  footer: { display: "flex", gap: 15, width: "100%", maxWidth: 400, marginBottom: 30 },
  btn: (c) => ({ flex: 1, padding: 20, borderRadius: 18, border: `2px solid ${c}`, color: c, background: "none", fontWeight: "bold" }),
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.85)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center" },
  modalContent: { background: "#1e293b", padding: 30, borderRadius: 25, width: "85%", maxHeight: "60vh", overflowY: "auto" },
  mItem: { padding: "10px 0", borderBottom: "1px solid #334155" },
  loader: { height: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center" }
};

export default App;
