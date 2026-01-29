import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isLocador, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="AlugaLar" style={{ height: '40px' }} />
        </Link>
        <ul className="navbar-nav">
          <li>
            <Link to="/">Início</Link>
          </li>
          <li>
            <Link to="/imoveis">Imóveis</Link>
          </li>
          {isAuthenticated ? (
            <>
              {isLocador && (
                <li>
                  <Link to="/dashboard">Minha Conta</Link>
                </li>
              )}
              <li>
                <span>Olá, {user?.first_name || user?.username}!</span>
              </li>
              <li>
                <button onClick={handleLogout}>Sair</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Entrar</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
