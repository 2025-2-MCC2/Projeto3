import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import KpiCard from "./KpiCard";
import { formatCurrencyBRL, formatNumberBR, stripEmojis } from "../utils/format";

export default function AdminDashboard({ teams, recent }) {
  const total = teams.reduce((acc, t) => acc + t.total, 0);
  const COLORS = ["#006400", "#0E7A0D", "#1E9E1B", "#2ECF25", "#65DB6B"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "linear-gradient(90deg, #0f5132, #198754)",
        color: "#fff",
        borderRadius: "14px",
        padding: "28px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 34, fontWeight: 800 }}>Resultados das Últimas Edições</div>
          <div style={{ opacity: 0.9 }}>Baixe os relatórios das últimas edições</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src="/logos/liderancas-empaticas.png" alt="Lideranças Empáticas" style={{ height: 64 }} />
          <img src="/logos/logo fecap.webp" alt="FECAP" style={{ height: 42 }} />
        </div>
      </div>

      {/* KPI Row */}
      <motion.div 
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <KpiCard title="Arrecadação Total em Kg" value={formatNumberBR(total, 2)} selectorLabel="Edição" delay={0.4} />
        <KpiCard title="Arrecadação Média | Edição" value={formatNumberBR(total / Math.max(teams.length, 1), 2)} selectorLabel="Semestre" delay={0.5} />
        <KpiCard title="Pessoas Atendidas | 6 Meses" value={formatNumberBR(1300)} selectorLabel="Selecionar período" rightLogo="/logos/logo fecap.webp" delay={0.6} />
      </motion.div>

      {/* Charts Grid */}
      <motion.div 
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        {/* Left: Pie */}
        <motion.div 
          style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", padding: 16 }}
          initial={{ opacity: 0, x: -30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            transition: { duration: 0.3 }
          }}
        >
          <motion.div 
            style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.4 }}
          >
            Distribuição por Equipe
          </motion.div>
          <motion.div 
            style={{ width: "100%", height: 300 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <ResponsiveContainer>
              <PieChart>
                <Pie data={teams} dataKey="total" nameKey="name" outerRadius={120} label>
                  {teams.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <ReTooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>

        {/* Right: Bar */}
        <motion.div 
          style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", padding: 16 }}
          initial={{ opacity: 0, x: 30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            transition: { duration: 0.3 }
          }}
        >
          <motion.div 
            style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            Arrecadação Total
          </motion.div>
          <motion.div 
            style={{ width: "100%", height: 300 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <ResponsiveContainer>
              <BarChart data={teams}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ReTooltip />
                <Bar dataKey="total" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Table: Ranking */}
      <motion.div 
        style={{ background: "#fff", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.06)", padding: 16 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        whileHover={{ 
          scale: 1.01,
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
          transition: { duration: 0.3 }
        }}
      >
        <motion.div 
          style={{ fontWeight: 700, marginBottom: 8, color: "#0f5132" }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.4, duration: 0.4 }}
        >
          Ranking de Equipes
        </motion.div>
        <motion.table 
          width="100%" 
          style={{ borderCollapse: "collapse" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <thead>
            <tr style={{ textAlign: "left", color: "#495057" }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ padding: 8 }}>Equipe</th>
              <th style={{ padding: 8 }}>Mentor</th>
              <th style={{ padding: 8 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {teams.slice().sort((a, b) => b.total - a.total).map((t, i) => (
              <motion.tr 
                key={t.id} 
                style={{ borderTop: "1px solid #e9ecef" }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.6 + (i * 0.1), duration: 0.4 }}
                whileHover={{ 
                  backgroundColor: "#f8f9fa",
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.td 
                  style={{ padding: 8 }}
                  whileHover={{ fontWeight: "bold", color: "#198754" }}
                >
                  {i + 1}
                </motion.td>
                <td style={{ padding: 8 }}>{stripEmojis(t.name)}</td>
                <td style={{ padding: 8 }}>{stripEmojis(t.mentor)}</td>
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
      </motion.div>
    </motion.div>
  );
}
