// Vercel Serverless Function - /api/newsletter
// In-memory store (resets on cold start - replace with a real DB for production)
let subscribers = [];

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8'
  };
}

export default async function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([key, val]) => res.setHeader(key, val));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // GET /api/newsletter
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, count: subscribers.length, subscribers });
  }

  // POST /api/newsletter
  if (req.method === 'POST') {
    const email = ((req.body || {}).email || '').trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'Valid email required.' });
    }

    if (subscribers.some(s => s.email === email)) {
      return res.status(200).json({ success: true, message: 'Already subscribed to VIP Gazette.' });
    }

    const newSubscriber = {
      id: 'sub_' + Date.now(),
      email,
      subscribedAt: new Date().toISOString()
    };
    subscribers.unshift(newSubscriber);
    return res.status(201).json({ success: true, message: 'Subscribed successfully to VIP Gazette.' });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
