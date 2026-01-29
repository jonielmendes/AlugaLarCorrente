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
          
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '2rem',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo_perfil: 'LOCATARIO' })}
              style={{
                flex: 1,
                padding: '2rem 1rem',
                border: formData.tipo_perfil === 'LOCATARIO' ? '3px solid #3182ce' : '2px solid #ccc',
                borderRadius: '8px',
                background: formData.tipo_perfil === 'LOCATARIO' ? '#e6f2ff' : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: formData.tipo_perfil === 'LOCATARIO' ? '0 4px 12px rgba(49, 130, 206, 0.2)' : 'none'
              }}
            >
              <span style={{ fontSize: '3rem' }}>🏠</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Locatário</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Quero alugar</span>
            </button>

            <button
              type="button"
              onClick={() => setFormData({ ...formData, tipo_perfil: 'LOCADOR' })}
              style={{
                flex: 1,
                padding: '2rem 1rem',
                border: formData.tipo_perfil === 'LOCADOR' ? '3px solid #3182ce' : '2px solid #ccc',
                borderRadius: '8px',
                background: formData.tipo_perfil === 'LOCADOR' ? '#e6f2ff' : 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                boxShadow: formData.tipo_perfil === 'LOCADOR' ? '0 4px 12px rgba(49, 130, 206, 0.2)' : 'none'
              }}
            >
              <span style={{ fontSize: '3rem' }}>🔑</span>
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Locador</span>
              <span style={{ fontSize: '0.9rem', color: '#666' }}>Tenho imóveis</span>
            </button>
          </div>
          
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
