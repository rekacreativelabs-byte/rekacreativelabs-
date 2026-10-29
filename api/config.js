const cashfree = require('../cashfree');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.json({
    success: true,
    is_configured: cashfree.isConfigured(),
    cashfree_mode: cashfree.getMode(),
    cashfree_env: cashfree.CASHFREE_ENV,
    zoom: {
      meeting_id: '835 6910 2164',
      passcode: '0123'
    }
  });
};
