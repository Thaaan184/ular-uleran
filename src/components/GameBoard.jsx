import { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 15;
const CELL_SIZE = 30;

const DIRECTIONS = {
  w: { x: 0, y: -1, key: "w" },
  a: { x: -1, y: 0, key: "a" },
  s: { x: 0, y: 1, key: "s" },
  d: { x: 1, y: 0, key: "d" },
};
const OPPOSITE = { w: "s", s: "w", a: "d", d: "a" };

const snakeColors = ["#4CAF50", "#FFD700", "#FF69B4", "#1E90FF", "#FF4500"];

function spawnFood(snakeArr) {
  while (true) {
    const x = Math.floor(Math.random() * BOARD_SIZE);
    const y = Math.floor(Math.random() * BOARD_SIZE);
    if (!snakeArr.some((seg) => seg.x === x && seg.y === y)) {
      return { x, y };
    }
  }
}

export default function GameBoard({ playerName, onGameOver }) {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState(DIRECTIONS.d);
  const [score, setScore] = useState(0);

  const snakeRef = useRef(snake);
  const dirRef = useRef(dir);
  const foodRef = useRef(food);
  const scoreRef = useRef(score);
  const gameOverRef = useRef(false);

  // 👉 antrian input arah
  const inputQueue = useRef([]);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Reset game
  useEffect(() => {
    gameOverRef.current = false;
    setSnake([{ x: 7, y: 7 }]);
    setDir(DIRECTIONS.d);
    setScore(0);
    const f = spawnFood([{ x: 7, y: 7 }]);
    setFood(f);
    foodRef.current = f;
    inputQueue.current = [];
  }, []);

  // Masukkan input ke queue
  useEffect(() => {
    const handleKey = (e) => {
      const k = e.key.toLowerCase();
      if (!DIRECTIONS[k]) return;
      inputQueue.current.push(DIRECTIONS[k]);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    const id = setInterval(() => {
      if (gameOverRef.current) return;

      const s = snakeRef.current;
      let d = dirRef.current;
      const f = foodRef.current;
      const currScore = scoreRef.current;

      // 👉 ambil input dari queue
      if (inputQueue.current.length > 0) {
        const nextDir = inputQueue.current.shift();
        if (OPPOSITE[d.key] !== nextDir.key) {
          d = nextDir;
          setDir(nextDir);
          dirRef.current = nextDir;
        }
      }

      const head = { x: s[0].x + d.x, y: s[0].y + d.y };
      const hitWall =
        head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE;
      const hitBody = s.some((seg) => seg.x === head.x && seg.y === head.y);

      if (hitWall || hitBody) {
        gameOverRef.current = true;
        clearInterval(id);

        // Pesan "YAHH MAATII"
        const deathMsg = document.createElement("div");
        deathMsg.innerText = "YAHH MAATII";
        deathMsg.style.position = "fixed";
        deathMsg.style.top = "50%";
        deathMsg.style.left = "50%";
        deathMsg.style.transform = "translate(-50%, -50%)";
        deathMsg.style.fontSize = "2.5rem";
        deathMsg.style.color = "red";
        deathMsg.style.fontWeight = "bold";
        deathMsg.style.zIndex = "9999";
        document.body.appendChild(deathMsg);

        setTimeout(() => {
          document.body.removeChild(deathMsg);
          onGameOver(currScore);
        }, 1500);

        return;
      }

      const eat = head.x === f.x && head.y === f.y;
      const nextSnake = [head, ...s];
      if (!eat) {
        nextSnake.pop();
        setSnake(nextSnake);
        snakeRef.current = nextSnake;
      } else {
        const newScore = currScore + 10;
        setScore(newScore);
        scoreRef.current = newScore;

        const newFood = spawnFood(nextSnake);
        setFood(newFood);
        foodRef.current = newFood;

        setSnake(nextSnake);
        snakeRef.current = nextSnake;
      }
    }, 200);

    return () => clearInterval(id);
  }, [onGameOver]);

  return (
    <div className="game-page">
      <h2 className="score-display">
        {playerName} - Score: {score}
      </h2>
      <div
        className="board"
        style={{
          width: BOARD_SIZE * CELL_SIZE,
          height: BOARD_SIZE * CELL_SIZE,
          position: "relative",
          border: "5px solid #333",
          borderRadius: 12,
          margin: "20px auto",
          background: "#fafafa",
        }}
      >
        {snake.map((seg, idx) => (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: seg.x * CELL_SIZE,
              top: seg.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              borderRadius: 6,
              boxShadow: "0 0 6px rgba(0,0,0,0.3)",
              background: snakeColors[idx % snakeColors.length],
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ff0000, #8b0000)",
            boxShadow: "0 0 10px rgba(255,0,0,0.7)",
          }}
        />
      </div>

      {/* Kontrol tombol panah */}
      <div className="controls">
        <div className="row">
          <button onClick={() => inputQueue.current.push(DIRECTIONS.w)}>⬆</button>
        </div>
        <div className="row">
          <button onClick={() => inputQueue.current.push(DIRECTIONS.a)}>⬅</button>
          <button onClick={() => inputQueue.current.push(DIRECTIONS.s)}>⬇</button>
          <button onClick={() => inputQueue.current.push(DIRECTIONS.d)}>➡</button>
        </div>
      </div>
    </div>
  );
}
