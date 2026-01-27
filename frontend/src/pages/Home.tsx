import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { imovelService } from '../services/imovelService';
import './Home.css'; 
import type { ImovelListItem } from '../types';

const Home: React.FC = () => {
  const [imoveis, setImoveis] = useState<ImovelListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDestaques();
  }, []);

  const carregarDestaques = async () => {
    try {
      const data = await imovelService.destaques();
      setImoveis(data);
    } catch (error) {
      console.error('Erro ao carregar destaques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <main className="home-container">
      {/* Seção Hero (Banner Principal) */}
      <section className="hero">
        <div className="hero-content">
          {/* MUDANÇA: Texto limpo como pedido */}
          <h1>Encontre seu lar</h1>
          
          <a href="#imoveis-list" className="btn btn-hero">
            Ver Ofertas
          </a>
        </div>
      </section>

      {/* Lista de Imóveis */}
      <section id="imoveis-list" className="content-section">
        <div className="section-header">
          <h2>Imóveis em Destaque</h2>
          <p style={{ color: '#7f8c8d' }}>Confira as novidades mais recentes</p>
        </div>

        {imoveis.length > 0 ? (
          <div className="imoveis-grid">
            {imoveis.map((imovel) => (
              <div key={imovel.id} className="card-imovel">
                <div className="card-image-wrapper">
                  <span className="badge-tipo">{imovel.tipo_display}</span>
                  <img
                    // Se não tiver foto, usa um placeholder cinza ou imagem padrão
                    src={imovel.foto_principal ? `http://127.0.0.1:8000${imovel.foto_principal}` : 'https://via.placeholder.com/400x300?text=Sem+Foto'}
                    alt={imovel.titulo}
                    className="card-img"
                  />
                </div>
                
                <div className="card-body">
                  <div className="card-header">
                    <span className="card-bairro">📍 {imovel.bairro_display}</span>
                    <span className="card-views">👁️ {imovel.visualizacoes}</span>
                  </div>
                  
                  <h3 className="card-title">{imovel.titulo}</h3>
                  
                  <div className="card-price">
                    <span className="currency">R$</span>
                    {/* Formata o preço para o padrão brasileiro */}
                    <span className="value">{parseFloat(imovel.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="period">/mês</span>
                  </div>

                  <div className="card-actions">
                    <Link to={`/imoveis/${imovel.id}`} className="btn btn-details">
                      Detalhes
                    </Link>
                    
                    {imovel.whatsapp_link && (
                      <a 
                        href={imovel.whatsapp_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-whatsapp"
                      >
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>Nenhum imóvel disponível no momento.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;