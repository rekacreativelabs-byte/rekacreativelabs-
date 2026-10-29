const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./data/db');
const cashfree = require('./cashfree');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Serve public assets explicitly and static files from root
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Configuration settings
const ZOOM_LINK = process.env.ZOOM_LINK || 'https://us05web.zoom.us/j/83569102164?pwd=UAnFjOXHxA1hoLxEpZHca3awc4dP6o.1';
const ZOOM_MEETING_ID = '835 6910 2164';
const ZOOM_PASSCODE = '0123';
const CALENDLY_URL = process.env.CALENDLY_URL || 'https://calendly.com/rekacreativelabs/30min';
const META_PIXEL_ID = process.env.META_PIXEL_ID || '1095990819739700';

// Gmail SMTP Transporter with key sanitization
const rawPass = (process.env.EMAIL_PASS || '').replace(/\s+/g, '');
const cleanPass = rawPass.length > 16 ? rawPass.slice(0, 16) : rawPass;
const emailUser = process.env.EMAIL_USER || 'rekacreativelabs@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: cleanPass
  }
});

// Verify SMTP connection non-blockingly
transporter.verify((error) => {
  if (error) {
    console.warn('[Nodemailer Notice] SMTP connection:', error.message);
  } else {
    console.log('[Nodemailer SMTP] Ready to deliver confirmation emails via Gmail');
  }
});

