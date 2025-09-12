import { motion } from "framer-motion";

export default function KpiCard({ title, value, selectorLabel, rightLogo, delay = 0 }) {
  return (
    <motion.div 
      style={{ 
        background: "#fff", 
        borderRadius: 12, 
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)", 
        padding: 16, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        gap: 12 
      }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay, 
        duration: 0.6, 
        type: "spring", 
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        y: -5,
        transition: { duration: 0.3 }
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <motion.div 
          style={{ color: "#495057", fontSize: 14 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2, duration: 0.4 }}
        >
          {title}
        </motion.div>
        <motion.div 
          style={{ color: "#0f5132", fontSize: 28, fontWeight: 800 }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3, duration: 0.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.1, color: "#198754" }}
        >
          {value}
        </motion.div>
        <motion.select 
          style={{ border: "1px solid #e9ecef", borderRadius: 8, padding: "8px 10px", width: 180 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.4, duration: 0.4 }}
          whileHover={{ scale: 1.02, borderColor: "#198754" }}
          whileFocus={{ scale: 1.02, borderColor: "#198754", boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.1)" }}
        >
          <option>{selectorLabel}</option>
        </motion.select>
      </div>
      {rightLogo && (
        <motion.img 
          src={rightLogo} 
          alt="logo" 
          style={{ height: 28 }}
          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.5, type: "spring" }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        />
      )}
    </motion.div>
  );
}
