import { useState } from "react";
import { motion } from "framer-motion";

export default function RegisterForm({ onSubmit }) {
  const [form, setForm] = useState({ tipo: "", nome: "", valor: "", data: new Date().toLocaleDateString() });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      style={{ display: "flex", flexDirection: "column", gap: 12 }}
    >
      <motion.h3 
        style={{ margin: 0, color: "#0f5132" }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        whileHover={{ scale: 1.02, color: "#198754" }}
      >
        Registrar Atividade da Semana
      </motion.h3>

      <motion.select
        onChange={(e) => setForm({ ...form, tipo: e.target.value })}
        style={{
          padding: "14px 16px",
          borderRadius: 10,
          border: "1px solid #e9ecef",
          background: "#fff",
          color: "#212529",
          outline: "none",
          transition: "border-color .2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#198754")}
        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.1)" }}
      >
        <option value="">Selecione o tipo</option>
        <option value="alimentos">Arrecadação de Alimentos</option>
        <option value="fundos">Arrecadação de Fundos</option>
        <option value="evento">Evento/Bazar</option>
      </motion.select>

      <motion.input
        placeholder="Nome da Atividade"
        onChange={(e) => setForm({ ...form, nome: e.target.value })}
        style={{
          padding: "14px 16px",
          borderRadius: 10,
          border: "1px solid #e9ecef",
          background: "#fff",
          color: "#212529",
          outline: "none",
          transition: "border-color .2s ease",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#198754")}
        onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.1)" }}
      />

      <motion.div
        key={form.tipo}
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        {form.tipo === "alimentos" ? (
          <motion.input
            type="number"
            placeholder="Peso em Kg"
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              border: "1px solid #e9ecef",
              background: "#fff",
              color: "#212529",
              outline: "none",
              transition: "border-color .2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#198754")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.1)" }}
          />
        ) : (
          <motion.input
            type="number"
            placeholder="Valor Arrecadado (R$)"
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              border: "1px solid #e9ecef",
              background: "#fff",
              color: "#212529",
              outline: "none",
              transition: "border-color .2s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#198754")}
            onBlur={(e) => (e.target.style.borderColor = "#e9ecef")}
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(25, 135, 84, 0.1)" }}
          />
        )}
      </motion.div>

      <motion.button
        whileHover={{ 
          scale: 1.05, 
          boxShadow: "0 15px 35px rgba(25, 135, 84, .4)",
          y: -2
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, type: "spring", stiffness: 200 }}
        style={{
          background: "linear-gradient(90deg, #198754, #2ca06e)",
          color: "#fff",
          border: "none",
          padding: "14px 18px",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
          transition: "all .2s ease",
        }}
        onClick={() => onSubmit(form)}
      >
        Enviar para Aprovação
      </motion.button>
    </motion.div>
  );
}
