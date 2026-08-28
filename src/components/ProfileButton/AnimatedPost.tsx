import { useInView, motion } from "framer-motion";
import { useRef } from "react";
import { fadeUp } from "../../utils/animationsUtils";
import Post from "../Post/Post";

const AnimatedPost = ({ post, index }: { post: any; index: number }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp}
      custom={index % 3}
    >
      <Post post={post} />
    </motion.div>
  );
};

export default AnimatedPost;