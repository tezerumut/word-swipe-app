import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OXFORD_DATA = {
  "A1-A2 (Başlangıç)": [
    { eng: "Ability", tr: "Yetenek", ex: "She has the ability to pass the exam." },
    { eng: "Abandon", tr: "Terk etmek", ex: "Never abandon your dreams." },
    { eng: "Absolute", tr: "Kesin", ex: "It is the absolute truth." },
    { eng: "Academic", tr: "Akademik", ex: "A successful academic career." },
    { eng: "Accept", tr: "Kabul etmek", ex: "I accept your invitation." },
    { eng: "Accompany", tr: "Eşlik etmek", ex: "May I accompany you?" },
    { eng: "Account", tr: "Hesap", ex: "I need to open a bank account." },
    { eng: "Accurate", tr: "Doğru", ex: "This map is very accurate." },
    { eng: "Achieve", tr: "Başarmak", ex: "You can achieve anything." },
    { eng: "Across", tr: "Karşıdan karşıya", ex: "The cat ran across the street." },
    { eng: "Act", tr: "Hareket etmek", ex: "You must act quickly." },
    { eng: "Active", tr: "Aktif", ex: "She is very active in sports." },
    { eng: "Actual", tr: "Gerçek", ex: "The actual cost was higher." },
    { eng: "Adapt", tr: "Uyum sağlamak", ex: "It's hard to adapt to a new city." },
    { eng: "Add", tr: "Eklemek", ex: "Add some salt to the soup." },
    { eng: "Address", tr: "Adres", ex: "What is your home address?" },
    { eng: "Adjust", tr: "Ayarlamak", ex: "Adjust the seat height." },
    { eng: "Admire", tr: "Hayran olmak", ex: "I admire your courage." },
    { eng: "Admit", tr: "Kabul etmek", ex: "He admitted he was wrong." },
    { eng: "Adopt", tr: "Evlat edinmek", ex: "They decided to adopt a child." },
    { eng: "Adult", tr: "Yetişkin", ex: "This movie is for adults." },
    { eng: "Advance", tr: "İlerlemek", ex: "Technology is advancing fast." },
    { eng: "Advantage", tr: "Avantaj", ex: "Being tall is an advantage." },
    { eng: "Adventure", tr: "Macera", ex: "I love adventure stories." },
    { eng: "Advice", tr: "Tavsiye", ex: "Can you give me some advice?" },
    { eng: "Afford", tr: "Maddi gücü yetmek", ex: "I can't afford a new car." },
    { eng: "Afraid", tr: "Korkmuş", ex: "Don't be afraid of the dark." },
    { eng: "After", tr: "Sonra", ex: "I will call you after work." },
    { eng: "Afternoon", tr: "Öğleden sonra", ex: "See you this afternoon." },
    { eng: "Again", tr: "Tekrar", ex: "Can you say that again?" },
    { eng: "Against", tr: "Karşı", ex: "We are playing against them." },
    { eng: "Age", tr: "Yaş", ex: "What is your age?" },
    { eng: "Agency", tr: "Ajans", ex: "He works for an agency." },
    { eng: "Agent", tr: "Ajan, temsilci", ex: "Call our travel agent." },
    { eng: "Agree", tr: "Aynı fikirde olmak", ex: "I agree with you." },
    { eng: "Agriculture", tr: "Tarım", ex: "Agriculture is important." },
    { eng: "Ahead", tr: "İleride", ex: "The road ahead is clear." },
    { eng: "Aim", tr: "Hedef, amaç", ex: "My aim is to learn English." },
    { eng: "Air", tr: "Hava", ex: "Fresh air is good for you." },
    { eng: "Aircraft", tr: "Hava taşıtı", ex: "The aircraft landed safely." },
    { eng: "Airport", tr: "Havalimanı", ex: "I'm going to the airport." },
    { eng: "Alarm", tr: "Alarm", ex: "The alarm went off at 7 AM." },
    { eng: "Alive", tr: "Hayatta, canlı", ex: "Is that spider still alive?" },
    { eng: "All", tr: "Hepsi", ex: "All my friends are here." },
    { eng: "Allow", tr: "İzin vermek", ex: "I can't allow you to do that." },
    { eng: "Almost", tr: "Neredeyse", ex: "I am almost finished." },
    { eng: "Alone", tr: "Yalnız", ex: "She likes living alone." },
    { eng: "Along", tr: "Boyunca", ex: "We walked along the beach." },
    { eng: "Already", tr: "Çoktan", ex: "I have already eaten." },
    { eng: "Also", tr: "Ayrıca", ex: "She is also a doctor." },
    { eng: "Always", tr: "Her zaman", ex: "I always drink tea." },
    { eng: "Amazing", tr: "Şaşırtıcı", ex: "The view is amazing." },
    { eng: "Ambitious", tr: "Hırslı", ex: "He is an ambitious student." },
    { eng: "Among", tr: "Arasında", ex: "He was among the crowd." },
    { eng: "Amount", tr: "Miktar", ex: "A large amount of money." },
    { eng: "Ancient", tr: "Antik", ex: "I love ancient history." },
    { eng: "Anger", tr: "Öfke", ex: "He couldn't hide his anger." },
    { eng: "Angle", tr: "Açı", ex: "Look at it from another angle." },
    { eng: "Angry", tr: "Kızgın", ex: "Why are you angry?" },
    { eng: "Animal", tr: "Hayvan", ex: "What's your favorite animal?" },
    { eng: "Announce", tr: "Duyurmak", ex: "They announced the winners." },
    { eng: "Annoy", tr: "Rahatsız etmek", ex: "Stop annoying your sister." },
    { eng: "Annual", tr: "Yıllık", ex: "Our annual meeting is today." },
    { eng: "Another", tr: "Başka", ex: "Can I have another cup?" },
    { eng: "Answer", tr: "Cevap", ex: "I don't know the answer." },
    { eng: "Anxiety", tr: "Kaygı", ex: "He suffers from anxiety." },
    { eng: "Anxious", tr: "Endişeli", ex: "She is anxious about the test." },
    { eng: "Any", tr: "Hiç, herhangi", ex: "Do you have any questions?" },
    { eng: "Anyway", tr: "Her neyse", ex: "Anyway, let's go." },
    { eng: "Apart", tr: "Ayrı", ex: "The two houses are far apart." },
    { eng: "Apartment", tr: "Apartman dairesi", ex: "My apartment is small." },
    { eng: "Apologize", tr: "Özür dilemek", ex: "You should apologize." },
    { eng: "Apparent", tr: "Görünürde, bariz", ex: "The reason is apparent." },
    { eng: "Appeal", tr: "Cazibe, başvuru", ex: "The idea appeals to me." },
    { eng: "Appear", tr: "Görünmek", ex: "He appeared on TV." },
    { eng: "Appearance", tr: "Dış görünüş", ex: "Don't judge by appearance." },
    { eng: "Apple", tr: "Elma", ex: "An apple a day keeps the doctor away." },
    { eng: "Application", tr: "Uygulama", ex: "Fill out this application." },
    { eng: "Apply", tr: "Başvurmak", ex: "I want to apply for a job." },
    { eng: "Appointment", tr: "Randevu", ex: "I have a dentist appointment." },
    { eng: "Appreciate", tr: "Takdir etmek", ex: "I appreciate your help." },
    { eng: "Approach", tr: "Yaklaşmak", ex: "The winter is approaching." },
    { eng: "Appropriate", tr: "Uygun", ex: "Is this dress appropriate?" },
    { eng: "Approval", tr: "Onay", ex: "I need your approval." },
    { eng: "Approve", tr: "Onaylamak", ex: "My father didn't approve." },
    { eng: "Area", tr: "Alan, bölge", ex: "This is a quiet area." },
    { eng: "Argue", tr: "Tartışmak", ex: "Don't argue with me." },
    { eng: "Argument", tr: "Tartışma", ex: "They had an argument." },
    { eng: "Arise", tr: "Ortaya çıkmak", ex: "A problem has arisen." },
    { eng: "Arm", tr: "Kol", ex: "He broke his arm." },
    { eng: "Army", tr: "Ordu", ex: "He joined the army." },
    { eng: "Around", tr: "Etrafında", ex: "We walked around the city." },
    { eng: "Arrange", tr: "Düzenlemek", ex: "I'll arrange the meeting." },
    { eng: "Arrangement", tr: "Düzenleme", ex: "Make an arrangement." },
    { eng: "Arrival", tr: "Varış", ex: "What's the arrival time?" },
    { eng: "Arrive", tr: "Varmak", ex: "We arrived late." },
    { eng: "Art", tr: "Sanat", ex: "I love modern art." },
    { eng: "Article", tr: "Makale", ex: "I read an article today." },
    { eng: "Artificial", tr: "Yapay", ex: "Artificial intelligence." },
    { eng: "Artist", tr: "Sanatçı", ex: "She is a talented artist." }
  ]
};

