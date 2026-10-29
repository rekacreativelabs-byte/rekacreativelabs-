const cashfree = require('../cashfree');
const db = require('../data/db');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { order_id, payment_id } = req.body || {};

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'order_id jaruri hai' });
    }

    const verification = await cashfree.verifyOrder(order_id, payment_id);

    if (verification.is_paid) {
      const updated = db.updateBookingStatus(order_id, 'PAID', {
        payment_id: verification.payment_id,
        order_status: verification.order_status,
        verified_amount: verification.order_amount,
        verified_at: new Date().toISOString()
      });

      return res.json({
        success: true,
        is_paid: true,
        order_id: verification.order_id,
        booking: updated || db.getBooking(order_id),
        message: 'Payment safalta-purvak confirm ho gaya!'
      });
    }

    return res.json({
      success: true,
      is_paid: false,
      order_status: verification.order_status,
      message: 'Payment abhi process ho raha hai ya pending hai.'
    });
  } catch (err) {
    console.error('[API verify-payment error]', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Payment verification failed'
    });
  }
};
