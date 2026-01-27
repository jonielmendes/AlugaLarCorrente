import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { imovelService } from '../services/imovelService';
import { BAIRROS, TIPOS_IMOVEL } from '../types';
import type { ImovelFormData } from '../types';
import './CadastrarImovel.css';

const CadastrarImovel: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLocador } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<ImovelFormData>({
    titulo: '',
    descricao: '',
    preco: '',
    bairro: '',
    tipo: '',
    telefone_contato: '',
    ativo: true,
  });
  
  const [fotoPrincipal, setFotoPrincipal] = useState<File | null>(null);
  const [fotoPrincipalPreview, setFotoPrincipalPreview] = useState<string>('');
  const [imagensAdicionais, setImagensAdicionais] = useState<File[]>([]);
  const [imagensAdicionaisPreview, setImagensAdicionaisPreview] = useState<string[]>([]);

  // Redirecionar se não for locador
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isLocador) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLocador, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFotoPrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFotoPrincipal(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPrincipalPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagensAdicionaisChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImagensAdicionais(prev => [...prev, ...files]);
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagensAdicionaisPreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removerImagemAdicional = (index: number) => {
    setImagensAdicionais(prev => prev.filter((_, i) => i !== index));
    setImagensAdicionaisPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validações
      if (!formData.titulo || !formData.descricao || !formData.preco || 
          !formData.bairro || !formData.tipo || !formData.telefone_contato) {
        throw new Error('Preencha todos os campos obrigatórios');
      }

      if (!fotoPrincipal) {
        throw new Error('Adicione pelo menos uma foto principal');
      }

      const dados: ImovelFormData = {
        ...formData,
        foto_principal: fotoPrincipal,
        imagens_upload: imagensAdicionais.length > 0 ? imagensAdicionais : undefined,
      };

      await imovelService.criar(dados);
      
      alert('Imóvel cadastrado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Erro ao cadastrar imóvel');
    } finally {
      setLoading(false);
    }
  };

  if (!isLocador) {
    return null;
  }

  return (
    <div className="cadastrar-imovel-container">
      <div className="cadastrar-imovel-card">
        <h1>Anunciar Imóvel</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="cadastrar-form">
          {/* Informações Básicas */}
          <div className="form-section">
            <h2>Informações Básicas</h2>
            
            <div className="form-group">
              <label htmlFor="titulo">Título do Anúncio *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                placeholder="Ex: Casa ampla com 3 quartos no Centro"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição *</label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Descreva o imóvel, seus diferenciais, condições..."
                rows={5}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipo">Tipo de Imóvel *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {TIPOS_IMOVEL.map(tipo => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="bairro">Bairro *</label>
                <select
                  id="bairro"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  {BAIRROS.map(bairro => (
                    <option key={bairro.value} value={bairro.value}>
                      {bairro.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="preco">Preço (R$) *</label>
                <input
                  type="number"
                  id="preco"
                  name="preco"
                  value={formData.preco}
                  onChange={handleInputChange}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone_contato">Telefone para Contato *</label>
                <input
                  type="tel"
                  id="telefone_contato"
                  name="telefone_contato"
                  value={formData.telefone_contato}
                  onChange={handleInputChange}
                  placeholder="(63) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>

          {/* Fotos */}
          <div className="form-section">
            <h2>Fotos</h2>
            
            <div className="form-group">
              <label htmlFor="foto_principal">Foto Principal *</label>
              <input
                type="file"
                id="foto_principal"
                accept="image/*"
                onChange={handleFotoPrincipalChange}
                required
              />
              {fotoPrincipalPreview && (
                <div className="image-preview">
                  <img src={fotoPrincipalPreview} alt="Preview" />
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="imagens_adicionais">Fotos Adicionais (opcional)</label>
              <input
                type="file"
                id="imagens_adicionais"
                accept="image/*"
                multiple
                onChange={handleImagensAdicionaisChange}
              />
              {imagensAdicionaisPreview.length > 0 && (
                <div className="images-preview-grid">
                  {imagensAdicionaisPreview.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={() => removerImagemAdicional(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="form-section">
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleInputChange}
                />
                <span>Publicar anúncio imediatamente</span>
              </label>
            </div>
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Publicando...' : 'Publicar Anúncio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarImovel;
