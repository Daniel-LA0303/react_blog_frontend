import { staggerContainer } from "../../utils/animationsUtils";
import ContactRow from "./ContactRow";
import SideCard from "./SideCard";
import { AnimatePresence, motion } from "framer-motion";
import SkillBadge from "./SkillBagde";
import StatItem from "../Global/StatItem";


const SidebarContent = ({
  user,
  dark,
  animated = true,
}: {
  user: any;
  dark: boolean;
  animated?: boolean;
}) => {
  const hasSocial = user?.info?.social;
  const hasSkills = user?.info?.skills?.length > 0;
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

      <SideCard title="Activity" dark={dark} delay={animated ? 2 : 0}>
        <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
          <StatItem label="Blogs Published" value={user?.numberPost || 0} delay={0} dark={dark} />
          <StatItem label="Likes Given" value={user?.likePost?.posts?.length || 0} delay={1} dark={dark} />
          <StatItem label="Followers" value={user?.followersUsers?.followers?.length || 0} delay={2} dark={dark} />
        </motion.ul>
      </SideCard>
    </>
  );
};

export default SidebarContent;