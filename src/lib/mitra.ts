/* Mitra, the house guide. One file so a pose is picked by name, not by path. */
const base = import.meta.env.BASE_URL;

export const mitra = {
  /** Keyed off its export plate, so it sits in the nav without a white square. */
  mark: `${base}mitra/mitra-mark.png`,
  namaste: `${base}mitra/mitra-namaste.png`,
  hi: `${base}mitra/mitra-hi.png`,
  pointing: `${base}mitra/mitra-pointing.png`,
  thinking: `${base}mitra/mitra-thinking.png`,
  chart: `${base}mitra/mitra-chart.png`,
  search: `${base}mitra/mitra-search.png`,
  savings: `${base}mitra/mitra-savings.png`,
  celebrate: `${base}mitra/mitra-celebrate.png`,
  thumbsUp: `${base}mitra/mitra-thumbs-up.png`,
  sleepy: `${base}mitra/mitra-sleepy.png`,
  sad: `${base}mitra/mitra-sad.png`,
  flagUp: `${base}mitra/mitra-flag-up.png`,
  flagDown: `${base}mitra/mitra-flag-down.png`,
};

/** One face per greed-meter zone, keyed by the zone id in lib/data. */
export const mitraGreed: Record<string, string> = {
  fear: `${base}mitra/mitra-greed-fear.png`,
  cautious: `${base}mitra/mitra-greed-cautious.png`,
  neutral: `${base}mitra/mitra-greed-neutral.png`,
  warm: `${base}mitra/mitra-greed-warm.png`,
  greed: `${base}mitra/mitra-greed-greed.png`,
};
