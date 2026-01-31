import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VOCABULARY_DB } from "./words";
import { db } from "./firebase"; // Yeni oluşturduğun kapıyı bağladık
import { doc, setDoc, getDoc } from "firebase/firestore";

const App = () => {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const [levelIndex, setLevelIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [knownWordsInLevel, setKnownWordsInLevel] = useState(0);
  const [showMistakeList, setShowMistakeList] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCorrectSpeech, setIsCorrectSpeech] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const currentLevel = levels[levelIndex];
  const levelWords = useMemo(() => VOCABULARY_DB[currentLevel] || [], [currentLevel]);
  const currentData = levelWords[wordIndex];

  // ☁️ UYGULAMA AÇILDIĞINDA BULUTTAN VERİLERİ GETİR
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
      } catch (e) { console.log("Veri çekme hatası:", e); }
    };
    fetchData();
  }, []);

  // ☁️ HER HAREKETTE BULUTA KAYDET
  const syncToCloud = async (s, m, l, k) => {
    try {
      await setDoc(doc(db, "users", "umut_user"), {
        score: s, mistakes: m, levelIndex: l, knownWordsInLevel: k, lastUpdate: new Date()
      });
    } catch (e) { console.log("Kaydetme hatası:", e); }
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
        setTimeout(() => setIsCorrectSpeech(false), 2000);
      }
    };
    rec.onerror = () => setIsListening(false);
  };

  const handleManualAction = (known) => {
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

    // Buluta Gönder
    syncToCloud(nScore, nMistakes, levelIndex, nKnown);

    setTimeout(() => {
      setShowDetails(false);
      if (wordIndex + 1 < levelWords.length) {
        setWordIndex(prev => prev + 1);
      } else {
        if (nKnown === levelWords.length) {
          alert("Seviye Tamamlandı!");
          const nextLvl = levelIndex + 1;
          setLevelIndex(nextLvl); setWordIndex(0); setKnownWordsInLevel(0);
          syncToCloud(nScore, nMistakes, nextLvl, 0);
        } else {
          alert("Bazı kelimeleri bilmediğin için başa dönüyoruz!");
          setWordIndex(0); setKnownWordsInLevel(0);
        }
      }
    }, 300);
  };

  if (!currentData) return <div style={{color:"white", padding:20}}>Yükleniyor...</div>;

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div>{currentLevel} • {score} XP</div>
        <div>{knownWordsInLevel} / {levelWords.length}</div>
      </div>
      
      <button onClick={() => setShowMistakeList(true)} style={s.mistakeBtn}>
        ÇALIŞMA LİSTEM ({mistakes.length})
      </button>

      <div style={s.cardWrapper}>
        <motion.div key={currentData.word} style={s.card} 
          onClick={() => { setShowDetails(true); speakWord(currentData.word); listen(); }}>
          {isCorrectSpeech && <div style={s.tick}>✔</div>}
          <h1 style={{fontSize: 40}}>{currentData.word}</h1>
          {showDetails && (
            <div style={{marginTop: 20}}>
              <h2 style={{color: "#22c55e"}}>{currentData.meaning}</h2>
              <p style={{color: "#94a3b8", fontSize: 14}}>{currentData.hint}</p>
              {isListening && <p style={{color: "#fbbf24", fontWeight: "bold"}}>DİNLİYORUM...</p>}
            </div>
          )}
          {!showDetails && <p style={{fontSize: 12, opacity: 0.5, marginTop: 20}}>TIKLA VE KONUŞ</p>}
        </motion.div>
      </div>

      <div style={s.footer}>
        <button onClick={() => handleManualAction(false)} style={s.btn("#ef4444")}>BİLMİYORUM</button>
        <button onClick={() => handleManualAction(true)} style={s.btn("#22c55e")}>BİLİYORUM</button>
      </div>

      {showMistakeList && (
        <div style={s.modal}>
          <div style={s.modalContent}>
            <h3>Çalışılacak Kelimeler <button onClick={()=>setShowMistakeList(false)} style={{float:"right"}}>✕</button></h3>
            {mistakes.map((m,i) => (
              <div key={i} style={{padding:10, borderBottom:"1px solid #334155"}}>
                <strong>{m.word}</strong>: {m.meaning}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  container: { height: "100vh", background: "#0f172a", color: "white", display: "flex", flexDirection: "column", alignItems: "center", padding: 10, fontFamily: "sans-serif", overflow: "hidden" },
  header: { width: "100%", display: "flex", justifyContent: "space-between", padding: 15, background: "#1e293b", borderRadius: 10 },
  mistakeBtn: { marginTop: 15, background: "none", border: "1px solid #fbbf24", color: "#fbbf24", padding: "5px 15px", borderRadius: 20, fontSize: 12 },
  cardWrapper: { flex: 1, display: "flex", alignItems: "center", width: "100%", maxWidth: 350 },
  card: { width: "100%", background: "#1e293b", padding: 40, borderRadius: 25, textAlign: "center", border: "1px solid #334155", position: "relative", cursor: "pointer" },
  tick: { position: "absolute", top: 15, right: 15, color: "#22c55e", fontSize: 40 },
  footer: { display: "flex", gap: 10, width: "100%", maxWidth: 350, marginBottom: 20 },
  btn: (c) => ({ flex: 1, padding: 18, borderRadius: 15, border: `2px solid ${c}`, color: c, background: "none", fontWeight: "bold", cursor: "pointer" }),
  modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.9)", zIndex: 100, padding: 20 },
  modalContent: { background: "#1e293b", padding: 20, borderRadius: 15, maxHeight: "80vh", overflowY: "auto" }
};

export default App;
