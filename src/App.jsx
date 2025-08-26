import { useState } from "react";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import "./index.css";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStart = (name) => {
    setPlayerName(name);
    setIsPlaying(true);
  };

  const handleGameOver = (score) => {
    let updated = [...leaderboard, { name: playerName, score }];
    updated.sort((a, b) => b.score - a.score); // urut dari score tertinggi
    updated = updated.slice(0, 10); // hanya top 10
    setLeaderboard(updated);
    setIsPlaying(false);
    setPlayerName("");
  };

  return (
    <div className="app-container">
      {!isPlaying ? (
        <StartScreen
          onStart={handleStart}
          leaderboard={leaderboard}
        />
      ) : (
        <GameBoard playerName={playerName} onGameOver={handleGameOver} />
      )}
    </div>
  );
}
