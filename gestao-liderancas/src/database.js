// === BANCO DE DADOS LOCAL (localStorage) ===

// Estrutura dos dados
const DB_KEYS = {
  USERS: 'gestao_liderancas_users',
  TEAMS: 'gestao_liderancas_teams',
  ACTIVITIES: 'gestao_liderancas_activities',
  PENDING: 'gestao_liderancas_pending',
  RECENT: 'gestao_liderancas_recent'
};

// === INICIALIZAÇÃO DO BANCO ===
export function initializeDatabase() {
  // Verificar se já existe dados
  if (!localStorage.getItem(DB_KEYS.USERS)) {
    // Dados iniciais
    const initialUsers = [
      { id: 1, role: 'admin', name: 'Administrador', email: 'admin@fecap.com', password: 'admin123' },
      { id: 2, role: 'mentor', name: 'Carlos Silva', email: 'carlos@fecap.com', password: 'mentor123', teamIds: [1] },
      { id: 3, role: 'mentor', name: 'Ana Santos', email: 'ana@fecap.com', password: 'mentor123', teamIds: [2] },
      { id: 4, role: 'aluno', name: 'João Aluno', email: 'joao@fecap.com', password: 'aluno123', teamId: 1 },
      { id: 5, role: 'aluno', name: 'Maria Aluna', email: 'maria@fecap.com', password: 'aluno123', teamId: 2 }
    ];

    const initialTeams = [
      { id: 1, name: 'Equipe Alpha', mentor: 'Carlos Silva', total: 0, activities: [] },
      { id: 2, name: 'Equipe Beta', mentor: 'Ana Santos', total: 0, activities: [] }
    ];

    // Salvar dados iniciais
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(initialUsers));
    localStorage.setItem(DB_KEYS.TEAMS, JSON.stringify(initialTeams));
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.PENDING, JSON.stringify([]));
    localStorage.setItem(DB_KEYS.RECENT, JSON.stringify([]));
  }
}

// === FUNÇÕES DE USUÁRIOS ===
export function getAllUsers() {
  return JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
}

export function getUserById(id) {
  const users = getAllUsers();
  return users.find(user => user.id === id);
}

export function getUserByEmail(email) {
  const users = getAllUsers();
  return users.find(user => user.email === email);
}

export function authenticateUser(email, password) {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    // Remover senha do retorno por segurança
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
}

export function createUser(userData) {
  const users = getAllUsers();
  const newId = Math.max(...users.map(u => u.id), 0) + 1;
  
  const newUser = {
    id: newId,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  
  // Remover senha do retorno
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export function updateUser(id, userData) {
  const users = getAllUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...userData, updatedAt: new Date().toISOString() };
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }
  return null;
}

// === FUNÇÕES DE EQUIPES ===
export function getAllTeams() {
  return JSON.parse(localStorage.getItem(DB_KEYS.TEAMS) || '[]');
}

export function getTeamById(id) {
  const teams = getAllTeams();
  return teams.find(team => team.id === id);
}

export function createTeam(teamData) {
  const teams = getAllTeams();
  const newId = Math.max(...teams.map(t => t.id), 0) + 1;
  
  const newTeam = {
    id: newId,
    total: 0,
    activities: [],
    ...teamData,
    createdAt: new Date().toISOString()
  };
  
  teams.push(newTeam);
  localStorage.setItem(DB_KEYS.TEAMS, JSON.stringify(teams));
  return newTeam;
}

export function updateTeam(id, teamData) {
  const teams = getAllTeams();
  const index = teams.findIndex(team => team.id === id);
  
  if (index !== -1) {
    teams[index] = { ...teams[index], ...teamData, updatedAt: new Date().toISOString() };
    localStorage.setItem(DB_KEYS.TEAMS, JSON.stringify(teams));
    return teams[index];
  }
  return null;
}

// === FUNÇÕES DE ATIVIDADES ===
export function getAllActivities() {
  return JSON.parse(localStorage.getItem(DB_KEYS.ACTIVITIES) || '[]');
}

export function getActivitiesByTeam(teamId) {
  const activities = getAllActivities();
  return activities.filter(activity => activity.teamId === teamId);
}

