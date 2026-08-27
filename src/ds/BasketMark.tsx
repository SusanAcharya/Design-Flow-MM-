import { useState } from "react";

/** Basket art is optional — anything without a file falls back to the house mark. */
export function BasketMark({ id }: { id: string }) {
  const [failed, setFailed] = useState(false);
  const src = `${import.meta.env.BASE_URL}baskets/${failed ? "default" : id}.svg`;
  return (
    <span className="basket-cover" aria-hidden>
      <img src={src} alt="" onError={() => setFailed(true)} />
    </span>
  );
}
