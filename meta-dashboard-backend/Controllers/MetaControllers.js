const axios = require('axios');
const Metric = require('../models/Model');

const getMetrics = async (req, res) => {
  try {
    const accessToken = process.env.ACCESS_TOKEN;
    const adAccountId = process.env.AD_ACCOUNT_ID;

    // Use apenas nomes de campos válidos
    const fields = 'impressions,clicks,spend,actions,reach,frequency';
    const url = encodeURI(`https://graph.facebook.com/v21.0/${adAccountId}/insights?fields=${fields}&access_token=${accessToken}`);

    console.log('URL da API:', url);

    const response = await axios.get(url);

    const metrics = response.data.data.map((item) => {
      const actions = item.actions || [];
      const results = actions.reduce((total, action) => total + parseInt(action.value || 0, 10), 0);
      const costPerResult = results > 0 ? (item.spend / results).toFixed(2) : 0;

      return {
        campaignId: item.campaign_id || 'unknown',
        impressions: parseInt(item.impressions || 0, 10),
        clicks: parseInt(item.clicks || 0, 10),
        cost: parseFloat(item.spend || 0),
        reach: parseInt(item.reach || 0, 10),
        frequency: parseFloat(item.frequency || 0),
        results,
        costPerResult: parseFloat(costPerResult),
        updatedAt: new Date(),
      };
    });

    console.log('Métricas processadas para salvar no banco:', metrics);

    await Metric.insertMany(metrics, { ordered: false }).catch((err) => {
      console.error('Erro ao salvar métricas no banco de dados:', err.message);
    });

    res.status(200).json(metrics);
  } catch (error) {
    if (error.response) {
      console.error('Erro na API do Meta:', error.response.data);
      res.status(500).json({
        error: error.response.data.error.message || 'Erro ao obter métricas do Meta',
      });
    } else {
      console.error('Erro desconhecido:', error.message);
      res.status(500).json({
        error: 'Erro ao obter métricas do Meta',
      });
    }
  }
};

module.exports = { getMetrics };