export function createActivity(activityData) {
  const activities = getAllActivities();
  const newId = Math.max(...activities.map(a => a.id), 0) + 1;
  
  const newActivity = {
    id: newId,
    status: 'Pendente',
    ...activityData,
    createdAt: new Date().toISOString()
  };
  
  activities.push(newActivity);
  localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
  
  // Adicionar às pendências
  addToPending(newActivity);
  
  return newActivity;
}

export function updateActivityStatus(activityId, status, motivo = null) {
  const activities = getAllActivities();
  const index = activities.findIndex(activity => activity.id === activityId);
  
  if (index !== -1) {
    activities[index].status = status;
    activities[index].motivo = motivo;
    activities[index].updatedAt = new Date().toISOString();
    
    localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(activities));
    
    // Se aprovada, adicionar aos recentes
    if (status === 'Aprovada') {
      addToRecent(activities[index]);
    }
    
    // Remover das pendências
    removeFromPending(activityId);
    
    return activities[index];
  }
  return null;
}

// === FUNÇÕES DE PENDÊNCIAS ===
export function getPendingActivities() {
  return JSON.parse(localStorage.getItem(DB_KEYS.PENDING) || '[]');
}

function addToPending(activity) {
  const pending = getPendingActivities();
  pending.push(activity);
  localStorage.setItem(DB_KEYS.PENDING, JSON.stringify(pending));
}

function removeFromPending(activityId) {
  const pending = getPendingActivities();
  const filtered = pending.filter(activity => activity.id !== activityId);
  localStorage.setItem(DB_KEYS.PENDING, JSON.stringify(filtered));
}

// === FUNÇÕES DE RECENTES ===
export function getRecentActivities() {
  return JSON.parse(localStorage.getItem(DB_KEYS.RECENT) || '[]');
}

function addToRecent(activity) {
  const recent = getRecentActivities();
  recent.unshift(activity); // Adicionar no início
  // Manter apenas os últimos 50
  if (recent.length > 50) {
    recent.splice(50);
  }
  localStorage.setItem(DB_KEYS.RECENT, JSON.stringify(recent));
}

// === FUNÇÕES DE ESTATÍSTICAS ===
export function getTeamStats(teamId) {
  const team = getTeamById(teamId);
  const activities = getActivitiesByTeam(teamId);
  
  return {
    total: team?.total || 0,
    totalActivities: activities.length,
    approvedActivities: activities.filter(a => a.status === 'Aprovada').length,
    pendingActivities: activities.filter(a => a.status === 'Pendente').length,
    rejectedActivities: activities.filter(a => a.status === 'Rejeitada').length
  };
}

export function getGlobalStats() {
  const teams = getAllTeams();
  const activities = getAllActivities();
  
  return {
    totalTeams: teams.length,
    totalUsers: getAllUsers().length,
    totalActivities: activities.length,
    totalRaised: teams.reduce((sum, team) => sum + team.total, 0),
    pendingActivities: getPendingActivities().length
  };
}

// === FUNÇÕES DE BACKUP E RESTORE ===
export function exportData() {
  return {
    users: getAllUsers(),
    teams: getAllTeams(),
    activities: getAllActivities(),
    pending: getPendingActivities(),
    recent: getRecentActivities(),
    exportedAt: new Date().toISOString()
  };
}

export function importData(data) {
  try {
    if (data.users) localStorage.setItem(DB_KEYS.USERS, JSON.stringify(data.users));
    if (data.teams) localStorage.setItem(DB_KEYS.TEAMS, JSON.stringify(data.teams));
    if (data.activities) localStorage.setItem(DB_KEYS.ACTIVITIES, JSON.stringify(data.activities));
    if (data.pending) localStorage.setItem(DB_KEYS.PENDING, JSON.stringify(data.pending));
    if (data.recent) localStorage.setItem(DB_KEYS.RECENT, JSON.stringify(data.recent));
    return true;
  } catch (error) {
    console.error('Erro ao importar dados:', error);
    return false;
  }
}

export function clearAllData() {
  Object.values(DB_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
