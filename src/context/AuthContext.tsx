import { createContext, useContext, useState, useEffect } from 'react';

// Provide a safe default object so destructuring never throws a "null" error
const AuthContext = createContext<any>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // When the app loads, check if we have a saved user in the browser's memory
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user data");
      }
    }
  }, [token]);

  const login = (userData: any, userToken: string) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(userToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context safely
export const useAuth = () => useContext(AuthContext);