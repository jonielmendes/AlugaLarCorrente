import api from './api';
import type {
  Imovel,
  ImovelListItem,
  ImovelFormData,
  PaginatedResponse,
  FiltrosImoveis,
} from '../types';

export const imovelService = {
  // Listar todos os imóveis com filtros
  async listar(filtros?: FiltrosImoveis): Promise<PaginatedResponse<ImovelListItem>> {
    const params = new URLSearchParams();
    
    if (filtros) {
      if (filtros.bairro) params.append('bairro', filtros.bairro);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.preco_min) params.append('preco_min', filtros.preco_min.toString());
      if (filtros.preco_max) params.append('preco_max', filtros.preco_max.toString());
      if (filtros.search) params.append('search', filtros.search);
      if (filtros.ordering) params.append('ordering', filtros.ordering);
      if (filtros.page) params.append('page', filtros.page.toString());
    }
    
    const response = await api.get(`/imoveis/?${params.toString()}`);
    return response.data;
  },

  // Buscar imóvel por ID
  async buscarPorId(id: number): Promise<Imovel> {
    const response = await api.get(`/imoveis/${id}/`);
    return response.data;
  },

  // Buscar imóveis em destaque
  async destaques(): Promise<ImovelListItem[]> {
    const response = await api.get('/imoveis/destaques/');
    return response.data;
  },

  // Buscar meus imóveis (requer autenticação)
  async meusImoveis(): Promise<ImovelListItem[]> {
    const response = await api.get('/imoveis/meus_imoveis/');
    return response.data;
  },

  // Criar novo imóvel (requer autenticação)
  async criar(dados: ImovelFormData): Promise<Imovel> {
    const formData = new FormData();
    
    formData.append('titulo', dados.titulo);
    formData.append('descricao', dados.descricao);
    formData.append('preco', dados.preco.toString());
    formData.append('bairro', dados.bairro);
    formData.append('tipo', dados.tipo);
    formData.append('telefone_contato', dados.telefone_contato);
    formData.append('ativo', dados.ativo.toString());
    
    if (dados.foto_principal) {
      formData.append('foto_principal', dados.foto_principal);
    }
    
    if (dados.imagens_upload && dados.imagens_upload.length > 0) {
      dados.imagens_upload.forEach((imagem) => {
        formData.append('imagens_upload', imagem);
      });
    }
    
    const response = await api.post('/imoveis/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Atualizar imóvel (requer autenticação)
  async atualizar(id: number, dados: Partial<ImovelFormData>): Promise<Imovel> {
    const formData = new FormData();
    
    if (dados.titulo) formData.append('titulo', dados.titulo);
    if (dados.descricao) formData.append('descricao', dados.descricao);
    if (dados.preco) formData.append('preco', dados.preco.toString());
    if (dados.bairro) formData.append('bairro', dados.bairro);
    if (dados.tipo) formData.append('tipo', dados.tipo);
    if (dados.telefone_contato) formData.append('telefone_contato', dados.telefone_contato);
    if (dados.ativo !== undefined) formData.append('ativo', dados.ativo.toString());
    
    if (dados.foto_principal) {
      formData.append('foto_principal', dados.foto_principal);
    }
    
    if (dados.imagens_upload && dados.imagens_upload.length > 0) {
      dados.imagens_upload.forEach((imagem) => {
        formData.append('imagens_upload', imagem);
      });
    }
    
    const response = await api.patch(`/imoveis/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Ativar/Desativar imóvel (requer autenticação)
  async toggleAtivo(id: number): Promise<Imovel> {
    const response = await api.post(`/imoveis/${id}/toggle_ativo/`);
    return response.data;
  },

  // Deletar imóvel (requer autenticação)
  async deletar(id: number): Promise<void> {
    await api.delete(`/imoveis/${id}/`);
  },

  // Buscar estatísticas
  async estatisticas(): Promise<Record<string, unknown>> {
    const response = await api.get('/imoveis/estatisticas/');
    return response.data;
  },
};
