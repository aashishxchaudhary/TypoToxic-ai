const levels = [
  { name: "Keyboard Victim", min: 0 },
  { name: "Finger Rookie", min: 300 },
  { name: "Accuracy Soldier", min: 800 },
  { name: "Speed Hunter", min: 1600 },
  { name: "Typing Beast", min: 3000 },
  { name: "Top 1% Monster", min: 5000 },
];

export const calculateLevel = (xp = 0) =>
  [...levels].reverse().find((level) => xp >= level.min)?.name || levels[0].name;

export const calculateXp = ({ wpm = 0, accuracy = 0, consistency = 0 }) =>
  Math.max(10, Math.round(wpm * 0.7 + accuracy * 0.25 + consistency * 0.15));

export { levels };
