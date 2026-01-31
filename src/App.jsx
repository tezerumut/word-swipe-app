import React, { useState } from "react";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentData = OXFORD_DATA[currentWordIndex];

  return (
    <div style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", 
      height: "100vh", backgroundColor: "#f0f2f5", margin: 0, fontFamily: "Arial, sans-serif" 
    }}>
      <div style={{ 
        backgroundColor: "white", padding: "40px", borderRadius: "20px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)", textAlign: "center", width: "320px" 
      }}>
        <h2 style={{ color: "#1a73e8", marginBottom: "20px" }}>Kelime Avcısı</h2>
        
        <div style={{ marginBottom: "30px", minHeight: "100px" }}>
          <p style={{ color: "#5f6368", fontSize: "14px", fontWeight: "bold" }}>İPUCU</p>
          <p style={{ fontSize: "18px", color: "#202124" }}>{currentData.hint}</p>
        </div>

        <div style={{ 
          fontSize: "24px", letterSpacing: "8px", fontWeight: "bold", 
          color: "#1a73e8", backgroundColor: "#e8f0fe", padding: "15px", borderRadius: "10px" 
        }}>
          {currentData.word.split('').map(() => "_").join(' ')}
        </div>

        <button 
          onClick={() => setCurrentWordIndex((prev) => (prev + 1) % OXFORD_DATA.length)}
          style={{ 
            marginTop: "30px", padding: "12px 25px", fontSize: "16px",
            backgroundColor: "#1a73e8", color: "white", border: "none",
            borderRadius: "30px", cursor: "pointer", fontWeight: "bold",
            transition: "background 0.3s"
          }}>
          Sıradaki Kelime →
        </button>
      </div>
    </div>
  );
}
