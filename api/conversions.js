/**
 * Meta Conversions API (CAPI) Serverless Handler for Vercel
 * Dataset / Pixel ID: 1095990819739700
 */

const crypto = require('crypto');

// Default credentials (can be overridden via environment variables in Vercel)
const DEFAULT_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'EAAP2hyy1excBSuqwoS7Ix3r8PQheoMJwVRungPkV8jBJ34lQFLONOS7gvfLx9MxEoexdZBZBNnXRw7kUzbAAq1kBmZAcsZB9ylhzuNyRLZBsZCYyJANfultominVGB3MhUaZBqYn6nzmyMPGV5UeBkXKA1M6ihG4ucSebz1rFkt3ZA1d9TIQZBxZADBYfpwErGIgZDZD';
const PIXEL_ID = process.env.META_PIXEL_ID || '1095990819739700';
const GRAPH_API_VERSION = 'v19.0';

/**
 * Normalizes and hashes sensitive user values (email, phone, etc.) using SHA-256
 */
function hashValue(val) {
  if (!val || typeof val !== 'string') return null;
  const trimmed = val.trim().toLowerCase();
  // If already 64-char hex SHA-256, keep as is
  if (/^[a-f0-9]{64}$/.test(trimmed)) {
    return trimmed;
  }
  return crypto.createHash('sha256').update(trimmed).digest('hex');
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'active',
      pixel_id: PIXEL_ID,
      message: 'Meta Conversions API endpoint is operational.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const clientUserAgent = req.headers['user-agent'];

    // Support both single event request and batch payload array
    let eventsData = [];

    if (Array.isArray(body.data)) {
      eventsData = body.data;
    } else {
      const eventName = body.event_name || 'Lead';
      const eventTime = body.event_time || Math.floor(Date.now() / 1000);
      const actionSource = body.action_source || 'website';
      const eventSourceUrl = body.event_source_url || (req.headers.referer || 'https://www.rekacreativelabs.com');

      const rawUserData = body.user_data || {};
      const userData = {
        client_ip_address: rawUserData.client_ip_address || (clientIp ? clientIp.split(',')[0].trim() : undefined),
        client_user_agent: rawUserData.client_user_agent || clientUserAgent,
        fbp: rawUserData.fbp,
        fbc: rawUserData.fbc
      };

      if (rawUserData.em) {
        const emailArr = Array.isArray(rawUserData.em) ? rawUserData.em : [rawUserData.em];
        userData.em = emailArr.map(hashValue).filter(Boolean);
      } else if (rawUserData.email) {
        userData.em = [hashValue(rawUserData.email)].filter(Boolean);
      }

      if (rawUserData.ph) {
        const phoneArr = Array.isArray(rawUserData.ph) ? rawUserData.ph : [rawUserData.ph];
        userData.ph = phoneArr.map(p => {
          if (!p) return null;
          const cleanPhone = String(p).replace(/\D/g, '');
          return hashValue(cleanPhone);
        }).filter(Boolean);
      } else if (rawUserData.phone) {
        const cleanPhone = String(rawUserData.phone).replace(/\D/g, '');
        userData.ph = [hashValue(cleanPhone)].filter(Boolean);
      }

      const eventPayload = {
        event_name: eventName,
        event_time: eventTime,
        action_source: actionSource,
        event_source_url: eventSourceUrl,
        user_data: userData,
        custom_data: body.custom_data || {}
      };

      if (body.event_id) {
        eventPayload.event_id = body.event_id;
      }

      eventsData = [eventPayload];
    }

    const payload = {
      data: eventsData
    };

    if (body.test_event_code) {
      payload.test_event_code = body.test_event_code;
    }

    const token = process.env.META_ACCESS_TOKEN || DEFAULT_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`;

    const fbResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const fbData = await fbResponse.json();

    if (!fbResponse.ok) {
      return res.status(fbResponse.status).json({
        success: false,
        error: fbData
      });
    }

    return res.status(200).json({
      success: true,
      meta_response: fbData
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};
