// Vercel Serverless Function - /api/consultations
// In-memory store (resets on cold start - replace with a real DB for production)
let consultations = [];

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

  // GET /api/consultations
  if (req.method === 'GET') {
    return res.status(200).json({ success: true, count: consultations.length, consultations });
  }

  // POST /api/consultations
  if (req.method === 'POST') {
    const payload = req.body || {};
    const newConsultation = {
      id: 'cst_' + Date.now(),
      ...payload,
      createdAt: new Date().toISOString()
    };
    consultations.unshift(newConsultation);
    return res.status(201).json({ success: true, message: 'Consultation saved.', consultation: newConsultation });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
