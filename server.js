const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = __dirname;
const DATA_DIR = path.join(__dirname, 'data');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper: read JSON data file safely
function readJsonFile(filename, fallback = []) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
      return fallback;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    return fallback;
  }
}

// Helper: write JSON data file safely
function writeJsonFile(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filename}:`, err);
    return false;
  }
}

// Helper: parse JSON request body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', err => reject(err));
  });
}

// Helper: send JSON response
function sendJsonResponse(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;
  const method = req.method;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // ==========================================
  // REST API ENDPOINTS
  // ==========================================

  // GET /api/stats
  if (pathname === '/api/stats' && method === 'GET') {
    const bookings = readJsonFile('bookings.json', []);
    const subscribers = readJsonFile('subscribers.json', []);
    const consultations = readJsonFile('consultations.json', []);

    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const completed = bookings.filter(b => b.status === 'completed').length;

    return sendJsonResponse(res, 200, {
      totalBookings: bookings.length,
      confirmed,
      pending,
      completed,
      totalSubscribers: subscribers.length,
      totalConsultations: consultations.length
    });
  }

  // GET /api/bookings
  if (pathname === '/api/bookings' && method === 'GET') {
    const bookings = readJsonFile('bookings.json', []);
    return sendJsonResponse(res, 200, { success: true, count: bookings.length, bookings });
  }

  // POST /api/bookings
  if (pathname === '/api/bookings' && method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const { name, phone, email, service, date, time, requests } = payload;

      if (!name || !phone || !email || !service || !date) {
        return sendJsonResponse(res, 400, { success: false, error: 'Missing required booking fields.' });
      }

      const bookings = readJsonFile('bookings.json', []);
      const newBooking = {
        id: 'bkg_' + Date.now(),
        refCode: payload.refCode || ('WPX-' + Math.floor(1000 + Math.random() * 9000)),
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
      writeJsonFile('bookings.json', bookings);

      return sendJsonResponse(res, 201, {
        success: true,
        message: 'Appointment booked successfully.',
        booking: newBooking
      });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // PATCH /api/bookings/:id
  if (pathname.startsWith('/api/bookings/') && method === 'PATCH') {
    try {
      const bookingId = pathname.replace('/api/bookings/', '');
      const payload = await parseRequestBody(req);
      const bookings = readJsonFile('bookings.json', []);
      const index = bookings.findIndex(b => b.id === bookingId);

      if (index === -1) {
        return sendJsonResponse(res, 404, { success: false, error: 'Booking not found.' });
      }

      if (payload.status) {
        bookings[index].status = payload.status;
      }
      if (payload.notes) {
        bookings[index].notes = payload.notes;
      }

      writeJsonFile('bookings.json', bookings);
      return sendJsonResponse(res, 200, { success: true, booking: bookings[index] });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // DELETE /api/bookings/:id
  if (pathname.startsWith('/api/bookings/') && method === 'DELETE') {
    const bookingId = pathname.replace('/api/bookings/', '');
    let bookings = readJsonFile('bookings.json', []);
    const initialLen = bookings.length;
    bookings = bookings.filter(b => b.id !== bookingId);

    if (bookings.length === initialLen) {
      return sendJsonResponse(res, 404, { success: false, error: 'Booking not found.' });
    }

    writeJsonFile('bookings.json', bookings);
    return sendJsonResponse(res, 200, { success: true, message: 'Booking removed successfully.' });
  }

  // GET /api/newsletter
  if (pathname === '/api/newsletter' && method === 'GET') {
    const subscribers = readJsonFile('subscribers.json', []);
    return sendJsonResponse(res, 200, { success: true, count: subscribers.length, subscribers });
  }

  // POST /api/newsletter
  if (pathname === '/api/newsletter' && method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const email = (payload.email || '').trim().toLowerCase();

      if (!email || !email.includes('@')) {
        return sendJsonResponse(res, 400, { success: false, error: 'Valid email required.' });
      }

      const subscribers = readJsonFile('subscribers.json', []);
      if (subscribers.some(s => s.email === email)) {
        return sendJsonResponse(res, 200, { success: true, message: 'Already subscribed to VIP Gazette.' });
      }

      const newSubscriber = {
        id: 'sub_' + Date.now(),
        email,
        subscribedAt: new Date().toISOString()
      };
      subscribers.unshift(newSubscriber);
      writeJsonFile('subscribers.json', subscribers);

      return sendJsonResponse(res, 201, { success: true, message: 'Subscribed successfully to VIP Gazette.' });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // GET /api/consultations
  if (pathname === '/api/consultations' && method === 'GET') {
    const consultations = readJsonFile('consultations.json', []);
    return sendJsonResponse(res, 200, { success: true, count: consultations.length, consultations });
  }

  // POST /api/consultations
  if (pathname === '/api/consultations' && method === 'POST') {
    try {
      const payload = await parseRequestBody(req);
      const consultations = readJsonFile('consultations.json', []);
      const newConsultation = {
        id: 'cst_' + Date.now(),
        ...payload,
        createdAt: new Date().toISOString()
      };
      consultations.unshift(newConsultation);
      writeJsonFile('consultations.json', consultations);

      return sendJsonResponse(res, 201, { success: true, message: 'Consultation saved.', consultation: newConsultation });
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const extname = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
      });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`WOLFPix Salon Luxury Studio running at http://localhost:${PORT}`);
});
