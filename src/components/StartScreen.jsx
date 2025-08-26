import { useState } from "react";
import Leaderboard from "./Leaderboard";

export default function StartScreen({ onStart, leaderboard }) {
  const [name, setName] = useState("");

  const handleClick = () => {
    if (name.length >= 1 && name.length <= 8) {
      onStart(name);
    } else {
      alert("Nama harus 1 - 8 huruf!");
    }
  };

  return (
    <div className="start-screen">
      <h1>🐍 Uler-Uleran</h1>
      <input
        type="text"
        placeholder="Masukkan Nama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={8}
      />
      <button onClick={handleClick}>Mulai</button>
      <Leaderboard leaderboard={leaderboard} />
    </div>
  );
}
