"use client";

import styles from "./history.module.css";

interface HistoryProps {
  history: number[];
  numbers: { num: number, color: string }[]
}

export default function History({ history, numbers }: HistoryProps) {
    return(
        <ul className={styles.history}>
            {history.map((n, i) => {
                const color = numbers.find(num => num.num === n)?.color;
                    return (
                        <li key={i} className={styles[color ?? "black"]}>
                        {n}
                        </li>
                    );
            })}
        </ul>
    )
}