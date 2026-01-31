import React, { useState } from "react";
import { OXFORD_DATA } from "./words";

export default function WordMasterApp() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const currentData = OXFORD_DATA[currentWordIndex];

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "sans-serif" }}>
      <h1>Kelime Avcısı</h1>
      <div style={{ padding: "20px", border: "1px solid #ccc", display: "inline-block" }}>
        <p><strong>İpucu:</strong> {currentData.hint}</p>
        <p><strong>Kelime:</strong> {currentData.word.split('').map(() => "_ ").join('')}</p>
      </div>
      <br />
      <button onClick={() => setCurrentWordIndex((prev) => (prev + 1) % OXFORD_DATA.length)} style={{ marginTop: "20px", padding: "10px" }}>
        Sıradaki Kelime
      </button>
    </div>
  );
}
