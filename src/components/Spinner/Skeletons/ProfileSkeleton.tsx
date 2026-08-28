import SkeletonPulse from "./SkeletonPulse";

const ProfileSkeleton = ({ dark }: { dark: boolean }) => (
  <div className={`overflow-hidden rounded-2xl shadow-sm border ${dark ? 'bg-[#27272A] border-gray-800' : 'bg-white border-gray-100'} p-8`}>
    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
      <SkeletonPulse className="h-24 w-24 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3 w-full">
        <SkeletonPulse className="h-6 w-48" />
        <SkeletonPulse className="h-4 w-36" />
        <SkeletonPulse className="h-4 w-28" />
      </div>
    </div>
  </div>
);

export default ProfileSkeleton;