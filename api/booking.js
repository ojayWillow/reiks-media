const { createHash } = require('node:crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ error: 'invalid_request' });
  }
  const { name, email, date, time, message = '', website = '' } = body;
  if (website) return res.status(400).json({ error: 'invalid_request' });
  if (typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
      typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      typeof time !== 'string' || !/^(1[0-6]):(00|30)$/.test(time) ||
      typeof message !== 'string' || message.length > 2000) {
    return res.status(400).json({ error: 'invalid_request' });
  }
  const selected = new Date(date + 'T12:00:00Z');
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Riga' }).format(new Date());
  if (Number.isNaN(selected.getTime()) || selected.toISOString().slice(0, 10) !== date ||
      date < today || [0, 6].includes(selected.getUTCDay())) {
    return res.status(400).json({ error: 'invalid_date' });
  }
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM;
  const to = process.env.BOOKING_TO;
  if (!apiKey || !from || !to) return res.status(503).json({ error: 'delivery_not_configured' });
  const text = [
    'Jauns Reiks MEDIA sarunas pieteikums',
    '', 'Vārds: ' + name.trim(), 'E-pasts: ' + email,
    'Vēlamais datums: ' + date, 'Vēlamais laiks: ' + time + ' (Europe/Riga)',
    'Ilgums: 30 minūtes', '', 'Iecere:', message || 'Nav norādīta.',
    '', 'Šis ir laika pieprasījums. Lūdzu, apstipriniet laiku, atbildot pieteikuma iesniedzējam.'
  ].join('\n');
  const key = createHash('sha256').update(JSON.stringify([name, email, date, time, message])).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json', 'Idempotency-Key': 'booking-' + key },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: 'Reiks MEDIA — sarunas pieteikums ' + date + ' ' + time, text }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return res.status(502).json({ error: 'delivery_failed' });
    return res.status(200).json({ sent: true });
  } catch (error) {
    return res.status(502).json({ error: 'delivery_failed' });
  }
};
