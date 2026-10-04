import { ProfileBadge } from "../../interfaces/badges.interfaces";

const BadgeImage = ({ badge, size }: { badge: ProfileBadge; size: number }) =>
  badge.img ? (
    <img
      src={badge.img}
      alt={badge.name}
      width={size}
      height={size}
      className="rounded-full object-cover shrink-0 block"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    />
  ) : (
    <div
      className="rounded-full flex items-center justify-center bg-gray-300 text-gray-700 font-semibold shrink-0"
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {badge.name.charAt(0).toUpperCase()}
    </div>
  );

export default BadgeImage;