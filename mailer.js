const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'rekacreativelabs@gmail.com';
const EMAIL_PASS = (process.env.EMAIL_PASS || 'jkpffcvqjldbkyap').replace(/\s+/g, '');

const ZOOM_LINK = 'https://us05web.zoom.us/j/83569102164?pwd=UAnFjOXHxA1hoLxEpZHca3awc4dP6o.1';
const ZOOM_MEETING_ID = '835 6910 2164';
const ZOOM_PASSCODE = '0123';
const CALENDLY_LINK = 'https://calendly.com/rekacreativelabs/30min';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

/**
 * Send Zoom Meeting Link & Confirmation to Customer, and Lead Alert to Founder
 */
async function sendBookingConfirmation(booking) {
  const isWebinar = booking.product !== 'meeting';
  const customerEmail = booking.email;
  const cleanPhone = (booking.phone || '').replace(/[^0-9]/g, '').slice(-10);
  const waChatLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${booking.name}! Aapki Reka Creative Labs ${isWebinar ? 'Daily Live Webinar' : '1:1 Meeting'} seat confirm ho gayi hai.`)}`;

  const clientSubject = isWebinar
    ? `✅ Aapki Seat Confirm Hai! Herbalife Coach Live Zoom Session (Rs. ${booking.amount || 59})`
    : `🔥 1:1 Strategic Meeting Confirmed with Abhinash Singh (Rs. ${booking.amount || 49})`;

  const clientHtml = `
    <!DOCTYPE html>
    <html lang="hi">
    <head>
      <meta charset="utf-8">
      <style>
        body { margin:0; padding:20px; background:#07090c; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; color:#f2f4f8; }
        .box { max-width:580px; margin:0 auto; background:#0e1217; border:1px solid rgba(0,200,83,0.35); border-radius:20px; overflow:hidden; }
        .hdr { background:linear-gradient(135deg,#003d19 0%,#0e1217 100%); padding:28px 24px; border-bottom:2px solid #00c853; text-align:center; }
        .badge { display:inline-block; background:#00c853; color:#07090c; font-weight:800; font-size:12px; padding:4px 14px; border-radius:999px; text-transform:uppercase; margin-bottom:10px; }
        .h1 { font-size:22px; font-weight:800; margin:0 0 6px; color:#fff; }
        .cnt { padding:24px; font-size:15px; line-height:1.6; }
        .zoom-box { background:#141a24; border:1.5px solid #00c853; border-radius:14px; padding:18px; margin:20px 0; }
        .zoom-title { font-weight:800; font-size:16px; color:#00c853; margin-bottom:10px; display:flex; align-items:center; gap:8px; }
        .zoom-row { margin:6px 0; font-size:14px; color:#cfd8dc; }
        .zoom-row b { color:#fff; }
        .row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; }
        .lbl { color:#90a4ae; }
        .val { font-weight:700; color:#fff; }
        .btn-join { display:inline-block; background:#00c853; color:#07090c !important; text-decoration:none; padding:14px 28px; border-radius:999px; font-weight:800; font-size:16px; margin:14px 0 6px; text-align:center; width:calc(100% - 56px); }
        .btn-wa { display:inline-block; background:#25D366; color:#fff !important; text-decoration:none; padding:11px 22px; border-radius:999px; font-weight:700; font-size:14px; margin-top:8px; text-align:center; }
        .ftr { background:#07090c; padding:16px 24px; font-size:12px; color:#607d8b; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="hdr">
          <span class="badge">Seat Confirmed · Rs. ${booking.amount || 59} Paid</span>
          <div class="h1">Welcome, ${booking.name}! 🎉</div>
          <p style="margin:0; color:#b0bec5; font-size:14px;">Herbalife Coach Daily Live Zoom Strategy Session</p>
        </div>

        <div class="cnt">
          <p>Namaste <b>${booking.name}</b>,</p>
          <p>Aapki seat successfully confirm ho chuki hai. Zoom meeting ki official details neeche di gayi hain:</p>

          <!-- LIVE ZOOM CREDENTIALS -->
          <div class="zoom-box">
            <div class="zoom-title">📹 Live Zoom Session Details</div>
            <div class="zoom-row"><b>🔗 Direct Zoom Link:</b> <a href="${ZOOM_LINK}" style="color:#00c853; word-break:break-all;" target="_blank">${ZOOM_LINK}</a></div>
            <div class="zoom-row"><b>🆔 Meeting ID:</b> <span>${ZOOM_MEETING_ID}</span></div>
            <div class="zoom-row"><b>🔑 Passcode:</b> <span style="background:#07090c; padding:2px 8px; border-radius:4px; font-family:monospace; color:#00c853; font-weight:700;">${ZOOM_PASSCODE}</span></div>
            <div style="text-align:center; margin-top:12px;">
              <a href="${ZOOM_LINK}" class="btn-join" target="_blank">👉 Join Zoom Meeting Now</a>
            </div>
          </div>

          <div class="row"><span class="lbl">Product</span><span class="val">${isWebinar ? 'Daily Live Webinar (Zoom)' : '1:1 Meeting with Abhinash Singh'}</span></div>
          <div class="row"><span class="lbl">Date</span><span class="val">${booking.date || 'Aaj'}</span></div>
          <div class="row"><span class="lbl">Slot Time</span><span class="val" style="color:#00c853;">${booking.slot || '11:00 AM'} IST</span></div>
          <div class="row"><span class="lbl">Order ID</span><span class="val">${booking.order_id || 'N/A'}</span></div>
          <div class="row"><span class="lbl">Status</span><span class="val" style="color:#00c853;">PAID &amp; CONFIRMED</span></div>

          <div style="margin-top:20px; padding:14px; background:rgba(255,255,255,0.04); border-radius:12px; font-size:13px; color:#cfd8dc;">
            💡 <b>Coach Tip:</b> Session shuru hone se 5 minute pehle join karein. Diary aur pen saath rakhein — session mein world-class Lead Magnet Process + Instagram Growth Plan live share hoga.
          </div>
        </div>

        <div class="ftr">
          Reka Creative Labs · Founder: Abhinash Singh · +91 83685 08556<br>
          A Block, Pocket A, Sector 19, Noida, UP 201301
        </div>
      </div>
    </body>
    </html>
  `;

  // Internal Alert to Founder
  const adminSubject = `💰 NEW PAID COACH [Rs. ${booking.amount || 59}]: ${booking.name} - +91 ${cleanPhone}`;
  const adminHtml = `
    <h2>🎉 New Paid Customer Conversion!</h2>
    <p><b>Name:</b> ${booking.name}</p>
    <p><b>WhatsApp Phone:</b> +91 ${cleanPhone} (<a href="${waChatLink}">Open WhatsApp Chat</a>)</p>
    <p><b>Email:</b> ${customerEmail}</p>
    <p><b>Product:</b> ${booking.product}</p>
    <p><b>Amount Paid:</b> Rs. ${booking.amount || 59}</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Slot:</b> ${booking.slot}</p>
    <p><b>Current Monthly VP:</b> ${booking.current_vp || 'N/A'}</p>
    <p><b>Order ID:</b> ${booking.order_id}</p>
    <p><b>Payment ID:</b> ${booking.payment_id || 'N/A'}</p>
    <p><b>Time:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
  `;

  const results = { clientSent: false, adminSent: false };

  try {
    if (customerEmail && customerEmail.includes('@')) {
      await transporter.sendMail({
        from: `"Reka Creative Labs" <${EMAIL_USER}>`,
        to: customerEmail,
        replyTo: EMAIL_USER,
        subject: clientSubject,
        html: clientHtml
      });
      results.clientSent = true;
      console.log(`[Mailer] Zoom link email delivered to customer: ${customerEmail}`);
    }

    await transporter.sendMail({
      from: `"Reka Bookings" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: customerEmail || EMAIL_USER,
      subject: adminSubject,
      html: adminHtml
    });
    results.adminSent = true;
    console.log(`[Mailer] Payment alert delivered to founder: ${EMAIL_USER}`);
  } catch (err) {
    console.error('[Mailer Error]', err.message);
  }

  return results;
}

/**
 * Send Form Fill / Lead Notification to Founder
 */
async function sendLeadFillNotification(lead) {
  const cleanPhone = (lead.phone || '').replace(/[^0-9]/g, '').slice(-10);
  const waChatLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${lead.name}! Aapne Reka Creative Labs par webinar slot check kiya tha.`)}`;

  const adminSubject = `📋 NEW LEAD FILLED FORM: ${lead.name} (+91 ${cleanPhone}) - ${lead.slot || 'Webinar'}`;
  const adminHtml = `
    <h3>New Coach Form Submission (Lead Captured)</h3>
    <p><b>Name:</b> ${lead.name}</p>
    <p><b>Phone:</b> +91 ${cleanPhone} (<a href="${waChatLink}">WhatsApp</a>)</p>
    <p><b>Email:</b> ${lead.email}</p>
    <p><b>Date Selected:</b> ${lead.date || 'N/A'}</p>
    <p><b>Slot Selected:</b> ${lead.slot || 'N/A'}</p>
    <p><b>Current VP:</b> ${lead.current_vp || 'N/A'}</p>
    <p><b>Order ID:</b> ${lead.order_id || 'N/A'}</p>
    <p><b>Status:</b> Order Initiated / Pending Payment</p>
    <p><b>Timestamp:</b> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"Reka Leads" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: adminSubject,
      html: adminHtml
    });
    console.log(`[Mailer] Lead alert sent to founder: ${EMAIL_USER}`);
  } catch (err) {
    console.warn('[Mailer] Lead alert error:', err.message);
  }
}

module.exports = {
  transporter,
  sendBookingConfirmation,
  sendLeadFillNotification,
  ZOOM_LINK,
  ZOOM_MEETING_ID,
  ZOOM_PASSCODE
};
