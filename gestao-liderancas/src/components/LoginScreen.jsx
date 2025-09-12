import { useState } from "react";
import { motion } from "framer-motion";
import { btnStyle } from "../utils/styles";

export default function LoginScreen({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f8f9fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 20px 40px rgba(0, 100, 0, 0.1)",
          padding: "60px 50px",
          maxWidth: "500px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Logos Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
            marginBottom: "40px",
          }}
        >
          <img
            src="/logos/liderancas-empaticas.png"
            alt="Lideranças Empáticas"
            style={{ width: 140, height: 140, objectFit: "contain", display: "block" }}
          />
          <img
            src="/logos/logo fecap.webp"
            alt="FECAP"
            style={{ width: 140, height: 140, objectFit: "contain", display: "block" }}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{
            color: "#006400",
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: "700",
            fontSize: "28px",
            marginBottom: "10px",
            margin: "0 0 10px 0",
          }}
        >
          Plataforma de Gestão
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            color: "#666",
            fontSize: "16px",
            marginBottom: "40px",
            margin: "0 0 40px 0",
          }}
        >
          Sistema de Gestão de Lideranças Empáticas
        </motion.p>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "15px 20px",
              borderRadius: "12px",
              border: "2px solid #e1e5e9",
              fontSize: "16px",
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: "#ffffff",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#006400")}
            onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "15px 20px",
              borderRadius: "12px",
              border: "2px solid #e1e5e9",
              fontSize: "16px",
              fontFamily: "'Montserrat', sans-serif",
              backgroundColor: "#ffffff",
              color: "#333",
              outline: "none",
              transition: "border-color 0.3s ease",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#006400")}
            onBlur={(e) => (e.target.style.borderColor = "#e1e5e9")}
          />

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0, 100, 0, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              ...btnStyle,
              padding: "18px 30px",
              fontSize: "18px",
              borderRadius: "12px",
              marginTop: "10px",
              boxShadow: "0 5px 15px rgba(0, 100, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
            onClick={() => onLogin(email, password)}
          >
            Entrar no Sistema
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: "transparent",
              color: "#006400",
              border: "2px solid #006400",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "16px",
              cursor: "pointer",
              fontWeight: "700",
              transition: "all 0.3s ease",
            }}
            onClick={onShowRegister}
          >
            Criar Conta
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
