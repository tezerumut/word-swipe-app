import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  { eng: "Arrange", tr: "Düzenlemek", ex: "I'll ___ the meeting.", opts: ["arrange", "arrive", "art", "army"] },
  { eng: "Arrive", tr: "Varmak", ex: "We will ___ at 5 PM.", opts: ["arrive", "arrange", "area", "army"] },
  { eng: "Artist", tr: "Sanatçı", ex: "She is a talented ___.", opts: ["artist", "art", "army", "area"] },
  { eng: "Avoid", tr: "Kaçınmak", ex: "You should ___ junk food.", opts: ["avoid", "advice", "agree", "allow"] },
  { eng: "Believe", tr: "İnanmak", ex: "I ___ in your success.", opts: ["believe", "become", "begin", "below"] },
  { eng: "Benefit", tr: "Fayda", ex: "The new law will ___ us.", opts: ["benefit", "behind", "believe", "below"] },
  { eng: "Borrow", tr: "Ödünç almak", ex: "Can I ___ your pen?", opts: ["borrow", "bottle", "bottom", "bought"] },
  { eng: "Brave", tr: "Cesur", ex: "He is a ___ soldier.", opts: ["brave", "bright", "bridge", "bring"] },
  { eng: "Business", tr: "İş", ex: "How is your ___ going?", opts: ["business", "busy", "build", "button"] },
  { eng: "Careful", tr: "Dikkatli", ex: "Be ___ with the glass.", opts: ["careful", "camera", "cancel", "career"] },
  { eng: "Celebrate", tr: "Kutlamak", ex: "Let's ___ your birthday.", opts: ["celebrate", "center", "certain", "change"] },
  { eng: "Chance", tr: "Şans", ex: "Give me one more ___.", opts: ["chance", "change", "charge", "cheap"] },
  { eng: "Choose", tr: "Seçmek", ex: "Please ___ a color.", opts: ["choose", "church", "circle", "city"] },
  { eng: "Clean", tr: "Temiz", ex: "Keep your room ___.", opts: ["clean", "clear", "clever", "climb"] },
  { eng: "Collect", tr: "Toplamak", ex: "I ___ old coins.", opts: ["collect", "college", "color", "common"] },
  { eng: "Compare", tr: "Karşılaştırmak", ex: "Don't ___ yourself to others.", opts: ["compare", "company", "complete", "confirm"] },
  { eng: "Confirm", tr: "Onaylamak", ex: "Please ___ your email.", opts: ["confirm", "connect", "contact", "control"] },
  { eng: "Create", tr: "Yaratmak", ex: "We must ___ new jobs.", opts: ["create", "credit", "crime", "cross"] },
  { eng: "Daily", tr: "Günlük", ex: "Check your ___ schedule.", opts: ["daily", "danger", "dark", "daughter"] },
  { eng: "Decision", tr: "Karar", ex: "It's a hard ___ to make.", opts: ["decision", "degree", "deliver", "demand"] },
  { eng: "Describe", tr: "Tanımlamak", ex: "Can you ___ the man?", opts: ["describe", "design", "destroy", "detail"] },
  { eng: "Difference", tr: "Fark", ex: "What is the ___?", opts: ["difference", "difficult", "dinner", "direction"] },
  { eng: "Direct", tr: "Doğrudan", ex: "It's a ___ flight.", opts: ["direct", "dirty", "discuss", "distance"] },
  { eng: "Discover", tr: "Keşfetmek", ex: "They will ___ new lands.", opts: ["discover", "discuss", "disease", "distance"] },
  { eng: "During", tr: "Süresince", ex: "Stay quiet ___ the test.", opts: ["during", "duty", "drive", "dream"] },
  { eng: "Education", tr: "Eğitim", ex: "___ is the key to success.", opts: ["education", "effect", "effort", "election"] },
  { eng: "Enjoy", tr: "Zevk almak", ex: "I ___ listening to music.", opts: ["enjoy", "enough", "entire", "escape"] },
  { eng: "Environment", tr: "Çevre", ex: "Protect the ___.", opts: ["environment", "equipment", "escape", "event"] },
  { eng: "Experience", tr: "Deneyim", ex: "Do you have any ___?", opts: ["experience", "expensive", "explain", "express"] },
  { eng: "Factory", tr: "Fabrika", ex: "He works in a ___.", opts: ["factory", "family", "famous", "fashion"] },
  { eng: "Foreign", tr: "Yabancı", ex: "I love ___ movies.", opts: ["foreign", "forest", "forget", "formal"] },
  { eng: "General", tr: "Genel", ex: "In ___ , people are kind.", opts: ["general", "gentle", "gift", "glass"] },
  { eng: "Happen", tr: "Olmak", ex: "What will ___ next?", opts: ["happen", "happy", "hard", "health"] },
  { eng: "Improve", tr: "Geliştirmek", ex: "I want to ___ my English.", opts: ["improve", "include", "increase", "indeed"] },
  { eng: "Knowledge", tr: "Bilgi", ex: "___ is power.", opts: ["knowledge", "kitchen", "keyboard", "knock"] },
  { eng: "Listen", tr: "Dinlemek", ex: "Please ___ to me.", opts: ["listen", "little", "local", "lucky"] },
  { eng: "Manage", tr: "Yönetmek", ex: "Can you ___ this project?", opts: ["manage", "market", "matter", "measure"] },
  { eng: "Necessary", tr: "Gerekli", ex: "It is ___ to sleep.", opts: ["necessary", "neighbor", "neither", "network"] },
  { eng: "Opportunity", tr: "Fırsat", ex: "It's a great ___.", opts: ["opportunity", "opposite", "option", "ordinary"] },
  { eng: "Prepare", tr: "Hazırlamak", ex: "___ for the exam.", opts: ["prepare", "present", "prevent", "private"] },
  { eng: "Reason", tr: "Sebep", ex: "What is the ___?", opts: ["reason", "receive", "recent", "record"] },
  { eng: "Success", tr: "Başarı", ex: "Hard work leads to ___.", opts: ["success", "support", "surface", "system"] },
  { eng: "Travel", tr: "Seyahat etmek", ex: "I love to ___.", opts: ["travel", "train", "trade", "traffic"] },
  { eng: "Understand", tr: "Anlamak", ex: "Do you ___?", opts: ["understand", "until", "unit", "usual"] },
  { eng: "Village", tr: "Köy", ex: "I live in a small ___.", opts: ["village", "visit", "voice", "view"] },
  { eng: "Weather", tr: "Hava", ex: "The ___ is nice today.", opts: ["weather", "weight", "welcome", "western"] },
  { eng: "Young", tr: "Genç", ex: "She is a ___ woman.", opts: ["young", "yesterday", "yellow", "yard"] },
  { eng: "Design", tr: "Tasarım", ex: "I like the ___.", opts: ["design", "describe", "destroy", "detail"] }
];

