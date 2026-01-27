import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    tipo_perfil: 'LOCATARIO' as 'LOCADOR' | 'LOCATARIO',
    telefone: '',
    cpf_cnpj: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem');
      return;
    }

    setLoading(true);

    try {
      // Transformar dados para o formato que o backend espera
      const dadosBackend = {
        username: formData.email, // Usar email como username
        email: formData.email,
        password: formData.password,
        password2: formData.password2,
        first_name: formData.first_name,
        last_name: formData.last_name,
        tipo: formData.tipo_perfil, // Renomear campo
        telefone: formData.telefone,
      };
      
      const data = await authService.register(dadosBackend);
      login(data.user);
      navigate('/dashboard');
    } catch (err) {
      const error = err as { response?: { data?: { email?: string[]; error?: string; username?: string[] } } };
      setError(
        error.response?.data?.email?.[0] || 
        error.response?.data?.username?.[0] || 
        error.response?.data?.error || 
        'Erro ao cadastrar'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div className="container">
        <div className="auth-form">
          <h1>Cadastro</h1>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">Nome</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="last_name">Sobrenome</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password2">Confirmar Senha</label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo_perfil">Tipo de Perfil</label>
                <select
                  id="tipo_perfil"
                  name="tipo_perfil"
                  value={formData.tipo_perfil}
                  onChange={handleChange}
                  required
                >
                  <option value="LOCATARIO">Locatário (quero alugar)</option>
                  <option value="LOCADOR">Locador (tenho imóveis)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                  type="tel"
                  id="telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(99) 99999-9999"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
              <input
                type="text"
                id="cpf_cnpj"
                name="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Já tem conta? <Link to="/login">Faça login</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
