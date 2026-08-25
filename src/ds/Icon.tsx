const files: Record<string, string> = {
  search: "/icons/search.svg",
  menu: "/icons/menu.svg",
  bell: "/icons/bell.svg",
  info: "/icons/info.svg",
  home: "/icons/home.svg",
  market: "/icons/market.svg",
  discover: "/icons/discover.svg",
  wallet: "/icons/wallet.svg",
  more: "/icons/more.svg",
  learn: "/icons/learn.svg",
  chev: "/icons/chev.svg",
  ext: "/icons/ext.svg",
  clock: "/icons/clock.svg",
  shield: "/icons/shield.svg",
  back: "/icons/back.svg",
  star: "/icons/star.svg",
  dots: "/icons/dots.svg",
  cal: "/icons/cal.svg",
  alert: "/icons/alert.svg",
  compare: "/icons/compare.svg",
  refresh: "/icons/refresh.svg",
  "triangle-up": "/icons/triangle-up.svg",
  "triangle-down": "/icons/triangle-down.svg",
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
