import React, { useState } from "react";

const INITIAL_WORDS = [
  { eng: "Ability", tr: "Yetenek", ex: "She has the ability to pass." },
  { eng: "Abandon", tr: "Terk etmek", ex: "Never abandon your dreams." },
  { eng: "Absolute", tr: "Kesin", ex: "It is the absolute truth." },
  { eng: "Academic", tr: "Akademik", ex: "A successful academic career." },
  { eng: "Accept", tr: "Kabul etmek", ex: "I accept your invitation." }
  // Not: Buraya 100 kelime sığar ama önce 5 taneyle sistemin çalıştığını görelim
];

export default function App() {
  const [pool, setPool] = useState(INITIAL_WORDS);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = pool[index];

  const handleAction = (learned) => {
    if (learned) {
      const newPool = pool.filter((_, i) => i !== index);
      setPool(newPool);
      if (index >= newPool.length - 1) setIndex(0);
    } else {
      setIndex((index + 1) % pool.length);
    }
    setFlipped(false);
  };

  if (pool.length === 0) return <div style={{textAlign:'center', padding:'50px'}}><h1>🏆 Hepsi Bitti!</h1><button onClick={() => window.location.reload()}>Yükle</button></div>;

  return (
    <div style={{height:'100vh', background:'#1e272e', color:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'sans-serif'}}>
      <div style={{marginBottom:'20px'}}>Kalan: {pool.length}</div>
      <div onClick={() => setFlipped(!flipped)} style={{width:'300px', height:'400px', background:'white', borderRadius:'20px', color:'#2d3436', display:'flex', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'20px', cursor:'pointer'}}>
        {!flipped ? <h1>{current.eng}</h1> : <div><h2>{current.tr}</h2><p>{current.ex}</p></div>}
      </div>
      <div style={{marginTop:'30px', display:'flex', gap:'20px'}}>
        <button onClick={() => handleAction(false)} style={{padding:'15px 30px', background:'#ff7675', border:'none', borderRadius:'10px', color:'white'}}>Zor ✕</button>
        <button onClick={() => handleAction(true)} style={{padding:'15px 30px', background:'#55efc4', border:'none', borderRadius:'10px', color:'white'}}>Öğrendim ✓</button>
      </div>
    </div>
  );
}
