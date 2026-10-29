const db = require('../data/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { date, slot } = req.query || {};

  if (!date || !slot) {
    return res.status(400).json({ success: false, message: 'date aur slot query params jaruri hain' });
  }

  const availability = db.getSlotAvailability(date, slot);
  return res.json({
    success: true,
    ...availability
  });
};
