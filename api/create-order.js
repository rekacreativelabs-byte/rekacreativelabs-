const db = require('../data/db');
const mailer = require('../mailer');

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
    const { product = 'webinar', name, phone, email, date, slot, current_vp } = req.body || {};

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Sabhi jaruri details bharein' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const orderId = `FREE_${Date.now()}_${cleanPhone.slice(-4)}`;

    const bookingRecord = {
      order_id: orderId,
      product: product || 'free_webinar',
      amount: 0,
      name: name.trim(),
      phone: cleanPhone,
      email: email.trim(),
      date: date || 'Aaj',
      slot: slot || '11:00 AM',
      current_vp: current_vp || 'N/A',
      status: 'CONFIRMED',
      created_at: new Date().toISOString()
    };

    db.saveBooking(bookingRecord);

    // Deliver Zoom Meeting Details to Customer & Alert to Founder immediately
    let mailResult = { clientSent: false, adminSent: false };
    try {
      mailResult = await mailer.sendBookingConfirmation(bookingRecord);
      console.log('[API Booking Mail Result]', mailResult);
    } catch (mailErr) {
      console.warn('[Confirmation Mailer Notice]', mailErr.message);
    }

    return res.json({
      success: true,
      is_confirmed: true,
      order_id: orderId,
      booking: bookingRecord,
      zoom_link: mailer.ZOOM_LINK,
      zoom_meeting_id: mailer.ZOOM_MEETING_ID,
      zoom_passcode: mailer.ZOOM_PASSCODE,
      message: 'Aapki Free Seat Confirm ho gayi hai! Zoom link aapke email par bhej di gayi hai.'
    });
  } catch (err) {
    console.error('[API Free Booking Error]', err);
    return res.status(500).json({
      success: false,
      message: 'Booking failed: ' + err.message
    });
  }
};
