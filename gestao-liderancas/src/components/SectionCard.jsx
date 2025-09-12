import { motion } from "framer-motion";

export default function SectionCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        transition: { duration: 0.2 }
      }}
      style={{ 
        background: "#fff", 
        borderRadius: 12, 
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)", 
        padding: 16,
        cursor: "default"
      }}
    >
      {children}
    </motion.div>
  );
}
