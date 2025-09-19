"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

import Stats from "./stats";
import History from "./history";

const numbers = [
  { num: 0, color: "green" }, { num: 32, color: "red" }, { num: 15, color: "black" },
  { num: 19, color: "red" }, { num: 4, color: "black" }, { num: 21, color: "red" },
  { num: 2, color: "black" }, { num: 25, color: "red" }, { num: 17, color: "black" },
  { num: 34, color: "red" }, { num: 6, color: "black" }, { num: 27, color: "red" },
  { num: 13, color: "black" }, { num: 36, color: "red" }, { num: 11, color: "black" },
  { num: 30, color: "red" }, { num: 8, color: "black" }, { num: 23, color: "red" },
  { num: 10, color: "black" }, { num: 5, color: "red" }, { num: 24, color: "black" },
  { num: 16, color: "red" }, { num: 33, color: "black" }, { num: 1, color: "red" },
  { num: 20, color: "black" }, { num: 14, color: "red" }, { num: 31, color: "black" },
  { num: 9, color: "red" }, { num: 22, color: "black" }, { num: 18, color: "red" },
  { num: 29, color: "black" }, { num: 7, color: "red" }, { num: 28, color: "black" },
  { num: 12, color: "red" }, { num: 35, color: "black" }, { num: 3, color: "red" },
  { num: 26, color: "black" },
];

// Durée du timer avant chaque spin (en secondes)
const TIMER_DURATION = 25;

// Nombre de tours complets avant de s'arrêter
const SPIN_TOURS = 3;

export default function Roulette() {
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    if (spinning) return;

    if (timer === 0) {
      setShowTimer(false); // cacher le timer
      spinWheel();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, spinning]);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);

    const chosenIndex = Math.floor(Math.random() * numbers.length);
    const totalHighlights = numbers.length * SPIN_TOURS + chosenIndex;
    let counter = 0;

    const interval = setInterval(() => {
      setHighlightIndex(counter % numbers.length);
      counter++;
      if (counter > totalHighlights) {
        clearInterval(interval);
        setHistory([numbers[chosenIndex].num, ...history]);
        setSpinning(false);
        setHighlightIndex(chosenIndex);
        setTimer(TIMER_DURATION); // relance le timer
        setTimeout(() => setShowTimer(true), 500); // réaffiche doucement
      }
    }, 50);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPane}>
        <div className={styles.wheelContainer}>
          {numbers.map((n, i) => {
            const angle = (i * 360) / numbers.length;
            const isHighlight = i === highlightIndex;
            return (
              <div
                key={i}
                className={`${styles.number} ${styles[n.color]} ${isHighlight ? styles.highlight : ""}`}
                style={{
                  transform: `rotate(${angle}deg) translateY(-300px) rotate(-${angle}deg)`,
                }}
              >
                {n.num}
              </div>
            );
          })}
          {showTimer && (
            <div
              className={`${styles.timer} ${timer <= 3 ? styles.timerWarning : ""}`}
              key={timer}
            >
              {timer}
            </div>
          )}
        </div>
      </div>

      <div className={styles.rightPane}>
        {/* <h2>Historique</h2> */}
        <History history={history} numbers={numbers} />
        {/* <br /> */}
        <br />
        {/* <h2>Statistiques</h2> */}
        <Stats history={history} numbers={numbers} />
      </div>
    </div>
  );
}
