import React, { useEffect, useState } from 'react';
import { fetchMetrics } from '../Api/MetaApi'

const Dashboard = () => {
  const [metrics, setMetrics] = useState([]); // Inicializa o estado como um array vazio

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const data = await fetchMetrics(); // Busca os dados da API
        console.log('Dados carregados:', data); 
        setMetrics(data);
      } catch (error) {
        console.error('Erro ao buscar métricas:', error);
      }
    };

    getMetrics();
  }, []);

  return (
    <div>
      <h1>Dashboard de Métricas</h1>
      {metrics.length > 0 ? ( // Certifique-se de que os dados existem antes de renderizar
        <table>
          <thead>
            <tr>
              <th>Impressões</th>
              <th>Campanha</th>
              <th>Cliques</th>
              <th>Custo por Clique</th>
              <th>Resultados</th>
              <th>Custo por Resultado</th>
              <th>Última Atualização</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.campaignId}>
                <td>{metric.campaignId}</td>
                <td>{metric.impressions}</td>
                <td>{metric.clicks}</td>
                <td>R${metric.cost}</td>
                <td>{metric.results}</td>
                <td>R${metric.costPerResult}</td>
                <td>{new Date(metric.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Carregando métricas...</p> // Renderiza algo enquanto os dados não estão disponíveis
      )}
    </div>
  );
};

export default Dashboard;
