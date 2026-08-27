import { useState } from "react";
import { user } from "../lib/data";
import { useApp } from "../lib/state";

/* The member has a face, not two letters. Art can fail; initials still work. */
export function UserAvatar({ size = 40, art = true }: { size?: number; art?: boolean }) {
  const { avatar } = useApp();
  const [failed, setFailed] = useState(false);
  const radius = Math.round(size * 0.34);

  if (!art || failed) {
    return (
      <span className="avatar" style={{ width: size, height: size, borderRadius: radius }}>
        {user.initials}
      </span>
    );
  }

  return (
    <span className="avatar avatar-art" style={{ width: size, height: size, borderRadius: radius }}>
      <img src={avatar} alt="" onError={() => setFailed(true)} />
    </span>
  );
}
