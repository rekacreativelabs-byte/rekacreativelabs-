const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Gmail SMTP Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'rekacreativelabs@gmail.com',
    pass: (process.env.EMAIL_PASS || 'jkpf fcvq jldb kyapm').replace(/\s+/g, '')
  }
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('Nodemailer SMTP Ready to send emails via Gmail');
  }
});

// Lead Capture API Endpoint
app.post('/api/send-lead', async (req, res) => {
  const { name, phone, need, source } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
  }

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/91${cleanPhone}?text=Hi%20${encodeURIComponent(name)}!%20Thank%20you%20for%20connecting%20with%20Reka%20Creative%20Labs.%20We%20received%20your%20request%20for%20${encodeURIComponent(need || 'Coaching Growth Plan')}.`;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0d0c; margin: 0; padding: 20px; color: #f4f7f5; }
        .card { max-width: 580px; margin: 0 auto; background: #131715; border: 1px solid #2c3530; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.6); }
        .header { background: linear-gradient(135deg, #182100 0%, #131715 100%); padding: 32px 28px; border-bottom: 2px solid #c7ff2f; position: relative; }
        .diwali-badge { display: inline-block; background: linear-gradient(90deg, #ff8c00, #ffd700); color: #120500; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 12px; border-radius: 999px; margin-bottom: 12px; }
        .title { font-size: 24px; font-weight: 900; color: #f4f7f5; margin: 0 0 6px; }
        .subtitle { font-size: 14px; color: #aab5af; margin: 0; }
        .content { padding: 28px; }
        .field { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #202723; }
        .field:last-child { border-bottom: none; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #c7ff2f; font-weight: 700; margin-bottom: 5px; }
        .val { font-size: 17px; font-weight: 600; color: #ffffff; }
        .cta-btn { display: inline-block; background: #25D366; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 800; border-radius: 999px; margin-top: 10px; font-size: 15px; text-align: center; }
        .footer { background: #0c0f0d; padding: 18px 28px; font-size: 12px; color: #6e7973; text-align: center; border-top: 1px solid #1f2722; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <div class="diwali-badge">🪔 DIWALI SPECIAL OFFER CLAIMED</div>
          <div class="title">New Coach Lead Received! 🚀</div>
          <div class="subtitle">Herbalife / Wellness Growth Plan Request</div>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Coach Name</div>
            <div class="val">${name}</div>
          </div>
          <div class="field">
            <div class="label">WhatsApp Number</div>
            <div class="val">${phone}</div>
          </div>
          <div class="field">
            <div class="label">Requirement (Aapko Kya Chahiye)</div>
            <div class="val" style="color:#c7ff2f;">${need || 'Growth Audit'}</div>
          </div>
          <div class="field">
            <div class="label">Claimed Offer</div>
            <div class="val">Free 1 Month Meta Ads Help (Diwali Special)</div>
          </div>
          <div class="field">
            <div class="label">Source Page</div>
            <div class="val" style="font-size:13px; color:#aab5af;">${source || 'Herbalife Coaches Tab (herbalife-coaches.html)'}</div>
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="${waLink}" class="cta-btn" target="_blank">
              💬 Direct WhatsApp Message Bhejo
            </a>
          </div>
        </div>
        <div class="footer">
          Reka Creative Labs • Automated Lead Delivery System<br>
          Delivered in real-time to rekacreativelabs@gmail.com
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Reka Creative Labs Leads" <${process.env.EMAIL_USER || 'rekacreativelabs@gmail.com'}>`,
    to: 'rekacreativelabs@gmail.com',
    replyTo: 'rekacreativelabs@gmail.com',
    subject: `🔥 New Coach Lead: ${name} (${phone}) - Diwali Offer`,
    html: htmlTemplate
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Lead Email Sent Successfully:', info.messageId);
    res.json({ success: true, message: 'Email sent successfully', messageId: info.messageId });
  } catch (error) {
    console.error('Error sending lead email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
