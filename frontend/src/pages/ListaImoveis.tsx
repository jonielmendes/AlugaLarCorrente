import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { imovelService } from '../services/imovelService';
import type { ImovelListItem } from '../types';

const ListaImoveis: React.FC = () => {
  const [imoveis, setImoveis] = useState<ImovelListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    tipo: '',
    preco_min: '',
    preco_max: '',
    quartos: '',
    banheiros: '',
  });

  const carregarImoveis = useCallback(async () => {
    try {
      const params: Record<string, string | number> = {};
      if (filtros.tipo) params.tipo = filtros.tipo;
      if (filtros.preco_min) params.preco_min = filtros.preco_min;
      if (filtros.preco_max) params.preco_max = filtros.preco_max;
      if (filtros.quartos) params.quartos = filtros.quartos;
      if (filtros.banheiros) params.banheiros = filtros.banheiros;

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
              <label htmlFor="tipo">Tipo</label>
              <select
                id="tipo"
                name="tipo"
                value={filtros.tipo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="CASA">Casa</option>
                <option value="APARTAMENTO">Apartamento</option>
                <option value="KITNET">Kitnet</option>
                <option value="COMERCIAL">Comercial</option>
                <option value="TERRENO">Terreno</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="preco_min">Preço Mínimo</label>
              <input
                type="number"
                id="preco_min"
                name="preco_min"
                value={filtros.preco_min}
                onChange={handleFiltroChange}
                placeholder="R$ 0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="preco_max">Preço Máximo</label>
              <input
                type="number"
                id="preco_max"
                name="preco_max"
                value={filtros.preco_max}
                onChange={handleFiltroChange}
                placeholder="R$ 10000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quartos">Quartos</label>
              <input
                type="number"
                id="quartos"
                name="quartos"
                value={filtros.quartos}
                onChange={handleFiltroChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="banheiros">Banheiros</label>
              <input
                type="number"
                id="banheiros"
                name="banheiros"
                value={filtros.banheiros}
                onChange={handleFiltroChange}
                min="0"
              />
            </div>
          </div>
        </div>

        <div className="imoveis-grid">
          {imoveis.length > 0 ? (
            imoveis.map((imovel) => (
              <div key={imovel.id} className="card">
                <img
                  src={`http://127.0.0.1:8000${imovel.foto_principal}`}
                  alt={imovel.titulo}
                />
                <div className="card-content">
                  <div className="card-badge">{imovel.tipo}</div>
                  <h3>{imovel.titulo}</h3>
                  <p className="location">{imovel.endereco}</p>
                  <p className="price">R$ {imovel.preco}/mês</p>
                  <div className="card-details">
                    <span>🛏️ {imovel.quartos}</span>
                    <span>🚿 {imovel.banheiros}</span>
                    <span>📏 {imovel.area_m2}m²</span>
                  </div>
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
