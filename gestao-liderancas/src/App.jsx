import { useState, useEffect } from "react";
import {
  initializeDatabase,
  getAllTeams,
  getPendingActivities,
  getRecentActivities,
  authenticateUser,
  createUser,
  createActivity,
  updateActivityStatus,
  
} from "./database";
import NavBar from "./components/NavBar";
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import AlunoDashboard from "./components/AlunoDashboard";
import MentorDashboard from "./components/MentorDashboard";
import AdminDashboard from "./components/AdminDashboard";

// Helpers moved to src/utils

export default function App() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [pending, setPending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [showRegister, setShowRegister] = useState(false);

  // === INICIALIZAR BANCO DE DADOS ===
  useEffect(() => {
    initializeDatabase();
    loadData();
  }, []);

  const loadData = () => {
    setTeams(getAllTeams());
    setPending(getPendingActivities());
    setRecent(getRecentActivities());
  };

  // === LOGIN COM BANCO DE DADOS ===
  const handleLogin = (email, password) => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      loadData();
    } else {
      alert("Email ou senha incorretos!");
    }
  };

  // === CADASTRO DE USUÁRIO ===
  const handleRegister = (userData) => {
    try {
      const newUser = createUser(userData);
      alert("Usuário cadastrado com sucesso!");
      setShowRegister(false);
      loadData();
    } catch (error) {
      alert("Erro ao cadastrar usuário: " + error.message);
    }
  };

  // === LOGOUT ===
  const handleLogout = () => setUser(null);

  // === REGISTRO DE DOAÇÃO (Aluno) ===
  const registerActivity = (activity) => {
    try {
      const team = teams.find(t => t.id === user.teamId);
      if (!team) {
        alert("Equipe não encontrada!");
        return;
      }

      const newActivity = createActivity({
        ...activity,
        teamId: user.teamId,
        teamName: team.name,
        userId: user.id
      });

      // Atualizar total da equipe se aprovada
      if (newActivity.status === "Aprovada") {
        const updatedTeams = teams.map(t => {
          if (t.id === user.teamId) {
            return { ...t, total: t.total + parseFloat(activity.valor) };
          }
          return t;
        });
        setTeams(updatedTeams);
      }

      loadData();
      alert("Atividade registrada com sucesso!");
    } catch (error) {
      alert("Erro ao registrar atividade: " + error.message);
    }
  };

  // === APROVAR OU REJEITAR (Mentor) ===
  const handleUpdateActivityStatus = (activityId, status, motivo = null) => {
    try {
      const updatedActivity = updateActivityStatus(activityId, status, motivo);
      
      if (updatedActivity && status === "Aprovada") {
        // Atualizar total da equipe
        const team = teams.find(t => t.id === updatedActivity.teamId);
        if (team) {
          const updatedTeams = teams.map(t => {
            if (t.id === updatedActivity.teamId) {
              return { ...t, total: t.total + parseFloat(updatedActivity.valor) };
            }
            return t;
          });
          setTeams(updatedTeams);
        }
      }

      loadData();
    } catch (error) {
      alert("Erro ao atualizar atividade: " + error.message);
    }
  };

  // === TELAS ===
  if (!user) {
    return showRegister ? 
      <RegisterScreen onRegister={handleRegister} onBackToLogin={() => setShowRegister(false)} /> :
      <LoginScreen onLogin={handleLogin} onShowRegister={() => setShowRegister(true)} />;
  }

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <NavBar user={user} onLogout={handleLogout} />
      {user.role === "aluno" && <AlunoDashboard user={user} teams={teams} onRegister={registerActivity} />}
      {user.role === "mentor" && <MentorDashboard user={user} teams={teams} pending={pending} updateActivityStatus={handleUpdateActivityStatus} />}
      {user.role === "admin" && <AdminDashboard teams={teams} recent={recent} />}
    </div>
  );
}

// Components moved to src/components
