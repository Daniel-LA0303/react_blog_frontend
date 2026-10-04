import { staggerContainer } from "../../utils/animationsUtils";
import ContactRow from "./ContactRow";
import SideCard from "./SideCard";
import { AnimatePresence, motion } from "framer-motion";
import SkillBadge from "./SkillBagde";
import StatItem from "../Global/StatItem";
import { ProfileBadge } from "../../interfaces/badges.interfaces";
import { useState } from "react";
import Tooltip from "../Global/TooTip";
import BadgeImage from "../Badge/BadgeImage";
import UIModal from "../Global/UIModal";


const SidebarContent = ({
  user,
  dark,
  badges = [],
  animated = true,
}: {
  user: any;
  dark: boolean;
  badges?: ProfileBadge[];
  animated?: boolean;
}) => {
  const [showAllBadges, setShowAllBadges] = useState(false);

  const hasSocial = user?.info?.social;
  const hasSkills = user?.info?.skills?.length > 0;

  const visibleBadges = badges.slice(0, 5);
  const extraCount = badges.length - visibleBadges.length;

  return (
    <>
      <SideCard title="Contact" dark={dark} delay={animated ? 1 : 0}>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-3">
          {user?.email && <ContactRow icon="fa-solid fa-envelope" value={user.email} delay={0} />}
          {hasSocial?.facebook && <ContactRow icon="fa-brands fa-facebook" value={hasSocial.facebook} delay={1} />}
          {hasSocial?.instagram && <ContactRow icon="fa-brands fa-instagram" value={hasSocial.instagram} delay={2} />}
          {hasSocial?.twitter && <ContactRow icon="fa-brands fa-twitter" value={hasSocial.twitter} delay={3} />}
          {hasSocial?.youtube && <ContactRow icon="fa-brands fa-youtube" value={hasSocial.youtube} delay={4} />}
          {hasSocial?.linkedin && <ContactRow icon="fa-brands fa-linkedin" value={hasSocial.linkedin} delay={5} />}
        </motion.div>
      </SideCard>

      <AnimatePresence>
        {hasSkills && (
          <SideCard title="Skills" dark={dark} delay={animated ? 1.5 : 0}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-wrap gap-2">
              {user.info.skills.map((skill: string, i: number) => (
                <SkillBadge key={i} skill={skill} index={i} />
              ))}
            </motion.div>
          </SideCard>
        )}
      </AnimatePresence>

      {/* Badges (nuevo) */}
      {badges.length > 0 && (
        <SideCard title="Badges" dark={dark} delay={animated ? 1.75 : 0}>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-2"
          >
            {visibleBadges.map((badge) => (
              <Tooltip key={badge._id} text={badge.description}>
                <BadgeImage badge={badge} size={40} />
              </Tooltip>
            ))}

            {extraCount > 0 && (
              <button
                onClick={() => setShowAllBadges(true)}
                className={`w-10 h-10 rounded-full text-xs font-semibold transition-colors
                  ${dark
                    ? "bg-white/10 text-gray-200 hover:bg-white/20"
                    : "bg-black/5 text-gray-700 hover:bg-black/10"}`}
                aria-label={`Ver ${extraCount} insignias más`}
              >
                +{extraCount}
              </button>
            )}
          </motion.div>
        </SideCard>
      )}

      <SideCard title="Activity" dark={dark} delay={animated ? 2 : 0}>
        <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
          <StatItem label="Blogs Published" value={user?.numberPost || 0} delay={0} dark={dark} />
          <StatItem label="Likes Given" value={user?.likePost?.posts?.length || 0} delay={1} dark={dark} />
          <StatItem label="Followers" value={user?.followersUsers?.followers?.length || 0} delay={2} dark={dark} />
        </motion.ul>
      </SideCard>

      <UIModal
        open={showAllBadges}
        onClose={() => setShowAllBadges(false)}
        dark={dark}
        maxWidth={480}
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-base font-semibold ${dark ? "text-white" : "text-gray-900"}`}>
              Badges ({badges.length})
            </h3>
            <button
              onClick={() => setShowAllBadges(false)}
              className={dark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"}
              aria-label="Cerrar"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 ui-scroll-y">
            {badges.map((badge) => (
              <li key={badge._id} className="flex items-center gap-3">
                {badge.img ? (
                  <img
                    src={badge.img}
                    alt={badge.name}
                    className="w-8 h-8 mx-0 rounded-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300 text-gray-700 font-semibold flex items-center justify-center shrink-0">
                    {badge.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0">
                  <p className={`text-sm font-medium ${dark ? "text-white" : "text-gray-900"}`}>
                    {badge.name}
                  </p>
                  <p className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}>
                    {badge.description}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${dark ? "text-gray-500" : "text-gray-400"}`}>
                    {new Date(badge.awardedAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </UIModal>
    </>
  );
};

export default SidebarContent;