// Helper to send transactional emails
async function sendBookingEmails(booking) {
  const isWebinar = booking.product === 'webinar';
  const customerEmail = booking.email;
  const cleanPhone = booking.phone.replace(/[^0-9]/g, '').slice(-10);
  const waHelpLink = `https://wa.me/918368508556?text=${encodeURIComponent(`Hi Abhinash! I booked the ${isWebinar ? 'Daily Live Webinar' : '1:1 Meeting'}. Order ID: ${booking.order_id}`)}`;

  const clientSubject = isWebinar
    ? `✅ Aapki Seat Confirm Hai! Herbalife Coach Daily Live Webinar (Rs. 59)`
    : `🔥 1:1 Strategic Meeting Confirmed with Abhinash Singh (Rs. 49 Special)`;

  const clientHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        body { margin:0; padding:20px; background:#07090c; font-family:'Inter',sans-serif; color:#f2f4f8; }
        .box { max-width:580px; margin:0 auto; background:#0e1217; border:1px solid rgba(0,200,83,0.3); border-radius:20px; overflow:hidden; }
        .hdr { background:linear-gradient(135deg,#003d19 0%,#0e1217 100%); padding:28px 24px; border-bottom:2px solid #00c853; text-align:center; }
        .badge { display:inline-block; background:#00c853; color:#07090c; font-weight:800; font-size:12px; padding:4px 12px; border-radius:999px; text-transform:uppercase; margin-bottom:10px; }
        .h1 { font-size:22px; font-weight:800; margin:0 0 6px; color:#fff; }
        .cnt { padding:24px; font-size:15px; line-height:1.6; }
        .row { display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.08); }
        .lbl { color:#8e9e95; font-size:13px; }
        .val { font-weight:700; color:#fff; }
        .action { margin-top:22px; text-align:center; }
        .btn { display:inline-block; background:#00c853; color:#07090c; text-decoration:none; padding:13px 26px; border-radius:999px; font-weight:800; font-size:15px; }
        .wa-btn { display:inline-block; background:#25D366; color:#fff; text-decoration:none; padding:11px 22px; border-radius:999px; font-weight:700; font-size:14px; margin-top:10px; }
        .ftr { background:#07090c; padding:16px 24px; font-size:12px; color:#6e7973; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="hdr">
          <span class="badge">Payment Confirmed · Rs. ${booking.amount}</span>
          <div class="h1">🎉 Welcome, ${booking.name}!</div>
          <p style="margin:0; color:#b0bec5; font-size:14px;">${isWebinar ? 'Herbalife Coach Daily Live Webinar Session' : '1:1 Strategic Growth Meeting with Founder'}</p>
        </div>
        <div class="cnt">
          <p>Namaste <b>${booking.name}</b>,</p>
          <p>Aapki booking successfully confirm ho chuki hai. Details neeche note kar lijiye:</p>
          <div class="row"><span class="lbl">Product</span><span class="val">${isWebinar ? 'Daily Live Webinar (Zoom)' : '1:1 Founder Meeting'}</span></div>
          <div class="row"><span class="lbl">Amount Paid</span><span class="val" style="color:#00c853;">Rs. ${booking.amount} (Payment Received)</span></div>
          <div class="row"><span class="lbl">Order ID</span><span class="val">${booking.order_id}</span></div>
          ${booking.date ? `<div class="row"><span class="lbl">Date</span><span class="val">${booking.date}</span></div>` : ''}
          ${booking.slot ? `<div class="row"><span class="lbl">Slot Time</span><span class="val">${booking.slot} IST</span></div>` : ''}
          ${booking.current_vp ? `<div class="row"><span class="lbl">Current Monthly VP</span><span class="val">${booking.current_vp}</span></div>` : ''}

          ${isWebinar ? `
            <div class="action">
              <a href="${ZOOM_LINK}" class="btn" target="_blank">👉 Join Live Zoom Webinar Link</a><br>
              <a href="${waHelpLink}" class="wa-btn" target="_blank">💬 WhatsApp Par Reminder Set Karein</a>
            </div>
            <p style="font-size:13px; color:#8e9e95; margin-top:20px;">
              💡 <b>Note:</b> Kripya session shuru hone se 5 minute pehle join karein. Diary aur pen saath rakhein — session mein world-class Lead Magnet Process + Instagram Growth Plan live share hoga.
            </p>
          ` : `
            <div class="action">
              <p style="margin-bottom:12px; font-weight:700; color:#f5b942;">Ab apna 1:1 meeting slot select karein:</p>
              <a href="${CALENDLY_URL}" class="btn" target="_blank">📅 Select Meeting Time on Calendly</a><br>
              <a href="${waHelpLink}" class="wa-btn" target="_blank">💬 Connect with Abhinash on WhatsApp</a>
            </div>
          `}
        </div>
        <div class="ftr">
          Reka Creative Labs · Founder: Abhinash Singh · +91 83685 08556<br>
          A Block, Pocket A, Sector 19, Noida, UP 201301
        </div>
      </div>
    </body>
    </html>
  `;

  // Internal notification for founder
  const adminSubject = `💰 NEW PAID BOOKING [Rs. ${booking.amount}]: ${booking.name} (${booking.product.toUpperCase()}) - ${booking.phone}`;
  const adminHtml = `
    <h2>New Paid Conversion Received!</h2>
    <p><b>Product:</b> ${booking.product.toUpperCase()} (Rs. ${booking.amount})</p>
    <p><b>Name:</b> ${booking.name}</p>
    <p><b>Phone:</b> +91 ${cleanPhone} (<a href="https://wa.me/91${cleanPhone}">Open WhatsApp</a>)</p>
    <p><b>Email:</b> ${customerEmail}</p>
    ${booking.date ? `<p><b>Date:</b> ${booking.date}</p>` : ''}
    ${booking.slot ? `<p><b>Slot:</b> ${booking.slot}</p>` : ''}
    ${booking.instagram_id ? `<p><b>Instagram:</b> ${booking.instagram_id}</p>` : ''}
    ${booking.current_vp ? `<p><b>Current VP:</b> ${booking.current_vp}</p>` : ''}
    <p><b>Order ID:</b> ${booking.order_id}</p>
    <p><b>Payment ID:</b> ${booking.payment_id || 'N/A'}</p>
    <p><b>Status:</b> ${booking.status}</p>
    <p><b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
  `;

  try {
    // Send to customer
    if (customerEmail && customerEmail.includes('@')) {
      await transporter.sendMail({
        from: `"Reka Creative Labs" <${emailUser}>`,
        to: customerEmail,
        replyTo: emailUser,
        subject: clientSubject,
        html: clientHtml
      });
      console.log(`[Email] Booking confirmation sent to customer: ${customerEmail}`);
    }

    // Send to founder
    await transporter.sendMail({
      from: `"Reka Bookings" <${emailUser}>`,
      to: emailUser,
      replyTo: customerEmail || emailUser,
      subject: adminSubject,
      html: adminHtml
    });
    console.log(`[Email] Internal booking alert sent to founder: ${emailUser}`);
  } catch (err) {
    console.error('[Email Error] Failed sending booking emails:', err.message);
  }
}

// ----------------------------------------------------------------------
// API ROUTES
// ----------------------------------------------------------------------

// 0. System Config endpoint
app.get('/api/config', (req, res) => {
  res.json({
    success: true,
    cashfree_mode: cashfree.getMode(),
    is_configured: cashfree.isConfigured(),
    meta_pixel_id: META_PIXEL_ID,
    calendly_url: CALENDLY_URL,
    zoom_link: ZOOM_LINK,
    max_seats_per_slot: db.MAX_SEATS_PER_SLOT
  });
});

// Slot Availability & Seat Count Endpoint (Max 20 seats per slot)
app.get('/api/slot-availability', (req, res) => {
  const date = req.query.date || 'Today';
  const availability = db.getSlotAvailability(date);
  res.json({
    success: true,
    date: date,
    max_seats: db.MAX_SEATS_PER_SLOT,
    slots: availability
  });
});

// 1. Create Cashfree Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { product, name, phone, email, date, slot, instagram_id, current_vp } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ success: false, message: 'Naam, phone number aur email required hain.' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ success: false, message: 'Kripya sahi 10-digit WhatsApp number dalein.' });
    }

    const normalizedProduct = (product === 'meeting' || product === '1:1') ? 'meeting' : 'webinar';

    // 20-Person Slot Capacity Check for Webinar
    if (normalizedProduct === 'webinar') {
      const selectedDate = date || 'Today';
      const selectedSlot = slot || '11:00 AM';
      const bookedCount = db.getSlotBookingCount(selectedDate, selectedSlot);
      if (bookedCount >= db.MAX_SEATS_PER_SLOT) {
        return res.status(400).json({
          success: false,
          message: `Ye slot full ho chuka hai (20/20 seats booked). Kripya koi dusra slot chunein.`
        });
      }
    }

    // SERVER-SIDE FIXED PRICING - NEVER TRUST FRONTEND AMOUNT
    const amount = normalizedProduct === 'meeting' ? 49.00 : 59.00;

    const timestamp = Date.now();
    const rand = Math.random().toString(36).substring(2, 6);
    const orderId = `reka_${normalizedProduct === 'meeting' ? 'mt' : 'wb'}_${timestamp}_${rand}`;

    // Save initial record to local database
    const booking = {
      order_id: orderId,
      product: normalizedProduct,
      amount: amount,
      currency: 'INR',
      name: name.trim(),
      phone: cleanPhone.slice(-10),
      email: email.trim().toLowerCase(),
      date: date || 'Today',
      slot: slot || '11:00 AM',
      instagram_id: instagram_id ? instagram_id.trim() : '',
      current_vp: current_vp || '500 se kam',
      status: 'PENDING',
      cashfree_order_id: null,
      payment_id: null,
      created_at: new Date().toISOString()
    };

    db.saveBooking(booking);

    // Create order with Cashfree (or simulator)
    const host = req.get('host');
    const protocol = req.protocol;
    const returnUrl = `${protocol}://${host}/herbalife-coaches.html?order_id=${orderId}&payment_status={payment_status}`;

    const orderResult = await cashfree.createOrder({
      orderId: orderId,
      amount: amount,
      currency: 'INR',
      customer: {
        name: booking.name,
        phone: booking.phone,
        email: booking.email
      },
      returnUrl: returnUrl,
      note: normalizedProduct === 'meeting'
        ? 'Reka 1:1 Strategic Meeting with Abhinash Singh (Rs. 49)'
        : `Reka Daily Live Webinar (${booking.date} ${booking.slot}) - Rs. 59`
    });

    db.saveBooking({
      ...booking,
      cashfree_order_id: orderResult.order_id
    });

    res.json({
      success: true,
      order_id: orderId,
      amount: amount,
      currency: 'INR',
      product: normalizedProduct,
      payment_session_id: orderResult.payment_session_id,
      mode: orderResult.mode
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: err.message || 'Order create karne mein problem aayi.' });
  }
});

// 2. Verify Payment on Server
app.post('/api/verify-payment', async (req, res) => {
  try {
    const { order_id, payment_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ success: false, message: 'Order ID is required.' });
    }

    const booking = db.getBooking(order_id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record nahi mila.' });
    }

    // Call Cashfree verification
    const verification = await cashfree.verifyOrder(order_id, payment_id);

    if (verification.is_paid) {
      const updated = db.updateBookingStatus(order_id, 'CONFIRMED', {
        payment_id: verification.payment_id || payment_id,
        payment_method: verification.payment_method,
        raw: verification.raw
      });

      // Dispatch confirmation emails
      sendBookingEmails(updated);

      return res.json({
        success: true,
        status: 'CONFIRMED',
        message: 'Payment verified successfully! Seat confirmed.',
        booking: {
          order_id: updated.order_id,
          product: updated.product,
          name: updated.name,
          phone: updated.phone,
          email: updated.email,
          date: updated.date,
          slot: updated.slot,
          amount: updated.amount,
          calendly_url: CALENDLY_URL,
          zoom_link: ZOOM_LINK
        }
      });
    } else {
      db.updateBookingStatus(order_id, 'FAILED', { raw: verification.raw });
      return res.status(400).json({
        success: false,
        status: 'FAILED',
        message: 'Payment complete nahi hua — Retry Karo'
      });
    }
  } catch (err) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, message: 'Verification error: ' + err.message });
  }
});

// 3. Cashfree Webhook endpoint
app.post('/api/cashfree-webhook', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  const timestamp = req.headers['x-webhook-timestamp'];
  const body = req.body;

  console.log('[Cashfree Webhook Received]', body.type);

  if (body && body.data && body.data.order) {
    const orderId = body.data.order.order_id;
    const paymentStatus = body.data.payment ? body.data.payment.payment_status : null;

    if (paymentStatus === 'SUCCESS') {
      const updated = db.updateBookingStatus(orderId, 'CONFIRMED', {
        payment_id: body.data.payment.cf_payment_id,
        payment_method: body.data.payment.payment_group,
        raw: body
      });
      if (updated) sendBookingEmails(updated);
    }
  }

  res.json({ received: true });
});

// 4. Check Single Booking Status
app.get('/api/booking/:orderId', (req, res) => {
  const booking = db.getBooking(req.params.orderId);
  if (!booking) return res.status(404).json({ success: false, message: 'Not found' });
  res.json({ success: true, booking });
});

// 5. Admin List All Bookings
app.get('/api/admin/bookings', (req, res) => {
  const bookings = db.listBookings();
  res.json({
    success: true,
    count: bookings.length,
    bookings: bookings.reverse()
  });
});

// 6. Existing Lead capture compatibility
app.post('/api/send-lead', async (req, res) => {
  const { name, phone, need, source } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const mailOptions = {
    from: `"Reka Creative Labs Leads" <${emailUser}>`,
    to: emailUser,
    replyTo: emailUser,
    subject: `🔥 New Lead Form: ${name} (+91 ${cleanPhone}) - ${need || 'General Audit'}`,
    html: `
      <h2>New Lead Received from Website</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> +91 ${cleanPhone} (<a href="https://wa.me/91${cleanPhone}">WhatsApp</a>)</p>
      <p><b>Requirement:</b> ${need || 'Coach Growth Plan'}</p>
      <p><b>Source:</b> ${source || 'Website Form'}</p>
      <p><b>Time:</b> ${nowIST}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Lead received successfully' });
  } catch (err) {
    console.warn('Lead email send notice:', err.message);
    res.json({ success: true, message: 'Lead saved' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`========================================================`);
  console.log(`🚀 Reka Creative Labs Server running on http://localhost:${PORT}`);
  console.log(`💳 Cashfree Gateway Mode: ${cashfree.getMode().toUpperCase()}`);
  console.log(`📧 Nodemailer Configured: ${emailUser}`);
  console.log(`========================================================`);
});
