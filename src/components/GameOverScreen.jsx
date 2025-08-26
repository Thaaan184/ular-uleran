export default function GameOverScreen({ leaderboard, player, onRestart }) {
  const masukLeaderboard = leaderboard.some((e) => e.name === player.name && e.score === player.score);

  return (
    <div className="game-over">
      <h1>💀 Game Over</h1>
      <h2>🏆 Leaderboard</h2>
      <ul className="leaderboard-list">
        {leaderboard.map((entry, idx) => (
          <li
            key={entry.id || idx}
            className={entry.name === player.name && entry.score === player.score ? "highlight" : ""}
          >
            <span>{idx + 1}. {entry.name}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>

      {!masukLeaderboard && (
        <div className="your-score">
          <h3>👉 Skor Kamu</h3>
          <p>{player.name} — {player.score}</p>
        </div>
      )}

      <button onClick={onRestart}>Main Lagi</button>
    </div>
  );
}
