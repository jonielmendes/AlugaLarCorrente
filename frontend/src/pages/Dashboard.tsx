import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { imovelService } from '../services/imovelService';
import type { ImovelListItem } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [meusImoveis, setMeusImoveis] = useState<ImovelListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMeusImoveis();
  }, []);

  const carregarMeusImoveis = async () => {
    try {
      const data = await imovelService.meusImoveis();
      setMeusImoveis(data);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAtivo = async (id: number, ativo: boolean) => {
    try {
      await imovelService.toggleAtivo(id);
      setMeusImoveis(meusImoveis.map(imovel => 
        imovel.id === id ? { ...imovel, ativo: !ativo } : imovel
      ));
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;

    try {
      await imovelService.deletar(id);
      setMeusImoveis(meusImoveis.filter(imovel => imovel.id !== id));
    } catch (error) {
      console.error('Erro ao deletar imóvel:', error);
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <main>
      <div className="container">
        <div className="page-header">
          <h1>Meu Dashboard</h1>
          <p>Bem-vindo, {user?.first_name}!</p>
        </div>

        {user?.perfil?.tipo === 'LOCADOR' && (
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/anunciar" className="btn btn-primary">
              + Anunciar Novo Imóvel
            </Link>
          </div>
        )}

        <section>
          <h2>Meus Imóveis</h2>
          
          {meusImoveis.length > 0 ? (
            <div className="imoveis-grid">
              {meusImoveis.map((imovel) => (
                <div key={imovel.id} className="card">
                  <img
                    src={`http://127.0.0.1:8000${imovel.foto_principal}`}
                    alt={imovel.titulo}
                  />
                  <div className="card-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="card-badge">{imovel.tipo}</div>
                      <span className={imovel.ativo ? 'badge badge-success' : 'badge badge-error'}>
                        {imovel.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                    <h3>{imovel.titulo}</h3>
                    <p className="location">{imovel.endereco}</p>
                    <p className="price">R$ {imovel.preco}/mês</p>
                    <div className="card-details">
                      <span>🛏️ {imovel.quartos}</span>
                      <span>🚿 {imovel.banheiros}</span>
                      <span>📏 {imovel.area_m2}m²</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <Link to={`/imoveis/${imovel.id}`} className="btn btn-secondary" style={{ flex: 1 }}>
                        Ver
                      </Link>
                      <button
                        onClick={() => handleToggleAtivo(imovel.id, imovel.ativo)}
                        className={imovel.ativo ? 'btn btn-warning' : 'btn btn-success'}
                        style={{ flex: 1 }}
                      >
                        {imovel.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => handleDelete(imovel.id)}
                        className="btn btn-danger"
                        style={{ flex: 1 }}
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Você ainda não cadastrou nenhum imóvel.</p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
