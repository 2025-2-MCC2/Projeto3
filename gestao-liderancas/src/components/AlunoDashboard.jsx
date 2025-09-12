import { motion } from "framer-motion";
import SectionCard from "./SectionCard";
import RegisterForm from "./RegisterForm";
import { stripEmojis, formatCurrencyBRL } from "../utils/format";

export default function AlunoDashboard({ user, teams, onRegister }) {
  const team = teams.find((t) => t.id === user.teamId);
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.8 }}
      style={{ maxWidth: 1200, margin: "0 auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
    >
      <SectionCard delay={0.1}>
        <motion.div 
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <motion.h2 
            style={{ margin: 0, color: "#0f5132" }}
            whileHover={{ scale: 1.05, color: "#198754" }}
            transition={{ duration: 0.2 }}
          >
            {stripEmojis(team.name)} - {stripEmojis(user.name)}
          </motion.h2>
          <motion.div 
            style={{ color: "#0f5132", fontWeight: 800 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.1, color: "#198754" }}
          >
            Total: {formatCurrencyBRL(team.total)}
          </motion.div>
        </motion.div>
      </SectionCard>

      <SectionCard delay={0.2}>
        <RegisterForm onSubmit={onRegister} />
      </SectionCard>

      <SectionCard delay={0.3}>
        <motion.div 
          style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Histórico
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
              <th style={{ padding: 8 }}>Data</th>
              <th style={{ padding: 8 }}>Atividade</th>
              <th style={{ padding: 8 }}>Valor</th>
              <th style={{ padding: 8 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {team.activities.map((a, i) => (
              <motion.tr 
                key={i} 
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
                <td style={{ padding: 8 }}>{a.data}</td>
                <td style={{ padding: 8 }}>{stripEmojis(a.nome)}</td>
                <td style={{ padding: 8 }}>{a.tipo === "alimentos" ? `${a.valor} kg` : formatCurrencyBRL(a.valor)}</td>
                <motion.td 
                  style={{ padding: 8 }}
                  whileHover={{ 
                    fontWeight: "bold",
                    color: a.status === "Aprovada" ? "#198754" : a.status === "Rejeitada" ? "#dc3545" : "#ffc107"
                  }}
                >
                  {a.status}
                </motion.td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </SectionCard>
    </motion.div>
  );
}
