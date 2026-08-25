const files: Record<string, string> = {
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
};

type Props = {
  name: keyof typeof files;
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
