'use client';

import { motion, Variants } from 'framer-motion';

function LoadingThreeDots() {
  const dotVariants: Variants = {
    jump: {
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: 'mirror',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{ staggerChildren: -0.2, staggerDirection: -1 }}
      className="flex justify-center items-center gap-2"
    >
      <motion.span
        className="w-2 h-2 bg-primary rounded-full"
        variants={dotVariants}
      />

      <motion.span
        className="w-2 h-2 bg-primary rounded-full"
        variants={dotVariants}
      />

      <motion.span
        className="w-2 h-2 bg-primary rounded-full"
        variants={dotVariants}
      />
    </motion.div>
  );
}

export default LoadingThreeDots;
