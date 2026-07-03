import { createContext, useContext, useState, useEffect } from 'react';
import { ADMIN_CONFIG } from '../config/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('exam_portal_user');
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('exam_portal_role') === 'admin';
    }
    return false;
  });

  const adminLogin = (username, password) => {
    if (username === ADMIN_CONFIG.username && password === ADMIN_CONFIG.password) {
      const adminUser = { username: ADMIN_CONFIG.username, name: 'Administrator' };
      setUser(adminUser);
      setIsAdmin(true);
      sessionStorage.setItem('exam_portal_user', JSON.stringify(adminUser));
      sessionStorage.setItem('exam_portal_role', 'admin');
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const candidateLogin = (candidateId, password) => {
    // This will be handled by the service calling GAS
    // For now, return error to indicate it needs GAS
    return { success: false, error: 'Candidate login requires backend connection' };
  };

  const setCandidateSession = (candidateData) => {
    setUser(candidateData);
    setIsAdmin(false);
    sessionStorage.setItem('exam_portal_user', JSON.stringify(candidateData));
    sessionStorage.setItem('exam_portal_role', 'candidate');
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    sessionStorage.removeItem('exam_portal_user');
    sessionStorage.removeItem('exam_portal_role');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAuthenticated: !!user, adminLogin, candidateLogin, setCandidateSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
