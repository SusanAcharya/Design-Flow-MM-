const files = {
  search: `${import.meta.env.BASE_URL}icons/search.svg`,
  menu: `${import.meta.env.BASE_URL}icons/menu.svg`,
  bell: `${import.meta.env.BASE_URL}icons/bell.svg`,
  info: `${import.meta.env.BASE_URL}icons/info.svg`,
  home: `${import.meta.env.BASE_URL}icons/home.svg`,
  market: `${import.meta.env.BASE_URL}icons/market.svg`,
  discover: `${import.meta.env.BASE_URL}icons/discover.svg`,
  wallet: `${import.meta.env.BASE_URL}icons/wallet.svg`,
  more: `${import.meta.env.BASE_URL}icons/more.svg`,
  learn: `${import.meta.env.BASE_URL}icons/learn.svg`,
  tulkey: `${import.meta.env.BASE_URL}icons/tulkey.svg`,
  chev: `${import.meta.env.BASE_URL}icons/chev.svg`,
  ext: `${import.meta.env.BASE_URL}icons/ext.svg`,
  clock: `${import.meta.env.BASE_URL}icons/clock.svg`,
  shield: `${import.meta.env.BASE_URL}icons/shield.svg`,
  back: `${import.meta.env.BASE_URL}icons/back.svg`,
  star: `${import.meta.env.BASE_URL}icons/star.svg`,
  dots: `${import.meta.env.BASE_URL}icons/dots.svg`,
  cal: `${import.meta.env.BASE_URL}icons/cal.svg`,
  alert: `${import.meta.env.BASE_URL}icons/alert.svg`,
  compare: `${import.meta.env.BASE_URL}icons/compare.svg`,
  refresh: `${import.meta.env.BASE_URL}icons/refresh.svg`,
  "triangle-up": `${import.meta.env.BASE_URL}icons/triangle-up.svg`,
  "triangle-down": `${import.meta.env.BASE_URL}icons/triangle-down.svg`,
  mic: `${import.meta.env.BASE_URL}icons/mic.svg`,
  send: `${import.meta.env.BASE_URL}icons/send.svg`,
  pulse: `${import.meta.env.BASE_URL}icons/pulse.svg`,
  table: `${import.meta.env.BASE_URL}icons/table.svg`,
  depth: `${import.meta.env.BASE_URL}icons/depth.svg`,
  candles: `${import.meta.env.BASE_URL}icons/candles.svg`,
  sliders: `${import.meta.env.BASE_URL}icons/sliders.svg`,
  split: `${import.meta.env.BASE_URL}icons/split.svg`,
  gauge: `${import.meta.env.BASE_URL}icons/gauge.svg`,
  calc: `${import.meta.env.BASE_URL}icons/calc.svg`,
  index: `${import.meta.env.BASE_URL}icons/index.svg`,
  pie: `${import.meta.env.BASE_URL}icons/pie.svg`,
  range: `${import.meta.env.BASE_URL}icons/range.svg`,
  movers: `${import.meta.env.BASE_URL}icons/movers.svg`,
  building: `${import.meta.env.BASE_URL}icons/building.svg`,
  coins: `${import.meta.env.BASE_URL}icons/coins.svg`,
  percent: `${import.meta.env.BASE_URL}icons/percent.svg`,
  coin: `${import.meta.env.BASE_URL}icons/coin.svg`,
  users: `${import.meta.env.BASE_URL}icons/users.svg`,
  merge: `${import.meta.env.BASE_URL}icons/merge.svg`,
  ingot: `${import.meta.env.BASE_URL}icons/ingot.svg`,
  forex: `${import.meta.env.BASE_URL}icons/forex.svg`,
  bank: `${import.meta.env.BASE_URL}icons/bank.svg`,
  news: `${import.meta.env.BASE_URL}icons/news.svg`,
  mail: `${import.meta.env.BASE_URL}icons/mail.svg`,
  doc: `${import.meta.env.BASE_URL}icons/doc.svg`,
  megaphone: `${import.meta.env.BASE_URL}icons/megaphone.svg`,
  book: `${import.meta.env.BASE_URL}icons/book.svg`,
  terminal: `${import.meta.env.BASE_URL}icons/terminal.svg`,
  idcard: `${import.meta.env.BASE_URL}icons/idcard.svg`,
  vault: `${import.meta.env.BASE_URL}icons/vault.svg`,
  clipboard: `${import.meta.env.BASE_URL}icons/clipboard.svg`,
};

export type IconName = keyof typeof files;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 20, className }: Props) {
  return (
    <span
      className={`icon ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${files[name]})`,
        maskImage: `url(${files[name]})`,
      }}
      aria-hidden
    />
  );
}
