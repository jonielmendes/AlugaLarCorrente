import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { imovelService } from '../services/imovelService';
import type { ImovelListItem } from '../types';

const ListaImoveis: React.FC = () => {
  const [imoveis, setImoveis] = useState<ImovelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    bairro: '',
  });

  const carregarImoveis = useCallback(async () => {
    try {
      const params: Record<string, string | number> = {};
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.bairro) params.bairro = filtros.bairro;

      const response = await imovelService.listar(params);
      setImoveis(response.results);
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarImoveis();
  }, [carregarImoveis]);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <main>
      <div className="container">
        <div className="page-header">
          <h1>Imóveis Disponíveis</h1>
        </div>

        <div className="filtros">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipo">Tipo de Imóvel</label>
              <select
                id="tipo"
                name="tipo"
                value={filtros.tipo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos os tipos</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="kitnet">Kitnet</option>
                <option value="quarto">Quarto</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="bairro">Bairro</label>
              <select
                id="bairro"
                name="bairro"
                value={filtros.bairro}
                onChange={handleFiltroChange}
              >
                <option value="">Todos os bairros</option>
                <option value="centro">Centro</option>
                <option value="nova_corrente">Nova Corrente</option>
                <option value="aeroporto_i">Aeroporto I</option>
                <option value="aeroporto_ii">Aeroporto II</option>
                <option value="vermelhao">Vermelhão</option>
                <option value="sincerino">Sincerino</option>
                <option value="vila_nova">Vila Nova</option>
              </select>
            </div>
          </div>
        </div>

        <div className="imoveis-grid">
          {imoveis.length > 0 ? (
            imoveis.map((imovel) => (
              <div key={imovel.id} className="card">
                <div className="card-content">
                  <div className="card-badge">{imovel.tipo_display}</div>
                  <h3>{imovel.titulo}</h3>
                  <p className="location">{imovel.bairro_display}</p>
                  <p className="price">R$ {Number(imovel.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</p>
                  <Link to={`/imoveis/${imovel.id}`} className="btn btn-primary">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhum imóvel encontrado com os filtros selecionados.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default ListaImoveis;
