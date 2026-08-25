import { user } from "../lib/data";

export function UserAvatar({ size = 40 }: { size?: number }) {
  return (
    <span className="avatar" style={{ width: size, height: size, borderRadius: Math.round(size * 0.34) }}>
      {user.initials}
    </span>
  );
}
