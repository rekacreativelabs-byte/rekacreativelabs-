const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Gmail SMTP Transporter with smart key sanitization
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

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('Nodemailer SMTP Ready to send emails via Gmail to ' + emailUser);
  }
});

// Lead Capture API Endpoint
app.post('/api/send-lead', async (req, res) => {
  const { name, phone, need, source } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waMessage = `Hi ${name}! Thank you for connecting with Reka Creative Labs. We received your request for ${need || 'Coach Leads Growth Plan'} with Free 1 Month Meta Ads Help (Diwali Special). Let's discuss your coach growth system!`;
  const waLink = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
  const callLink = `tel:+91${cleanPhone}`;
  const nowIST = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Lead Notification</title>
      <style>
        body { margin: 0; padding: 24px 10px; background-color: #070908; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f7f5; line-height: 1.5; }
        .wrapper { max-width: 620px; margin: 0 auto; background: #0f1411; border: 1px solid rgba(199, 255, 47, 0.25); border-radius: 26px; overflow: hidden; box-shadow: 0 25px 70px rgba(0,0,0,0.8), 0 0 40px rgba(199,255,47,0.08); }
        .top-glow { height: 6px; background: linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #c7ff2f); }
        .festive-header { background: radial-gradient(circle at top right, rgba(255,140,0,0.25), transparent 60%), linear-gradient(145deg, #182200 0%, #111713 100%); padding: 36px 32px 30px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); position: relative; }
        .diwali-pill { display: inline-block; background: linear-gradient(90deg, #ff4500, #ff8c00, #ffd700); color: #120500; font-size: 11px; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; padding: 5px 16px; border-radius: 999px; box-shadow: 0 4px 16px rgba(255,140,0,0.4); margin-bottom: 14px; }
        .festive-title { font-size: 26px; font-weight: 900; color: #ffffff; margin: 0 0 6px; letter-spacing: -0.02em; }
        .festive-title span { color: #c7ff2f; }
        .festive-bonus { font-size: 15px; font-weight: 700; color: #ffd700; margin: 0 0 8px; }
        .festive-sub { font-size: 13px; color: #b7c4bc; margin: 0 auto; max-width: 480px; }
        .sparkles { font-size: 20px; margin-top: 8px; letter-spacing: 4px; }
        
        .body-card { padding: 32px 28px; }
        .alert-banner { background: rgba(199,255,47,0.08); border: 1px solid rgba(199,255,47,0.3); border-radius: 16px; padding: 14px 18px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
        .alert-text { font-size: 13px; font-weight: 700; color: #c7ff2f; margin: 0; }
        .alert-time { font-size: 11px; color: #8e9e95; margin: 0; white-space: nowrap; }

        .lead-grid { background: #141c17; border: 1px solid rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; margin-bottom: 26px; }
        .lead-row { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .lead-row:last-child { border-bottom: none; }
        .lead-lbl { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #7f9488; }
        .lead-val { font-size: 16px; font-weight: 700; color: #ffffff; text-align: right; }
        .lead-val.highlight { color: #c7ff2f; font-size: 18px; font-weight: 800; }
        .lead-val.bonus { color: #ffd700; }
        .badge-tag { display: inline-block; background: rgba(199,255,47,0.14); border: 1px solid #c7ff2f; color: #c7ff2f; font-size: 12px; font-weight: 800; padding: 4px 12px; border-radius: 8px; }

        .actions-block { text-align: center; margin: 28px 0 10px; }
        .btn-wa { display: block; background: #25D366; color: #ffffff !important; text-decoration: none; padding: 16px 24px; font-weight: 900; font-size: 16px; border-radius: 999px; box-shadow: 0 10px 30px rgba(37,211,102,0.35); text-align: center; margin-bottom: 12px; }
        .btn-call { display: inline-block; background: rgba(255,255,255,0.08); color: #f4f7f5 !important; text-decoration: none; padding: 11px 22px; font-weight: 700; font-size: 13px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.18); text-align: center; }

        .lead-notes { background: #0c100d; border-radius: 14px; padding: 16px 18px; margin-top: 24px; border: 1px dashed rgba(255,255,255,0.1); font-size: 12px; color: #8e9e95; text-align: center; }
        .lead-notes b { color: #ffffff; }

        .footer { background: #080b09; padding: 22px 24px; text-align: center; font-size: 11px; color: #627269; border-top: 1px solid rgba(255,255,255,0.06); }
        .footer a { color: #c7ff2f; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="top-glow"></div>
        
        <!-- Header: Diwali Special Offer & Growth Plan -->
        <div class="festive-header">
          <div class="diwali-pill">🪔 Diwali Special Offer</div>
          <div class="festive-bonus">✨ Join Us &amp; Get Free 1 Month Meta Ads Help ✨</div>
          <div class="festive-sub">Exclusive festive bonus for our new &amp; onboarded coaching clients.</div>
          <div class="sparkles">✨ 🪔 ✨</div>
          
          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08);">
            <h1 class="festive-title">Free Coach Leads <span>Growth Plan</span></h1>
            <p class="festive-sub" style="font-size:12px; color:#95a89e;">
              Form fill karein. Hamari growth team aapke Instagram profile &amp; ads funnel ka live audit karke direct WhatsApp par plan bhejegi.
            </p>
          </div>
        </div>

        <!-- Body Content -->
        <div class="body-card">
          <div class="alert-banner">
            <p class="alert-text">🔥 New Inbound Lead Alert</p>
            <p class="alert-time">📅 ${nowIST}</p>
          </div>

          <!-- Lead Details Grid -->
          <div class="lead-grid">
            <div class="lead-row">
              <span class="lead-lbl">Aapka Naam</span>
              <span class="lead-val highlight">${name}</span>
            </div>
            <div class="lead-row">
              <span class="lead-lbl">WhatsApp Number</span>
              <span class="lead-val" style="color:#25D366; font-size:17px; letter-spacing:0.5px;">+91 ${cleanPhone}</span>
            </div>
            <div class="lead-row">
              <span class="lead-lbl">Requirement (Kya Chahiye)</span>
              <span class="lead-val"><span class="badge-tag">${need || 'Coach Growth Audit'}</span></span>
            </div>
            <div class="lead-row">
              <span class="lead-lbl">Claimed Diwali Offer</span>
              <span class="lead-val bonus">🎁 Free 1 Month Meta Ads Help</span>
            </div>
            <div class="lead-row">
              <span class="lead-lbl">Source Page</span>
              <span class="lead-val" style="font-size:13px; color:#8e9e95;">${source || 'Herbalife Coaches Tab'}</span>
            </div>
          </div>

          <!-- Direct Call-to-Actions -->
          <div class="actions-block">
            <a href="${waLink}" target="_blank" class="btn-wa">
              💬 Direct WhatsApp Message Bhejo
            </a>
            <a href="${callLink}" class="btn-call">
              📞 Direct Call: +91 ${cleanPhone}
            </a>
          </div>

          <div class="lead-notes">
            ⚡ <b>Next Step:</b> Open WhatsApp to send the customized coach lead audit roadmap and confirm their 1 Month Free Meta Ads Diwali Bonus.
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <b>Reka Creative Labs</b> • AI Creative &amp; Meta Ads Growth Systems<br>
          Delivered in real-time to <a href="mailto:${emailUser}">${emailUser}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Reka Creative Labs Leads" <${emailUser}>`,
    to: emailUser,
    replyTo: emailUser,
    subject: `🔥 New Coach Lead: ${name} (${phone}) - Diwali Special Offer 🪔`,
    html: htmlTemplate
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Lead Email Sent Successfully to ' + emailUser + ' | Message ID:', info.messageId);
    res.json({ success: true, message: 'Lead received and email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending lead email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
