const MIN_RADIUS: number = 7.5;
const MAX_RADIUS: number = 15;
const DEPTH: number = 2;
const LEFT_COLOR: string = "6366f1";
const RIGHT_COLOR: string = "8b5cf6";
const NUM_POINTS: number = 2500;

interface Point {
  idx: number;
  position: [number, number, number];
  color: string;
}

/**
 * --- Credit ---
 * https://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
 */
const getGradientStop = (ratio: number): string => {
  // Clampeamos ratio entre 0 y 1
  ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;

  // Usamos el operador ! ya que sabemos que el match no devolverá null
  const c0: number[] = LEFT_COLOR.match(/.{1,2}/g)!.map(
    (oct: string) => parseInt(oct, 16) * (1 - ratio)
  );
  const c1: number[] = RIGHT_COLOR.match(/.{1,2}/g)!.map(
    (oct: string) => parseInt(oct, 16) * ratio
  );
  const ci: number[] = [0, 1, 2].map((i: number) =>
    Math.min(Math.round(c0[i] + c1[i]), 255)
  );
  const color: string = ci
    .reduce((a, v) => (a << 8) + v, 0)
    .toString(16)
    .padStart(6, "0");

  return `#${color}`;
};

const calculateColor = (x: number): string => {
  const maxDiff: number = MAX_RADIUS * 2;
  const distance: number = x + MAX_RADIUS;

  const ratio: number = distance / maxDiff;
  return getGradientStop(ratio);
};

const randomFromInterval = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const pointsInner: Point[] = Array.from(
  { length: NUM_POINTS },
  (v, k) => k + 1
).map((num: number) => {
  const randomRadius: number = randomFromInterval(MIN_RADIUS, MAX_RADIUS);
  const randomAngle: number = Math.random() * Math.PI * 2;

  const x: number = Math.cos(randomAngle) * randomRadius;
  const y: number = Math.sin(randomAngle) * randomRadius;
  const z: number = randomFromInterval(-DEPTH, DEPTH);

  const color: string = calculateColor(x);

  return {
    idx: num,
    position: [x, y, z],
    color,
  };
});

export const pointsOuter: Point[] = Array.from(
  { length: NUM_POINTS / 4 },
  (v, k) => k + 1
).map((num: number) => {
  const randomRadius: number = randomFromInterval(MIN_RADIUS / 2, MAX_RADIUS * 2);
  const angle: number = Math.random() * Math.PI * 2;

  const x: number = Math.cos(angle) * randomRadius;
  const y: number = Math.sin(angle) * randomRadius;
  const z: number = randomFromInterval(-DEPTH * 10, DEPTH * 10);

  const color: string = calculateColor(x);

  return {
    idx: num,
    position: [x, y, z],
    color,
  };
});
