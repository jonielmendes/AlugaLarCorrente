import api from './api';
import type { LoginData, RegisterData, AuthResponse, User } from '../types';

export const authService = {
  // Login
  async login(dados: LoginData): Promise<AuthResponse> {
    // Backend espera username, então enviamos email como username
    const response = await api.post('/auth/login/', {
      username: dados.email,
      password: dados.password,
    });
    const { token, user } = response.data;
    
    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Registro
  async register(dados: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register/', dados);
    const { token, user } = response.data;
    
    // Salvar no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Buscar dados do usuário logado
  async me(): Promise<User> {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  // Pegar usuário do localStorage
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Verificar se é locador
  isLocador(): boolean {
    const user = this.getCurrentUser();
    return user?.perfil?.tipo === 'LOCADOR';
  },
};
