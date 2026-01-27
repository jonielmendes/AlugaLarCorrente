import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListaImoveis from './pages/ListaImoveis';
import DetalheImovel from './pages/DetalheImovel';
import Dashboard from './pages/Dashboard';
import CadastrarImovel from './pages/CadastrarImovel';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/imoveis" element={<ListaImoveis />} />
          <Route path="/imoveis/:id" element={<DetalheImovel />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/anunciar" element={<CadastrarImovel />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
