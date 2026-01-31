import React, { useState } from "react";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentData = OXFORD_DATA[currentWordIndex];

  return (
    <div style={{ 
      display: "flex", justifyContent: "center", alignItems: "center", 
      height: "100vh", backgroundColor: "#E0F7FA", margin: 0, fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" 
    }}>
      <div style={{ 
        backgroundColor: "white", padding: "30px", borderRadius: "25px", 
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)", textAlign: "center", width: "350px",
        border: "4px solid #4FC3F7"
      }}>
        <h1 style={{ color: "#0288D1", fontSize: "28px", marginBottom: "10px" }}>English for Kids 🌟</h1>
        <p style={{ color: "#546E7A", marginBottom: "25px" }}>Can you guess the word?</p>
        
        <div style={{ 
          backgroundColor: "#F1F8E9", padding: "20px", borderRadius: "15px", 
          marginBottom: "20px", borderLeft: "5px solid #8BC34A" 
        }}>
          <p style={{ color: "#33691E", fontSize: "12px", fontWeight: "bold", margin: "0 0 5px 0" }}>HINT / İPUCU</p>
          <p style={{ fontSize: "18px", color: "#2E7D32", margin: 0 }}>{currentData.hint}</p>
        </div>

        <div style={{ 
          fontSize: "32px", letterSpacing: "10px", fontWeight: "bold", 
          color: "#0288D1", padding: "20px 0" 
        }}>
          {currentData.word.split('').map(() => "_").join(' ')}
        </div>

        <button 
          onClick={() => setCurrentWordIndex((prev) => (prev + 1) % OXFORD_DATA.length)}
          style={{ 
            marginTop: "20px", padding: "15px 35px", fontSize: "18px",
            backgroundColor: "#FF7043", color: "white", border: "none",
            borderRadius: "50px", cursor: "pointer", fontWeight: "bold",
            boxShadow: "0 5px 15px rgba(255,112,67,0.4)"
          }}>
          Next Word ➡️
        </button>
      </div>
    </div>
  );
}