// Yardımcı fonksiyon: Şıkları karıştırırken doğru cevabın indexini kontrol eder
const getSmartOptions = (wordObj, lastCorrectIndex) => {
  let options = [...wordObj.opts];
  let correctValue = wordObj.eng.toLowerCase();
  
  // Şıkları karıştır
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  const currentCorrectIndex = options.indexOf(correctValue);

  // Eğer doğru şık yine aynı yerdeyse, bir sağa kaydır (ezber bozma)
  if (currentCorrectIndex === lastCorrectIndex) {
    const nextIndex = (currentCorrectIndex + 1) % 4;
    [options[currentCorrectIndex], options[nextIndex]] = [options[nextIndex], options[currentCorrectIndex]];
  }
  
  return options;
};

export default function WordMasterApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => JSON.parse(localStorage.getItem("pool")) || OXFORD_100);
  const [points, setPoints] = useState(() => parseInt(localStorage.getItem("points")) || 0);
  const [view, setView] = useState("learn");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shake, setShake] = useState(false);
  const [lastCorrectIdx, setLastCorrectIdx] = useState(-1);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("pool", JSON.stringify(pool));
  }, [points, pool]);

  const handleAction = (isCorrect, selectedIdx = -1) => {
    if (isCorrect) {
      if (selectedIdx !== -1) setLastCorrectIdx(selectedIdx);
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
    localStorage.clear();
    window.location.reload();
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} style={styles.card}>
          <h1 style={{fontSize:'32px', color:'#2d3436'}}>Kelime Avcısı 🎯</h1>
          <form onSubmit={(e) => { e.preventDefault(); setUser(e.target.username.value); localStorage.setItem("username", e.target.username.value); }} style={{width:'100%', display:'flex', flexDirection:'column', gap:'15px'}}>
            <input name="username" placeholder="İsminizi yazın..." required style={styles.input} />
            <button type="submit" style={styles.loginBtn}>Başla</button>
          </form>
        </motion.div>
      </div>
    );
  }

  const current = pool[index];
  const progress = ((OXFORD_100.length - pool.length) / OXFORD_100.length) * 100;
  const smartOptions = current ? getSmartOptions(current, lastCorrectIdx) : [];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.userInfo}>
          <span style={styles.userBadge}>👤 {user}</span>
          <span style={styles.scoreBadge}>💰 {points}</span>
        </div>
        <button onClick={() => {if(confirm("İsim ekranına dönmek istiyor musun?")) fullReset();}} style={styles.resetBtn}>✕ Çıkış</button>
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
                {!flipped ? <h1 style={{fontSize:'45px'}}>{current.eng}</h1> : 
                <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 style={{color:'#4834d4', fontSize:'32px'}}>{current.tr}</h2>
                  <p style={styles.example}>{current.ex.replace("___", current.eng)}</p>
                </motion.div>}
                <small style={{color:'#b2bec3', marginTop:'20px'}}>Çevirmek için dokun</small>
              </div>
            ) : (
              <div style={{width:'100%'}}>
                <p style={styles.quizQuestion}>{current.ex}</p>
                <div style={styles.quizGrid}>
                  {smartOptions.map((o, i) => (
                    <button key={i} onClick={() => handleAction(o === current.eng.toLowerCase(), i)} style={styles.optBtn}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <div style={styles.card}>
            <h1>🏆 OYUN BİTTİ!</h1>
            <p>100 Kelimeyi fethettin {user}!</p>
            <button onClick={fullReset} style={styles.loginBtn}>Başa Dön (Giriş)</button>
          </div>
        )}
      </AnimatePresence>

      <div style={styles.footer}>
        <button onClick={() => setView(view === 'learn' ? 'quiz' : 'learn')} style={styles.modeBtn}>
          {view === 'learn' ? '🎯 Quiz Modu' : '📖 Öğrenme Modu'}
        </button>
        {view === 'learn' && pool.length > 0 && (
          <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
            <button onClick={() => handleAction(false)} style={styles.skipBtn}>Zor ✕</button>
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
  userInfo: { display: 'flex', gap: '8px' },
  userBadge: { background: '#485e6a', padding: '6px 12px', borderRadius: '15px', color: 'white', fontWeight: 'bold', fontSize: '12px' },
  scoreBadge: { background: '#f1c40f', padding: '6px 12px', borderRadius: '15px', color: '#000', fontWeight: 'bold', fontSize: '12px' },
  resetBtn: { background: '#ff7675', border: 'none', color: 'white', padding: '6px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' },
  progressContainer: { width: '80%', maxWidth: '350px', height: '18px', background: '#34495e', borderRadius: '10px', marginBottom: '25px', position: 'relative', overflow: 'hidden' },
  progressBar: { height: '100%', background: '#55efc4', transition: 'width 0.5s ease' },
  progressText: { position: 'absolute', width: '100%', textAlign: 'center', fontSize: '10px', top: '3px', color: 'white', fontWeight: 'bold' },
  card: { background: 'white', padding: '30px', borderRadius: '40px', width: '100%', maxWidth: '360px', height: '420px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' },
  cardInner: { cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  example: { fontStyle: 'italic', color: '#636e72', marginTop: '15px', fontSize: '17px' },
  quizQuestion: { fontSize: '19px', fontWeight: 'bold', color: '#2d3436', marginBottom: '20px' },
  quizGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' },
  optBtn: { padding: '14px', borderRadius: '15px', border: '1px solid #dfe6e9', background: '#f5f6fa', fontWeight: 'bold', cursor: 'pointer' },
  footer: { marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  modeBtn: { background: '#0984e3', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer' },
  skipBtn: { padding: '14px 25px', borderRadius: '15px', border: 'none', background: '#b2bec3', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  doneBtn: { padding: '14px 25px', borderRadius: '15px', border: 'none', background: '#55efc4', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  input: { padding: '15px', borderRadius: '15px', border: '2px solid #eee', fontSize: '18px', outline: 'none' },
  loginBtn: { padding: '15px', background: '#55efc4', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }
};
