import { useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import GameOverScreen from "./components/GameOverScreen";
import { supabase } from "./lib/supabase";
import "./index.css";

export default function App() {
  const [playerName, setPlayerName] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOverData, setGameOverData] = useState(null); // simpan data terakhir

  // fetch leaderboard
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    let { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(10);

    if (!error) setLeaderboard(data);
  };

  const handleStart = (name) => {
    setPlayerName(name);
    setIsPlaying(true);
    setGameOverData(null);
  };

  const handleGameOver = async (score) => {
    // Insert score ke Supabase
    const { error } = await supabase.from("leaderboard").insert([
      { name: playerName, score },
    ]);
    if (error) console.error(error);

    // Refresh leaderboard
    await fetchLeaderboard();

    // Simpan data terakhir (buat tampil di GameOverScreen)
    setGameOverData({ name: playerName, score });
    setIsPlaying(false);
    setPlayerName("");
  };

  const handleRestart = () => {
    setGameOverData(null);
  };

  return (
    <div className="app-container">
      {!isPlaying && !gameOverData ? (
        <StartScreen onStart={handleStart} leaderboard={leaderboard} />
      ) : isPlaying ? (
        <GameBoard playerName={playerName} onGameOver={handleGameOver} />
      ) : (
        <GameOverScreen
          leaderboard={leaderboard}
          player={gameOverData}
          onRestart={handleRestart}
        />
      )}

      {/* Footer credit */}
      <footer className="footer-credit">
        Made by <span className="author">Thaaan184</span>
      </footer>
    </div>
  );
}
