import { motion } from "framer-motion";
import SectionCard from "./SectionCard";
import { stripEmojis, formatCurrencyBRL } from "../utils/format";
import { smallBtn } from "../utils/styles";

export default function MentorDashboard({ user, teams, pending, updateActivityStatus }) {
  const myTeams = teams.filter((t) => user.teamIds.includes(t.id));
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
      style={{ maxWidth: 1200, margin: "0 auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <SectionCard delay={0.1}>
        <motion.h2 
          style={{ margin: 0, color: "#0f5132" }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          whileHover={{ scale: 1.02, color: "#198754" }}
        >
          Mentor {user.name}
        </motion.h2>
      </SectionCard>

      <SectionCard delay={0.2}>
        <motion.div 
          style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Atualizações Pendentes
        </motion.div>
        {pending.length === 0 && (
          <motion.p 
            style={{ margin: 0, color: "#495057" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            Nenhuma pendente.
          </motion.p>
        )}
        {pending.map((p, i) => (
          <motion.div 
            key={i} 
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: 12, border: "1px solid #e9ecef", borderRadius: 8, marginBottom: 8 }}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.5 + (i * 0.1), duration: 0.4, type: "spring" }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              backgroundColor: "#f8f9fa"
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + (i * 0.1), duration: 0.3 }}
            >
              <b>{p.teamName}</b> - {p.nome} ({p.data})
            </motion.div>
            <motion.div 
              style={{ display: "flex", gap: 8 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + (i * 0.1), duration: 0.3, type: "spring" }}
            >
              <motion.button 
                style={smallBtn} 
                onClick={() => updateActivityStatus(p.id, "Aprovada")}
                whileHover={{ scale: 1.1, backgroundColor: "#20c997" }}
                whileTap={{ scale: 0.95 }}
              >
                Aprovar
              </motion.button>
              <motion.button 
                style={{ ...smallBtn, background: "#dc3545" }} 
                onClick={() => updateActivityStatus(p.id, "Rejeitada", "Dados insuficientes")}
                whileHover={{ scale: 1.1, backgroundColor: "#e55353" }}
                whileTap={{ scale: 0.95 }}
              >
                Rejeitar
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </SectionCard>

      <SectionCard delay={0.3}>
        <motion.div 
          style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Visão Geral
        </motion.div>
        <motion.table 
          width="100%" 
          style={{ borderCollapse: "collapse" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#495057" }}>
              <th style={{ padding: 8 }}>Equipe</th>
              <th style={{ padding: 8 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {myTeams.map((t, i) => (
              <motion.tr 
                key={t.id} 
                style={{ borderTop: "1px solid #e9ecef" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + (i * 0.1), duration: 0.4 }}
                whileHover={{ 
                  backgroundColor: "#f8f9fa",
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                <td style={{ padding: 8 }}>{stripEmojis(t.name)}</td>
                <motion.td 
                  style={{ padding: 8 }}
                  whileHover={{ fontWeight: "bold", color: "#198754" }}
                >
                  {formatCurrencyBRL(t.total)}
                </motion.td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </SectionCard>
    </motion.div>
  );
}
