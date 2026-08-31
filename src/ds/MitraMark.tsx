import { mitra } from "../lib/mitra";

/**
 * Mitra's face, used where the guide *is* the destination — the nav tab and the
 * Home FAB. The rest of the nav is mask icons, which are single-colour by
 * design; the topi and the green are the whole point of this one, so it stays a
 * real image and desaturates instead of tinting when the tab is off.
 */
export function MitraMark({ size = 22, className }: { size?: number; className?: string }) {
  return (
    <img
      className={`mitra-mark${className ? ` ${className}` : ""}`}
      src={mitra.mark}
      alt=""
      width={size}
      height={size}
    />
  );
}
