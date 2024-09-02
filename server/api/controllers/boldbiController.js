// server/controllers/boldbiController.js
const axios = require('axios');

exports.getDashboards = async (req, res) => {
  try {
    const response = await axios.get(`${'https://login.shareanalytics.com.mx/bi'}/api/v2.0/items`);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching dashboards');
  }
};
