import { createContext, useState, useEffect } from 'react';
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Product from "./pages/Product";
import Products from './pages/Products';
import MainLayout from "./loyauts/MainLoyaut";
import ErrorPages from "./pages/ErrorPages"; 

export const TokenContext = createContext<any>(null);
export const UserContext = createContext<any>(null);
export const ThemeContext = createContext<any>(null);

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<object>({});
  const [theme, setTheme] = useState<string>(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div>
      <UserContext.Provider value={{ user, setUser }}>
        <TokenContext.Provider value={{ token, setToken }}>
          <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <Routes>
              <Route path='/' element={<MainLayout><Home /></MainLayout>} />
              <Route path='/details/:id' element={<MainLayout><Product /></MainLayout>} />
              <Route path='/products' element={<MainLayout><Products /></MainLayout>} />
              <Route path='*' element={<ErrorPages />} />
            </Routes>
          </ThemeContext.Provider>
        </TokenContext.Provider>
      </UserContext.Provider>
    </div>
  );
}

export default App;
