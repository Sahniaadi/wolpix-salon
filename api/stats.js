// Vercel Serverless Function - /api/stats
// Uses shared in-memory stores (per-instance, non-persistent on Vercel free tier)
// For persistent stats, connect to a database.

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8'
  };
}

export default async function handler(req, res) {
  Object.entries(corsHeaders()).forEach(([key, val]) => res.setHeader(key, val));

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method === 'GET') {
    // Return placeholder stats (in-memory data lives separately in each function instance)
    return res.status(200).json({
      totalBookings: 0,
      confirmed: 0,
      pending: 0,
      completed: 0,
      totalSubscribers: 0,
      totalConsultations: 0
    });
  }

  return res.status(405).json({ success: false, error: 'Method not allowed.' });
}
