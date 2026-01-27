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
    try {
      const data = await imovelService.buscarPorId(Number(id));
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
          <div className="imovel-imagens">
            <img
              src={`http://127.0.0.1:8000${imovel.foto_principal}`}
              alt={imovel.titulo}
              className="imagem-principal"
            />
            {imovel.imagens && imovel.imagens.length > 0 && (
              <div className="galeria">
                {imovel.imagens.map((img) => (
                  <img
                    key={img.id}
                    src={`http://127.0.0.1:8000${img.imagem}`}
                    alt={`Imagem ${img.id}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="imovel-info">
            <div className="card-badge">{imovel.tipo}</div>
            <h1>{imovel.titulo}</h1>
            <p className="location">📍 {imovel.endereco}</p>
            <p className="price" style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}>
              R$ {imovel.preco}/mês
            </p>

            <div className="card-details" style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              <span>🛏️ {imovel.quartos} quartos</span>
              <span>🚿 {imovel.banheiros} banheiros</span>
              <span>📏 {imovel.area_m2}m²</span>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Descrição</h3>
              <p>{imovel.descricao}</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Características</h3>
              <ul>
                {imovel.mobiliado && <li>✓ Mobiliado</li>}
                {imovel.aceita_pet && <li>✓ Aceita Pet</li>}
                {imovel.garagem && <li>✓ Garagem</li>}
              </ul>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <h3>Proprietário</h3>
              <p><strong>{imovel.proprietario.first_name} {imovel.proprietario.last_name}</strong></p>
              {imovel.proprietario.perfil && (
                <>
                  <p>📞 {imovel.proprietario.perfil.telefone}</p>
                  <p>✉️ {imovel.proprietario.email}</p>
                </>
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
