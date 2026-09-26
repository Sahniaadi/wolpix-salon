// Vercel Serverless Function - /api/bookings
// NOTE: Vercel's filesystem is read-only in production.
// Data is stored in-memory per-instance. For persistent storage,
// connect to a database like MongoDB Atlas, PlanetScale, or Supabase.

// In-memory store (resets on cold start - replace with a real DB for production)
let bookings = [];

function generateId() {
  return 'bkg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function generateRef() {
  return 'WPX-' + Math.floor(1000 + Math.random() * 9000);
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8'
  };
}

export default async function handler(req, res) {
  // Set CORS headers
  Object.entries(corsHeaders()).forEach(([key, val]) => res.setHeader(key, val));

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { url, method } = req;
  // Extract booking ID from URL like /api/bookings/bkg_123
  const parts = url.split('?')[0].split('/').filter(Boolean);
  const bookingId = parts.length > 2 ? parts[2] : null;

  // GET /api/bookings
  if (method === 'GET' && !bookingId) {
    return res.status(200).json({ success: true, count: bookings.length, bookings });
  }

  // POST /api/bookings
  if (method === 'POST') {
    const { name, phone, email, service, date, time, requests, refCode } = req.body || {};

    if (!name || !phone || !email || !service || !date) {
      return res.status(400).json({ success: false, error: 'Missing required booking fields.' });
    }

    const newBooking = {
      id: generateId(),
      refCode: refCode || generateRef(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      service: service.trim(),
      date: date.trim(),
      time: (time || '11:00 AM').trim(),
      requests: (requests || '').trim(),
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.unshift(newBooking);
    return res.status(201).json({ success: true, message: 'Appointment booked successfully.', booking: newBooking });
  }

  // PATCH /api/bookings/:id
  if (method === 'PATCH' && bookingId) {
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    const { status, notes } = req.body || {};
    if (status) bookings[index].status = status;
    if (notes) bookings[index].notes = notes;
    return res.status(200).json({ success: true, booking: bookings[index] });
  }

  // DELETE /api/bookings/:id
  if (method === 'DELETE' && bookingId) {
    const initialLen = bookings.length;
    bookings = bookings.filter(b => b.id !== bookingId);
    if (bookings.length === initialLen) {
      return res.status(404).json({ success: false, error: 'Booking not found.' });
    }
    return res.status(200).json({ success: true, message: 'Booking removed successfully.' });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
