import { useState } from "react";

const art = new Set(["33", "58", "45", "17", "4", "22", "12", "9"]);

export function BrokerMark({
  code,
  size = "md",
}: {
  code: string;
  size?: "sm" | "md" | "lg";
}) {
  const [failed, setFailed] = useState(false);
  const showImg = art.has(code) && !failed;

  if (!showImg) {
    return (
      <span className={`broker-mark ${size}`} aria-hidden>
        {code}
      </span>
    );
  }

  return (
    <span className={`broker-mark has-img ${size}`} aria-hidden>
      <img
        src={`${import.meta.env.BASE_URL}brokers/${code}.svg`}
        alt=""
        onError={() => setFailed(true)}
      />
    </span>
  );
}
