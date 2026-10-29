const fs = require('fs');
const path = require('path');

// In serverless (Vercel/AWS Lambda), filesystem outside /tmp is read-only
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const DB_DIR = isServerless ? '/tmp' : path.join(__dirname);
const DB_FILE = path.join(DB_DIR, 'bookings.json');

// In-memory cache fallback to ensure zero runtime errors
let memoryBookings = [];

try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
  }
} catch (e) {
  console.warn('[DB] Warning: Filesystem initialization fallback to memory:', e.message);
}

function readBookings() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(raw || '[]');
      memoryBookings = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('[DB] Error reading bookings DB, using memory cache:', err.message);
  }
  return memoryBookings;
}

function writeBookings(bookings) {
  memoryBookings = bookings;
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(bookings, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.warn('[DB] Could not persist to disk, stored in memory:', err.message);
  }
}

function saveBooking(booking) {
  const bookings = readBookings();
  const existingIndex = bookings.findIndex(b => b.order_id === booking.order_id);
  if (existingIndex >= 0) {
    bookings[existingIndex] = { ...bookings[existingIndex], ...booking, updated_at: new Date().toISOString() };
  } else {
    bookings.push({
      ...booking,
      created_at: booking.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  writeBookings(bookings);
  return booking;
}

function getBooking(orderId) {
  const bookings = readBookings();
  return bookings.find(b => b.order_id === orderId) || null;
}

function updateBookingStatus(orderId, status, paymentDetails = {}) {
  const bookings = readBookings();
  const booking = bookings.find(b => b.order_id === orderId);
  if (!booking) return null;
  booking.status = status;
  booking.payment = {
    ...booking.payment,
    ...paymentDetails,
    verified_at: new Date().toISOString()
  };
  booking.updated_at = new Date().toISOString();
  writeBookings(bookings);
  return booking;
}

// User-specified capacity: exactly 20 people per slot
const MAX_SEATS_PER_SLOT = 20;

function getSlotAvailability(date, slot) {
  const bookings = readBookings();
  const confirmed = bookings.filter(b =>
    b.product === 'webinar' &&
    b.date === date &&
    b.slot === slot &&
    (b.status === 'PAID' || b.status === 'CONFIRMED')
  );
  const booked = confirmed.length;
  const remaining = Math.max(0, MAX_SEATS_PER_SLOT - booked);
  return {
    date,
    slot,
    max_seats: MAX_SEATS_PER_SLOT,
    booked_seats: booked,
    remaining_seats: remaining,
    is_available: remaining > 0
  };
}

module.exports = {
  MAX_SEATS_PER_SLOT,
  readBookings,
  saveBooking,
  getBooking,
  updateBookingStatus,
  getSlotAvailability
};
