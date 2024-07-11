// Triangular membership function
export function triangularMF(
  x: number,
  a: number,
  b: number,
  c: number
): number {
  if (x <= a || x >= c) {
    return 0;
  } else if (x === b) {
    return 1;
  } else if (x > a && x < b) {
    return (x - a) / (b - a);
  } else if (x > b && x < c) {
    return (c - x) / (c - b);
  } else {
    return 0; // Default case, should not normally occur
  }
}

// Fuzzify function
export function fuzzify(
  value: number,
  sets: { [key: string]: [number, number, number] }
): { [key: string]: number } {
  const result: { [key: string]: number } = {};
  for (const [setName, [low, mid, high]] of Object.entries(sets)) {
    result[setName] = triangularMF(value, low, mid, high);
  }
  return result;
}

// Defuzzify function
export function defuzzify(fuzzySet: { [key: string]: number }): number {
  let numerator = 0;
  let denominator = 0;
  for (const [valueStr, degree] of Object.entries(fuzzySet)) {
    const value = parseFloat(valueStr);
    numerator += value * degree;
    denominator += degree;
  }
  if (denominator === 0) {
    return NaN; // Handle division by zero case
  }
  return numerator / denominator;
}
