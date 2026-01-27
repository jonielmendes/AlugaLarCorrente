import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
          🏠 AlugaLar Corrente
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
                <span>Olá, {user?.username}!</span>
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
              <li>
                <Link to="/register">Cadastrar</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
