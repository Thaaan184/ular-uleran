import { useEffect, useState } from "react";

const BOARD_SIZE = 15; // 15x15 grid
const CELL_SIZE = 20; // pixel
const DIRECTIONS = {
  w: { x: 0, y: -1 },
  a: { x: -1, y: 0 },
  s: { x: 0, y: 1 },
  d: { x: 1, y: 0 },
};

export default function GameBoard({ playerName, onGameOver }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);

  // kontrol keyboard
  useEffect(() => {
    const handleKey = (e) => {
      const key = e.key.toLowerCase();
      if (DIRECTIONS[key]) setDir(DIRECTIONS[key]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // game loop
  useEffect(() => {
    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

        // check collision (tembok)
        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
          onGameOver(score);
          return [{ x: 7, y: 7 }];
        }

        // check collision (body)
        if (prev.some((seg) => seg.x === head.x && seg.y === head.y)) {
          onGameOver(score);
          return [{ x: 7, y: 7 }];
        }

        let newSnake = [head, ...prev];

        // makan
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood({
            x: Math.floor(Math.random() * BOARD_SIZE),
            y: Math.floor(Math.random() * BOARD_SIZE),
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [dir, food, score, onGameOver]);

  return (
    <div className="game-container">
      <h2>{playerName} - Score: {score}</h2>
      <div
        className="board"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
          position: "relative",
          border: "3px solid black",
        }}
      >
        {/* Snake */}
        {snake.map((seg, idx) => (
          <div
            key={idx}
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              background: "green",
              position: "absolute",
              left: seg.x * CELL_SIZE,
              top: seg.y * CELL_SIZE,
            }}
          />
        ))}
        {/* Food */}
        <div
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            background: "red",
            position: "absolute",
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>

      {/* Kontrol tombol panah */}
      <div className="controls">
        <button onClick={() => setDir(DIRECTIONS.w)}>⬆</button>
        <div>
          <button onClick={() => setDir(DIRECTIONS.a)}>⬅</button>
          <button onClick={() => setDir(DIRECTIONS.s)}>⬇</button>
          <button onClick={() => setDir(DIRECTIONS.d)}>➡</button>
        </div>
      </div>
    </div>
  );
}
