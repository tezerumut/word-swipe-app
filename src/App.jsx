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
  { eng: "Active", tr: "Aktif", ex: "She leads an ___ life.", opts: ["active", "actual", "across", "actor"] },
  { eng: "Almost", tr: "Neredeyse", ex: "I'm ___ finished.", opts: ["almost", "already", "always", "alone"] },
  { eng: "Amount", tr: "Miktar", ex: "A large ___ of water.", opts: ["amount", "among", "angry", "animal"] },
  { eng: "Animal", tr: "Hayvan", ex: "What is your favorite ___?", opts: ["animal", "angry", "another", "answer"] },
  { eng: "Answer", tr: "Cevap", ex: "I don't know the ___.", opts: ["answer", "another", "anyway", "appear"] },
  { eng: "Anyway", tr: "Her neyse", ex: "___, let's go.", opts: ["anyway", "anyone", "anywhere", "appear"] },
  { eng: "Appear", tr: "Görünmek", ex: "New stars ___ at night.", opts: ["appear", "apple", "apply", "area"] },
  { eng: "Around", tr: "Etrafında", ex: "Look ___ you.", opts: ["around", "arrive", "artist", "army"] },
  { eng: "Basic", tr: "Temel", ex: "It's a ___ need.", opts: ["basic", "basis", "basket", "battle"] },
  { eng: "Become", tr: "Olmak (dönüşmek)", ex: "He wants to ___ a doctor.", opts: ["become", "before", "begin", "behind"] },
  { eng: "Behind", tr: "Arkasında", ex: "The cat is ___ the door.", opts: ["behind", "below", "beside", "between"] },
  { eng: "Beside", tr: "Yanında", ex: "Sit ___ me.", opts: ["beside", "besides", "between", "beyond"] },
  { eng: "Between", tr: "Arasında", ex: "I'm ___ two jobs.", opts: ["between", "beyond", "behind", "below"] },
  { eng: "Bottle", tr: "Şişe", ex: "Pass the ___ of water.", opts: ["bottle", "bottom", "bought", "borrow"] },
  { eng: "Bottom", tr: "Alt", ex: "Sign at the ___.", opts: ["bottom", "bottle", "bought", "borrow"] },
  { eng: "Bright", tr: "Parlak", ex: "The sun is ___.", opts: ["bright", "bridge", "bring", "brave"] },
  { eng: "Bridge", tr: "Köprü", ex: "Cross the ___.", opts: ["bridge", "bright", "bring", "brave"] },
  { eng: "Build", tr: "İnşa etmek", ex: "They will ___ a house.", opts: ["build", "busy", "button", "business"] },
  { eng: "Busy", tr: "Meşgul", ex: "I am very ___ today.", opts: ["busy", "build", "button", "business"] },
  { eng: "Camera", tr: "Kamera", ex: "Look at the ___.", opts: ["camera", "cancel", "career", "careful"] },
  { eng: "Cancel", tr: "İptal etmek", ex: "Don't ___ the meeting.", opts: ["cancel", "camera", "career", "careful"] },
  { eng: "Center", tr: "Merkez", ex: "Go to the city ___.", opts: ["center", "certain", "change", "charge"] },
  { eng: "Certain", tr: "Emin", ex: "Are you ___?", opts: ["certain", "center", "change", "charge"] },
  { eng: "Change", tr: "Değiştirmek", ex: "Time to ___.", opts: ["change", "charge", "cheap", "check"] },
  { eng: "Cheap", tr: "Ucuz", ex: "It's very ___.", opts: ["cheap", "check", "charge", "change"] },
  { eng: "Check", tr: "Kontrol etmek", ex: "___ your work.", opts: ["check", "cheap", "charge", "change"] },
  { eng: "Choice", tr: "Seçim", ex: "You have a ___.", opts: ["choice", "choose", "church", "circle"] },
  { eng: "Circle", tr: "Daire", ex: "Draw a ___.", opts: ["circle", "church", "city", "clear"] },
  { eng: "City", tr: "Şehir", ex: "Istanbul is a big ___.", opts: ["city", "circle", "church", "clear"] },
  { eng: "Clear", tr: "Açık/Net", ex: "Is that ___?", opts: ["clear", "clean", "clever", "climb"] },
  { eng: "Clever", tr: "Zeki", ex: "He is a ___ boy.", opts: ["clever", "clean", "clear", "climb"] },
  { eng: "Climb", tr: "Tırmanmak", ex: "___ the mountain.", opts: ["climb", "clean", "clear", "clever"] },
  { eng: "Common", tr: "Ortak/Yaygın", ex: "A ___ problem.", opts: ["common", "college", "color", "collect"] },
  { eng: "Company", tr: "Şirket", ex: "I work for a ___.", opts: ["company", "compare", "complete", "confirm"] },
  { eng: "Complete", tr: "Tamamlamak", ex: "___ the form.", opts: ["complete", "compare", "company", "confirm"] },
  { eng: "Control", tr: "Kontrol", ex: "Out of ___.", opts: ["control", "confirm", "connect", "contact"] },
  { eng: "Corner", tr: "Köşe", ex: "Wait at the ___.", opts: ["corner", "correct", "cost", "could"] },
  { eng: "Correct", tr: "Doğru", ex: "That is ___.", opts: ["correct", "corner", "cost", "could"] },
  { eng: "Country", tr: "Ülke", ex: "Which ___ are you from?", opts: ["country", "course", "court", "cover"] },
  { eng: "Course", tr: "Kurs/Ders", ex: "An English ___.", opts: ["course", "country", "court", "cover"] },
  { eng: "Danger", tr: "Tehlike", ex: "Keep out of ___.", opts: ["danger", "daily", "dark", "daughter"] },
  { eng: "Dark", tr: "Karanlık", ex: "It's getting ___.", opts: ["dark", "danger", "daily", "daughter"] },
  { eng: "Daughter", tr: "Kız evlat", ex: "My ___ is 5.", opts: ["daughter", "danger", "daily", "dark"] },
  { eng: "Design", tr: "Tasarım", ex: "I like the ___.", opts: ["design", "describe", "destroy", "detail"] }
];

