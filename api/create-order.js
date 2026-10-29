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
    const { product, name, phone, email, date, slot, current_vp } = req.body || {};

    if (!product || !name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Sabhi jaruri details bharein' });
    }

    let amount = 59;
    let orderPrefix = 'WEB';
    let note = 'Reka Creative Labs - Daily Live Webinar Seat';

    if (product === 'meeting') {
      amount = 49;
      orderPrefix = 'MTG';
      note = 'Reka Creative Labs - 1:1 Strategy Meeting with Abhinash Singh';
    } else {
      // Check slot availability for webinar (Cap 20)
      if (date && slot) {
        const avail = db.getSlotAvailability(date, slot);
        if (!avail.is_available) {
          return res.status(400).json({
            success: false,
            message: `Maaf kijiye, ${slot} slot ki sabhi 20 seats full ho chuki hain. Kripya dusra slot chunein.`
          });
        }
      }
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const orderId = `${orderPrefix}_${Date.now()}_${cleanPhone.slice(-4)}`;

    const host = req.headers['x-forwarded-host'] || req.headers.host || 'www.rekacreativelabs.com';
    const proto = req.headers['x-forwarded-proto'] || 'https';
    const returnUrl = `${proto}://${host}/herbalife-coaches.html?order_id={order_id}`;

    const cfOrder = await cashfree.createOrder({
      orderId,
      amount,
      currency: 'INR',
      customer: {
        name,
        email,
        phone: cleanPhone
      },
      returnUrl,
      note
    });

    db.saveBooking({
      order_id: orderId,
      product,
      amount,
      name,
      phone: cleanPhone,
      email,
      date: date || 'N/A',
      slot: slot || 'N/A',
      current_vp: current_vp || 'N/A',
      status: 'PENDING_PAYMENT',
      payment_session_id: cfOrder.payment_session_id
    });

    return res.json({
      success: true,
      mode: cfOrder.mode,
      order_id: cfOrder.order_id,
      amount: cfOrder.order_amount,
      payment_session_id: cfOrder.payment_session_id,
      cf_environment: cashfree.CASHFREE_ENV
    });
  } catch (err) {
    console.error('[API create-order error]', err);
    return res.status(500).json({
      success: false,
      message: err.message || 'Order creation failed'
    });
  }
};
