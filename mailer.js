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
 * Send Free Live Zoom Meeting Link & Confirmation to Customer, and Lead Alert to Founder
 */
async function sendBookingConfirmation(booking) {
  const isWebinar = booking.product !== 'meeting';
  const customerEmail = booking.email;
  const cleanPhone = (booking.phone || '').replace(/[^0-9]/g, '').slice(-10);
  const waChatLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(`Hi ${booking.name}! Aapki Reka Creative Labs Live Zoom Masterclass seat confirm ho gayi hai.`)}`;

  const clientSubject = `🎉 Aapki Free Seat Confirm Hai! Herbalife Coach Live Zoom Masterclass`;

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
        .zoom-title { font-weight:800; font-size:16px; color:#00c853; margin-bottom:10px; }
        .zoom-row { margin:6px 0; font-size:14px; color:#cfd8dc; }
        .zoom-row b { color:#fff; }
        .row { display:flex; justify-content:space-between; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.08); font-size:14px; }
        .lbl { color:#90a4ae; }
        .val { font-weight:700; color:#fff; }
        .btn-join { display:inline-block; background:#00c853; color:#07090c !important; text-decoration:none; padding:14px 28px; border-radius:999px; font-weight:800; font-size:16px; margin:14px 0 6px; text-align:center; width:calc(100% - 56px); }
        .ftr { background:#07090c; padding:16px 24px; font-size:12px; color:#607d8b; text-align:center; border-top:1px solid rgba(255,255,255,0.06); }
      </style>
    </head>
    <body>
      <div class="box">
        <div class="hdr">
          <span class="badge">100% FREE SEAT CONFIRMED</span>
          <div class="h1">Welcome, ${booking.name}! 🎉</div>
          <p style="margin:0; color:#b0bec5; font-size:14px;">Herbalife Coach Daily Live Zoom Masterclass</p>
        </div>

        <div class="cnt">
          <p>Namaste <b>${booking.name}</b>,</p>
          <p>Aapki free seat successfully confirm ho chuki hai. Zoom meeting ki official details neeche note karein:</p>

          <!-- LIVE ZOOM CREDENTIALS -->
          <div class="zoom-box">
            <div class="zoom-title">📹 Live Zoom Session Access</div>
            <div class="zoom-row"><b>🔗 Direct Zoom Link:</b> <a href="${ZOOM_LINK}" style="color:#00c853; word-break:break-all;" target="_blank">${ZOOM_LINK}</a></div>
            <div class="zoom-row"><b>🆔 Meeting ID:</b> <span>${ZOOM_MEETING_ID}</span></div>
            <div class="zoom-row"><b>🔑 Passcode:</b> <span style="background:#07090c; padding:2px 8px; border-radius:4px; color:#00c853; font-family:monospace; font-weight:700;">${ZOOM_PASSCODE}</span></div>
            <div style="text-align:center; margin-top:12px;">
              <a href="${ZOOM_LINK}" class="btn-join" target="_blank">👉 Join Zoom Meeting Now</a>
            </div>
          </div>

          <div class="row"><span class="lbl">Class</span><span class="val">Daily Live Masterclass (Zoom)</span></div>
          <div class="row"><span class="lbl">Fee</span><span class="val" style="color:#00c853;">100% FREE</span></div>
          <div class="row"><span class="lbl">Date</span><span class="val">${booking.date || 'Aaj'}</span></div>
          <div class="row"><span class="lbl">Slot Time</span><span class="val" style="color:#00c853;">${booking.slot || '11:00 AM'} IST</span></div>
          <div class="row"><span class="lbl">Status</span><span class="val" style="color:#00c853;">CONFIRMED</span></div>

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
  const adminSubject = `🔥 NEW COACH REGISTERED [FREE MASTERCLASS]: ${booking.name} - +91 ${cleanPhone}`;
  const adminHtml = `
    <h2>🎉 New Coach Registered for Free Class!</h2>
    <p><b>Name:</b> ${booking.name}</p>
    <p><b>WhatsApp Phone:</b> +91 ${cleanPhone} (<a href="${waChatLink}">Open WhatsApp Chat</a>)</p>
    <p><b>Email:</b> ${customerEmail}</p>
    <p><b>Date:</b> ${booking.date}</p>
    <p><b>Slot:</b> ${booking.slot}</p>
    <p><b>Current Monthly VP:</b> ${booking.current_vp || 'N/A'}</p>
    <p><b>Order ID:</b> ${booking.order_id}</p>
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
      console.log(`[Mailer] Zoom confirmation email delivered to: ${customerEmail}`);
    }

    await transporter.sendMail({
      from: `"Reka Leads" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: customerEmail || EMAIL_USER,
      subject: adminSubject,
      html: adminHtml
    });
    results.adminSent = true;
    console.log(`[Mailer] Registration alert delivered to founder: ${EMAIL_USER}`);
  } catch (err) {
    console.error('[Mailer Error]', err.message);
  }

  return results;
}

module.exports = {
  transporter,
  sendBookingConfirmation,
  ZOOM_LINK,
  ZOOM_MEETING_ID,
  ZOOM_PASSCODE
};
