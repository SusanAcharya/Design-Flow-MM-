export function compactNpr(value: number) {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1e7) {
    const n = abs / 1e7;
    return `${sign}${n.toFixed(n >= 10 ? 1 : 2)} Cr`;
  }
  if (abs >= 1e5) {
    const n = abs / 1e5;
    return `${sign}${n.toFixed(2)} L`;
  }
  return npr(value);
}

export function npr(value: number, digits = 0) {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
  return value < 0 ? `−${formatted}` : formatted;
}

export function signed(value: number, digits = 0) {
  const abs = Math.abs(value).toLocaleString("en-IN", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
  if (value > 0) return `+${abs}`;
  if (value < 0) return `−${abs}`;
  return abs;
}

export function pct(value: number, digits = 2) {
  const abs = Math.abs(value).toFixed(digits);
  if (value > 0) return `+${abs}%`;
  if (value < 0) return `−${abs}%`;
  return `${abs}%`;
}

export function direction(value: number): "up" | "down" | "flat" {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

export function changeFromPct(price: number, changePct: number) {
  if (changePct === -100) return -price;
  return price - price / (1 + changePct / 100);
}
