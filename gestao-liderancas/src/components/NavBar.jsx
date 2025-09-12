import { motion } from "framer-motion";
import { stripEmojis } from "../utils/format";

export default function NavBar({ user, onLogout }) {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        width: "100%",
        background: "linear-gradient(90deg, #0f5132, #198754)",
        color: "#ffffff",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "'Montserrat', sans-serif",
        fontWeight: "700",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <span>Gestão de Lideranças</span>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <span style={{ opacity: 0.95 }}>{user.role.toUpperCase()} - {stripEmojis(user.name)}</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor: "#ffffff",
            color: "#0f5132",
            border: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "700",
          }}
          onClick={onLogout}
        >
          Sair
        </motion.button>
      </div>
    </motion.div>
  );
}
