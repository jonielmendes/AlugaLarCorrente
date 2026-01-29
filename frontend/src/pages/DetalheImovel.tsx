import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { imovelService } from '../services/imovelService';
import type { Imovel } from '../types';

const DetalheImovel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);

  const carregarImovel = useCallback(async () => {
    if (!id) return;
    console.log('Carregando imóvel com ID:', id);
    try {
      const data = await imovelService.buscarPorId(Number(id));
      console.log('Imóvel carregado:', data);
      setImovel(data);
    } catch (error) {
      console.error('Erro ao carregar imóvel:', error);
      navigate('/imoveis');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    carregarImovel();
  }, [carregarImovel]);

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (!imovel) {
    return <div>Imóvel não encontrado</div>;
  }

  return (
    <main>
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Voltar
        </button>

        <div className="imovel-detalhe">
          <div className="imovel-info" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="card-badge">{imovel.tipo_display}</div>
            <h1>{imovel.titulo}</h1>
            <p className="location">📍 {imovel.bairro_display}</p>
            <p className="price" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}>
              R$ {Number(imovel.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Descrição</h3>
              <p>{imovel.descricao}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Proprietário</h3>
              <p><strong>{imovel.dono.first_name} {imovel.dono.last_name}</strong></p>
              {imovel.dono.perfil && (
                <>
                  <p>📞 {imovel.dono.perfil.telefone}</p>
                  <p>✉️ {imovel.dono.email}</p>
                </>
              )}
              {imovel.telefone_contato && (
                <p>📱 {imovel.telefone_contato}</p>
              )}
            </div>

            {imovel.whatsapp_link && (
              <a
                href={imovel.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-success"
                style={{ width: '100%', textAlign: 'center', backgroundColor: '#25D366' }}
              >
                💬 Entrar em contato via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetalheImovel;