export default function OxfordApp() {
  const [level, setLevel] = useState("A1-A2 (Başlangıç)");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({ learned: [], struggle: [] });
  const [showReport, setShowReport] = useState(false);

  const words = OXFORD_DATA[level] || [];
  const word = words[index] || { eng: "Bitti!", tr: "Tebrikler", ex: "Tüm kelimeleri tamamladın." };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    }
  };

  const handleAction = (isLearned) => {
    setResults(prev => ({
      learned: isLearned ? [...prev.learned, word] : prev.learned,
      struggle: !isLearned ? [...prev.struggle, word] : prev.struggle
    }));
    setFlipped(false);
    if (index < words.length - 1) setIndex(i => i + 1);
    else setShowReport(true);
  };

  return (
    <div style={{ height: "100vh", background: "#4834d4", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", color: "white", padding: "20px", overflow: "hidden" }}>
      <div style={{ marginBottom: "15px", opacity: 0.8 }}>Kalan: {words.length - index}</div>
      <AnimatePresence mode="wait">
        <motion.div key={index} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} onClick={() => { setFlipped(!flipped); if (!flipped) speak(word.eng); }} style={{ width: "100%", maxWidth: "320px", height: "400px", background: "white", borderRadius: "30px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "25px", color: "#2d3436", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
          {!flipped ? (
            <h1 style={{ fontSize: "42px", margin: 0 }}>{word.eng}</h1>
          ) : (
            <div>
              <h2 style={{ color: "#4834d4", fontSize: "32px", margin: 0 }}>{word.tr}</h2>
              <p style={{ fontStyle: "italic", marginTop: "20px", color: "#636e72" }}>{word.ex}</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div style={{ marginTop: "40px", display: "flex", gap: "30px" }}>
        <button onClick={() => handleAction(false)} style={{ width: "75px", height: "75px", borderRadius: "50%", border: "none", background: "#ff7675", color: "white", fontSize: "24px" }}>✕</button>
        <button onClick={() => handleAction(true)} style={{ width: "75px", height: "75px", borderRadius: "50%", border: "none", background: "#55efc4", color: "white", fontSize: "24px" }}>✓</button>
      </div>
      {showReport && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", padding: "30px", borderRadius: "20px", textAlign: "center", color: "#2d3436" }}>
            <h2>Sonuç</h2>
            <p>Bildiğin: {results.learned.length}</p>
            <p>Çalışman gereken: {results.struggle.length}</p>
            <button onClick={() => { setShowReport(false); setIndex(0); setResults({ learned: [], struggle: [] }); }} style={{ background: "#4834d4", color: "white", border: "none", padding: "10px 20px", borderRadius: "10px" }}>Baştan Başla</button>
          </div>
        </div>
      )}
    </div>
  );
}
