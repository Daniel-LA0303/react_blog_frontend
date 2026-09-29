import { KanbanUser } from "../../interfaces/projects.interfaces";

const Avatar = ({ user, size = 7 }: { user: KanbanUser; size?: number }) => (
  <img
    src={user.profilePicture?.secure_url || '/avatar.png'}
    alt={user.name}
    title={user.name}
    className={`h-${size} w-${size} rounded-full object-cover ring-2 ring-white dark:ring-[#27272A] flex-shrink-0`}
  />
)
export default Avatar;