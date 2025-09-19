"use client";

import styles from "./stats.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface StatsProps {
  history: number[];
  numbers: { num: number; color: string }[];
}

export default function Stats({ history, numbers }: StatsProps) {
  // stats par numéro
  const statsNumbers = numbers.map((n) => ({
    ...n,
    count: history.filter((h) => h === n.num).length,
  }));

  // tri pour chaud / froid
  const sortedDesc = [...statsNumbers].sort((a, b) => b.count - a.count);
  const sortedAsc = [...statsNumbers].sort((a, b) => a.count - b.count);
  const top5 = sortedDesc.slice(0, 5);
  const bottom5 = sortedAsc.slice(0, 5);

  // stats couleur + parité
  const total = history.length || 1;
  const colorCounts = { red: 0, black: 0, green: 0 };
  const parityCounts = { pair: 0, impair: 0, zero: 0 };

  history.forEach((n) => {
    const numObj = numbers.find((x) => x.num === n);
    if (numObj) {
      colorCounts[numObj.color as keyof typeof colorCounts]++;
      if (n === 0) {
        parityCounts.zero++;
      } else if (n % 2 === 0) {
        parityCounts.pair++;
      } else {
        parityCounts.impair++;
      }
    }
  });

  // données pour recharts
  const colorData = [
    { name: "Rouge", value: (colorCounts.red / total) * 100, fill: "#d32f2f" },
    { name: "Noir", value: (colorCounts.black / total) * 100, fill: "#212121" },
    { name: "Vert", value: (colorCounts.green / total) * 100, fill: "#388e3c" },
  ];

  const parityData = [
    { name: "Pair", value: (parityCounts.pair / total) * 100, fill: "#1976d2" },
    { name: "Impair", value: (parityCounts.impair / total) * 100, fill: "#fbc02d" },
    { name: "Zéro", value: (parityCounts.zero / total) * 100, fill: "#00e676" },
  ];

  return (
    <div className={styles.container}>
      <h3>Top 5 numéros chauds 🔥</h3>
      <ul className={styles.list}>
        {top5.map((n) => (
          <li key={n.num} className={styles[n.color]}>
            {n.num} ({n.count})
          </li>
        ))}
      </ul>

      <h3>Top 5 numéros froids ❄️</h3>
      <ul className={styles.list}>
        {bottom5.map((n) => (
          <li key={n.num} className={styles[n.color]}>
            {n.num} ({n.count})
          </li>
        ))}
      </ul>

      <h3>Pourcentage couleurs</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={colorData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" unit="%" />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3>Pourcentage Pair / Impair / Zéro</h3>
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={parityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" unit="%" />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
