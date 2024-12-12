const fetchMetrics = async () => {
  try {
    const response = await fetch('/api/meta/metrics'); // Sem usar localhost diretamente
    if (!response.ok) throw new Error('Erro ao buscar métricas');
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export { fetchMetrics };