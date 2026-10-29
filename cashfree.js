const crypto = require('crypto');

const CASHFREE_ENV = (process.env.CASHFREE_ENV || 'TEST').toUpperCase();
const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || '';
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || '';

const BASE_URL = CASHFREE_ENV === 'PROD'
  ? 'https://api.cashfree.com/pg'
  : 'https://sandbox.cashfree.com/pg';

const API_VERSION = '2023-08-01';

// Checks if real credentials are configured
function isConfigured() {
  return !!(
    CASHFREE_APP_ID &&
    CASHFREE_SECRET_KEY &&
    !CASHFREE_APP_ID.includes('YOUR_') &&
    !CASHFREE_APP_ID.includes('test_simulator')
  );
}

function getMode() {
  if (!isConfigured()) return 'simulator';
  return CASHFREE_ENV === 'PROD' ? 'production' : 'sandbox';
}

/**
 * Create a Cashfree Order
 */
async function createOrder({ orderId, amount, currency = 'INR', customer, returnUrl, note }) {
  if (!isConfigured()) {
    console.log(`[Cashfree Simulator] Creating order ${orderId} for Rs. ${amount} (${customer.name})`);
    return {
      success: true,
      mode: 'simulator',
      order_id: orderId,
      order_amount: amount,
      order_currency: currency,
      payment_session_id: `sim_session_${orderId}_${Date.now()}`,
      order_status: 'ACTIVE'
    };
  }

  const cleanPhone = customer.phone.replace(/[^0-9]/g, '').slice(-10);
  const payload = {
    order_id: orderId,
    order_amount: Number(amount),
    order_currency: currency,
    customer_details: {
      customer_id: `cust_${customer.phone.replace(/[^0-9]/g, '').slice(-10)}_${Date.now().toString().slice(-4)}`,
      customer_name: customer.name.trim(),
      customer_email: customer.email.trim(),
      customer_phone: cleanPhone
    },
    order_meta: {
      return_url: returnUrl || `http://localhost:5000/herbalife-coaches.html?order_id={order_id}`
    },
    order_note: note || 'Reka Creative Labs Booking'
  };

  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': API_VERSION,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('[Cashfree Error]', data);
      throw new Error(data.message || 'Cashfree order creation failed');
    }

    return {
      success: true,
      mode: CASHFREE_ENV === 'PROD' ? 'production' : 'sandbox',
      order_id: data.order_id,
      order_amount: data.order_amount,
      order_currency: data.order_currency,
      payment_session_id: data.payment_session_id,
      order_status: data.order_status
    };
  } catch (err) {
    console.error('[Cashfree API Exception]', err);
    throw err;
  }
}

/**
 * Verify Order status with Cashfree Server
 */
async function verifyOrder(orderId, paymentId = '') {
  if (!isConfigured()) {
    console.log(`[Cashfree Simulator] Verifying simulated order ${orderId}`);
    return {
      is_paid: true,
      order_status: 'PAID',
      payment_id: paymentId || `sim_pay_${Date.now()}`,
      payment_method: 'UPI (Simulator Test Mode)',
      raw: { mode: 'simulator', verified_at: new Date().toISOString() }
    };
  }

  try {
    // 1. Fetch Order details
    const orderRes = await fetch(`${BASE_URL}/orders/${orderId}`, {
      headers: {
        'x-client-id': CASHFREE_APP_ID,
        'x-client-secret': CASHFREE_SECRET_KEY,
        'x-api-version': API_VERSION
      }
    });
    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      throw new Error(orderData.message || 'Failed to fetch order from Cashfree');
    }

    // 2. Fetch payments for order
    let paymentDetails = null;
    try {
      const payRes = await fetch(`${BASE_URL}/orders/${orderId}/payments`, {
        headers: {
          'x-client-id': CASHFREE_APP_ID,
          'x-client-secret': CASHFREE_SECRET_KEY,
          'x-api-version': API_VERSION
        }
      });
      const payments = await payRes.json();
      if (Array.isArray(payments) && payments.length > 0) {
        const successful = payments.find(p => p.payment_status === 'SUCCESS');
        if (successful) {
          paymentDetails = successful;
        } else {
          paymentDetails = payments[0];
        }
      }
    } catch (e) {
      console.warn('[Cashfree Warning] Could not fetch detailed payments:', e.message);
    }

    const isPaid = orderData.order_status === 'PAID' || (paymentDetails && paymentDetails.payment_status === 'SUCCESS');

    return {
      is_paid: isPaid,
      order_status: orderData.order_status,
      payment_id: paymentDetails ? paymentDetails.cf_payment_id : paymentId,
      payment_method: paymentDetails ? paymentDetails.payment_group || paymentDetails.payment_method : 'Online',
      raw: orderData
    };
  } catch (err) {
    console.error('[Cashfree Verification Error]', err);
    throw err;
  }
}

/**
 * Verify Cashfree Webhook Signature
 */
function verifyWebhookSignature(rawBody, signature, timestamp) {
  if (!CASHFREE_SECRET_KEY) return true; // Simulator bypass
  try {
    const dataToSign = timestamp + rawBody;
    const expectedSignature = crypto
      .createHmac('sha256', CASHFREE_SECRET_KEY)
      .update(dataToSign)
      .digest('base64');
    return expectedSignature === signature;
  } catch (err) {
    console.error('Webhook signature verification error:', err);
    return false;
  }
}

module.exports = {
  isConfigured,
  getMode,
  createOrder,
  verifyOrder,
  verifyWebhookSignature
};
