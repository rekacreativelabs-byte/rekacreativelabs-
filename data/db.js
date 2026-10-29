const fs = require('fs');
const path = require('path');

const DB_DIR = path.join(__dirname);
const DB_FILE = path.join(DB_DIR, 'bookings.json');

// Ensure DB directory and file exist
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
}

function readBookings() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading bookings DB:', err);
    return [];
  }
}

function writeBookings(bookings) {
  try {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(bookings, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error writing bookings DB:', err);
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
  if (paymentDetails.payment_id) booking.payment_id = paymentDetails.payment_id;
  if (paymentDetails.payment_method) booking.payment_method = paymentDetails.payment_method;
  if (paymentDetails.raw) booking.payment_raw = paymentDetails.raw;
  booking.updated_at = new Date().toISOString();
  writeBookings(bookings);
  return booking;
}

function listBookings() {
  return readBookings();
}

const MAX_SEATS_PER_SLOT = 20;

function getSlotBookingCount(date, slot) {
  const bookings = readBookings();
  // Count confirmed bookings for that date & slot
  return bookings.filter(b =>
    b.product === 'webinar' &&
    b.date === date &&
    b.slot === slot &&
    b.status === 'CONFIRMED'
  ).length;
}

function getSlotAvailability(date) {
  const slots = ['11:00 AM', '02:00 PM', '03:00 PM'];
  const result = {};
  slots.forEach(slot => {
    const booked = getSlotBookingCount(date, slot);
    result[slot] = {
      max_seats: MAX_SEATS_PER_SLOT,
      booked_seats: booked,
      available_seats: Math.max(0, MAX_SEATS_PER_SLOT - booked),
      is_full: booked >= MAX_SEATS_PER_SLOT
    };
  });
  return result;
}

module.exports = {
  saveBooking,
  getBooking,
  updateBookingStatus,
  listBookings,
  MAX_SEATS_PER_SLOT,
  getSlotBookingCount,
  getSlotAvailability
};
