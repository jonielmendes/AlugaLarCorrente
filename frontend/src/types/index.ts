// Types para o sistema AlugaLar Corrente

export interface Perfil {
  tipo: 'LOCADOR' | 'LOCATARIO';
  telefone: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  perfil: Perfil;
}

export interface ImagemImovel {
  id: number;
  imagem: string;
  descricao: string;
  ordem: number;
}

export interface Imovel {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  endereco: string;
  quartos: number;
  banheiros: number;
  area_m2: number;
  tipo: string;
  mobiliado: boolean;
  aceita_pet: boolean;
  garagem: boolean;
  foto_principal: string;
  ativo: boolean;
  visualizacoes: number;
  criado_em: string;
  atualizado_em: string;
  proprietario: User;
  imagens?: ImagemImovel[];
  whatsapp_link: string;
}

export interface ImovelListItem {
  id: number;
  titulo: string;
  preco: number;
  endereco: string;
  quartos: number;
  banheiros: number;
  area_m2: number;
  tipo: string;
  foto_principal: string;
  ativo: boolean;
  visualizacoes: number;
  criado_em: string;
  whatsapp_link: string;
}

export interface ImovelFormData {
  titulo: string;
  descricao: string;
  preco: number | string;
  bairro: string;
  tipo: string;
  telefone_contato: string;
  foto_principal?: File;
  ativo: boolean;
  imagens_upload?: File[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password2: string;
  first_name: string;
  last_name: string;
  tipo: 'LOCADOR' | 'LOCATARIO';
  telefone: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface FiltrosImoveis {
  bairro?: string;
  tipo?: string;
  preco_min?: number;
  preco_max?: number;
  search?: string;
  ordering?: string;
  page?: number;
}

export const BAIRROS = [
  { value: 'centro', label: 'Centro' },
  { value: 'nova_corrente', label: 'Nova Corrente' },
  { value: 'aeroporto_i', label: 'Aeroporto I' },
  { value: 'aeroporto_ii', label: 'Aeroporto II' },
  { value: 'vermelhao', label: 'Vermelhão' },
  { value: 'sincerino', label: 'Sincerino' },
  { value: 'vila_nova', label: 'Vila Nova' },
];

export const TIPOS_IMOVEL = [
  { value: 'casa', label: 'Casa' },
  { value: 'kitnet', label: 'Kitnet' },
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'quarto', label: 'Quarto' },
];
