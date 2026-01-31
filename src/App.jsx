import React, { useState } from "react";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const data = OXFORD_DATA[currentIndex];

  return (
    <div style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", 
      height: "100vh", backgroundColor: "#0f172a", margin: 0, 
      fontFamily: "'Inter', sans-serif", color: "#f8fafc" 
    }}>
      <div style={{ 
        backgroundColor: "#1e293b", padding: "40px", borderRadius: "12px", 
        boxShadow: "0 20px 50px rgba(0,0,0,0.3)", textAlign: "center", 
        width: "400px", border: "1px solid #334155" 
      }}>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "20px", letterSpacing: "2px" }}>
          VOCABULARY BUILDER {currentIndex + 1} / {OXFORD_DATA.length}
        </div>

        <div style={{ marginBottom: "30px" }}>
          <div style={{ color: "#38bdf8", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>DEFINITION</div>
          <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#e2e8f0" }}>"{data.hint}"</p>
        </div>

        <div style={{ 
          fontSize: "36px", letterSpacing: "12px", fontWeight: "700", 
          color: "#f8fafc", padding: "30px 0", borderTop: "1px solid #334155", borderBottom: "1px solid #334155" 
        }}>
          {data.word.split('').map(() => "_").join(' ')}
        </div>

        <button 
          onClick={() => setCurrentIndex((prev) => (prev + 1) % OXFORD_DATA.length)}
          style={{ 
            marginTop: "40px", width: "100%", padding: "14px", fontSize: "16px",
            backgroundColor: "#38bdf8", color: "#0f172a", border: "none",
            borderRadius: "8px", cursor: "pointer", fontWeight: "700",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#7dd3fc"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#38bdf8"}
        >
          NEXT QUESTION
        </button>
      </div>
    </div>
  );
}
