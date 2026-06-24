import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  viewKey: string;
  children: ReactNode;
}

export default function PageTransition({ viewKey, children }: PageTransitionProps) {
  return (
    <motion.div
      key={viewKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
