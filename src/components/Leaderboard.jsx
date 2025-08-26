export default function Leaderboard({ leaderboard }) {
  return (
    <div className="leaderboard">
      <h2>🏆 Leaderboard</h2>
      <ul>
        {leaderboard.length === 0 && <p>Belum ada pemain</p>}
        {leaderboard.map((entry, idx) => (
          <li key={idx}>
            <span>{entry.name}</span>
            <span>{entry.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
