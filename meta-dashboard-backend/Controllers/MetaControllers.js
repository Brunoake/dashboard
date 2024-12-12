const axios = require('axios');
const Metric = require('../models/Model');

const getMetrics = async (req, res) => {

  
  try {
    const accessToken = process.env.ACCESS_TOKEN;
    const adAccountId = process.env.AD_ACCOUNT_ID;
    const fields = 'campign_id, impressions,clicks,spend,dda_results,ctr,cpc,cpm'

    console.log('ACCESS_TOKEN:', accessToken);
console.log('AD_ACCOUNT_ID:', adAccountId);
console.log('URL da API:', `https://graph.facebook.com/v21.0/${adAccountId}/insights?fields=${fields}&access_token=${accessToken}`);

    if (!accessToken || !adAccountId) {
      throw new Error('ACCESS_TOKEN ou AD_ACCOUNT_ID não definido no .env');
    }

    const response = await axios.get(
      `https://graph.facebook.com/v21.0/${adAccountId}/insights?fields=${fields}&access_token=${accessToken}`
    );

    const metrics = response.data.data.map((item) => {
      const actions = item.actions || [];
      const results = actions.reduce((total, action) => total + parseInt(action.value || 0, 10), 0);
      const costPerResult = results > 0 ? (item.spend / results).toFixed(2) : 0;

      return {
        campaignId: item.campaign_id || 'unknown',
        impressions: item.impressions,
        clicks: item.clicks,
        cpc: item.cpc,
        ctr: item.ctr,
        cpm: item.cpm,
        results: item.dda_results,
        cost: item.spend,
        updatedAt: new Date(),
      };
    });

    await Metric.insertMany(metrics, { ordered: false }).catch((err) => {
      console.error('Erro ao salvar métricas no banco de dados:', err.message);
    });

    res.status(200).json(metrics);
  } catch (error) {
    console.error('Erro ao obter métricas:', error.message);
    res.status(500).json({ error: 'Erro ao obter métricas do Meta' });

    if (error.response) {
      console.error('Erro na API do Meta:', error.response.data);
    } else {
      console.error('Erro desconhecido:', error.message);
    }
    res.status(500).json({
      error: error.response?.data?.error?.message || 'Erro ao obter métricas do Meta',
    });
  }
};

module.exports = { getMetrics };