export default function OxfordApp() {
  const [user, setUser] = useState(localStorage.getItem("username") || "");
  const [pool, setPool] = useState(() => {
    const saved = localStorage.getItem("pool");
    return saved ? JSON.parse(saved) : OXFORD_100;
  });
  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem("points")) || 0;
  });
  const [view, setView] = useState("learn");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("pool", JSON.stringify(pool));
  }, [points, pool]);

  const handleLogin = (e) => {
    e.preventDefault();
    const name = e.target.username.value;
    setUser(name);
    localStorage.setItem("username", name);
  };

  const handleAction = (isCorrect) => {
    if (isCorrect) {
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      setPoints(p => p + 10);
      if (index >= newPool.length) setIndex(0);
    } else {
      setIndex((index + 1) % pool.length);
    }
    setFlipped(false);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <motion.div initial={{scale:0.8}} animate={{scale:1}} style={styles.card}>
          <h1 style={{fontSize:'28px', color:'#2d3436', marginBottom:'10px'}}>Kelime Avcısı 🎯</h1>
          <p style={{color:'#636e72', marginBottom:'30px'}}>İlerlemeni kaydetmek için adını yaz:</p>
          <form onSubmit={handleLogin} style={{display:'flex', flexDirection:'column', gap:'15px', width:'100%'}}>
            <input name="username" placeholder="İsmin nedir?" required style={styles.input} />
            <button type="submit" style={styles.loginBtn}>Öğrenmeye Başla</button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (pool.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🏆 Tebrikler {user}!</h1>
          <p>Tüm 100 kelimeyi öğrendin!</p>
          <h2>Puanın: {points}</h2>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} style={styles.loginBtn}>Baştan Başla</button>
        </div>
      </div>
    );
  }

  const current = pool[index];

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div style={styles.badge}>👤 {user}</div>
        <div style={{...styles.badge, background:'#f1c40f', color:'black'}}>Puan: {points}</div>
        <div style={styles.badge}>Kalan: {pool.length}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={pool.length + index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} style={styles.card}>
          {view === "learn" ? (
            <div onClick={() => setFlipped(!flipped)} style={{width:'100%', height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', cursor:'pointer'}}>
              {!flipped ? <h1 style={{fontSize:'50px'}}>{current.eng}</h1> : 
              <div>
                <h2 style={{color:'#4834d4', fontSize:'32px'}}>{current.tr}</h2>
                <p style={{fontStyle:'italic', color:'#636e72', marginTop:'20px'}}>{current.ex.replace("___", current.eng)}</p>
                <small style={{display:'block', marginTop:'30px', color:'#b2bec3'}}>Dönmek için tıkla</small>
              </div>}
            </div>
          ) : (
            <div style={{width:'100%'}}>
              <p style={{fontSize:'20px', fontWeight:'bold', marginBottom:'30px'}}>{current.ex}</p>
              <div style={styles.grid}>
                {current.opts.map(o => (
                  <button key={o} onClick={() => {
                    if(o === current.eng.toLowerCase()) handleAction(true);
                    else alert("Yanlış! Tekrar dene.");
                  }} style={styles.optBtn}>{o}</button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div style={styles.bottomNav}>
        <button onClick={() => setView(view === 'learn' ? 'quiz' : 'learn')} style={styles.modeBtn}>
          {view === 'learn' ? '🎯 Quiz Moduna Geç' : '📖 Kartlara Dön'}
        </button>
        {view === 'learn' && (
          <div style={{display:'flex', gap:'20px', marginTop:'20px'}}>
            <button onClick={() => handleAction(false)} style={{...styles.actionBtn, background:'#ff7675'}}>Zor ✕</button>
            <button onClick={() => handleAction(true)} style={{...styles.actionBtn, background:'#55efc4'}}>Biliyorum ✓</button>
          </div>
        )}
      </div>
      <button onClick={() => {if(confirm('Çıkış yapılsın mı?')) {localStorage.clear(); window.location.reload();}}} style={styles.exitLink}>Hesabı Sıfırla / Çıkış</button>
    </div>
  );
}

const styles = {
  container: { height: '100vh', background: '#2d3436', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' },
  topBar: { position: 'absolute', top: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent:'center' },
  badge: { background: '#485e6a', padding: '8px 15px', borderRadius: '20px', color: 'white', fontSize: '14px', fontWeight: 'bold' },
  card: { background: 'white', padding: '30px', borderRadius: '40px', width: '100%', maxWidth: '360px', height: '420px', textAlign: 'center', display: 'flex', flexDirection:'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.4)' },
  input: { padding: '15px', borderRadius: '15px', border: '2px solid #dfe6e9', fontSize: '18px', outline: 'none' },
  loginBtn: { padding: '15px', background: '#55efc4', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%' },
  optBtn: { padding: '15px', borderRadius: '15px', border: '1px solid #dfe6e9', background: '#f5f6fa', fontWeight: 'bold', cursor: 'pointer' },
  bottomNav: { marginTop: '30px', textAlign: 'center' },
  modeBtn: { background: '#f1c40f', border: 'none', padding: '10px 25px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer' },
  actionBtn: { padding: '15px 35px', borderRadius: '20px', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' },
  exitLink: { position:'absolute', bottom:'20px', background:'none', border:'none', color:'#636e72', cursor:'pointer', textDecoration:'underline' }
};
