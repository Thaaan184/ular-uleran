import { useEffect, useRef, useState } from "react";

const BOARD_SIZE = 15;
const CELL_SIZE = 30;
const SPEED = 200; // waktu per langkah (ms)

const DIRECTIONS = {
  w: { x: 0, y: -1, key: "w" },
  a: { x: -1, y: 0, key: "a" },
  s: { x: 0, y: 1, key: "s" },
  d: { x: 1, y: 0, key: "d" },
  ArrowUp: { x: 0, y: -1, key: "w" },
  ArrowLeft: { x: -1, y: 0, key: "a" },
  ArrowDown: { x: 0, y: 1, key: "s" },
  ArrowRight: { x: 1, y: 0, key: "d" },
};
const OPPOSITE = { w: "s", s: "w", a: "d", d: "a" };

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

  const inputQueue = useRef([]);

  const [renderSnake, setRenderSnake] = useState(snake);
  const lastStepTime = useRef(performance.now());

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { dirRef.current = dir; }, [dir]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { scoreRef.current = score; }, [score]);

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

  useEffect(() => {
    const handleKey = (e) => {
      if (DIRECTIONS[e.key]) {
        inputQueue.current.push(DIRECTIONS[e.key]);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    function gameLoop(now) {
      if (gameOverRef.current) return;

      const elapsed = now - lastStepTime.current;
      if (elapsed >= SPEED) {
        lastStepTime.current = now;

        const s = snakeRef.current;
        let d = dirRef.current;
        const f = foodRef.current;
        const currScore = scoreRef.current;

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
      }

      setRenderSnake(snakeRef.current);
      requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
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
          background: "#0f172a",
        }}
      >
        {renderSnake.map((seg, idx) => {
          const isHead = idx === 0;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: seg.x * CELL_SIZE,
                top: seg.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                borderRadius: isHead ? "50%" : 6,
                background: isHead
                  ? "radial-gradient(circle at 30% 30%, #2ecc71, #14532d)"
                  : "linear-gradient(145deg, #16a34a, #065f46)",
                border: "2px solid #064e3b",
                boxShadow: "inset 0 0 4px rgba(0,0,0,0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {isHead && (
                <>
                  {/* Mata */}
                  <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      left: "25%",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "30%",
                      right: "25%",
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "white",
                    }}
                  />
                  {/* Lidah */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-6px",
                      width: 4,
                      height: 8,
                      background: "red",
                      borderRadius: 2,
                      animation: "tongue 0.4s infinite alternate",
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
            width: CELL_SIZE - 6,
            height: CELL_SIZE - 6,
            borderRadius: "50%",
            background: "radial-gradient(circle, #ff4d4d, #8b0000)",
            boxShadow: "0 0 8px rgba(255,0,0,0.7)",
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
