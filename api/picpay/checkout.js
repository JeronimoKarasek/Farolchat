// Vercel serverless function: POST /api/picpay/checkout

const OAUTH_URL = 'https://oauth.picpay.com/oauth2/token';
const PAYMENTS_URL = 'https://api.picpay.com/public/payments';

function cleanDigits(s){ return (s||'').toString().replace(/\D+/g,''); }

module.exports = async (req, res) => {
  // CORS
  const allowList = [
    'https://farolchat.com',
    'https://www.farolchat.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  const origin = req.headers.origin;
  const allowOrigin = allowList.includes(origin) ? origin : allowList[0];
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const {
      nome,
      cpf,
      telefone,
      email,
      usuarios,
      conexoes
    } = body;

    const u = Math.max(1, Number(usuarios||1));
    const c = Math.max(2, Number(conexoes||2));
    const total = Number((u*27.90 + c*49.90).toFixed(2));

    const CLIENT_ID = process.env.PICPAY_CLIENT_ID;
    const CLIENT_SECRET = process.env.PICPAY_CLIENT_SECRET;
    if (!CLIENT_ID || !CLIENT_SECRET) {
      return res.status(500).json({ error: 'Servidor sem credenciais do PicPay' });
    }

    // OAuth
    const tokenRes = await fetch(OAUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      })
    });
    const tokenBody = await tokenRes.text();
    if (!tokenRes.ok) {
      return res.status(502).send(`OAuth error: ${tokenBody}`);
    }
    const { access_token } = JSON.parse(tokenBody);

    const parts = (nome||'Cliente FarolChat').trim().split(/\s+/);
    const firstName = parts[0] || 'Cliente';
    const lastName = parts.slice(1).join(' ') || 'FarolChat';

    const payload = {
      referenceId: 'FAROL-' + Date.now(),
      callbackUrl: process.env.PICPAY_CALLBACK_URL || 'https://api.farolchat.com/api/picpay/webhook',
      returnUrl: process.env.PICPAY_RETURN_URL || 'https://farolchat.com/obrigado',
      value: total,
      buyer: {
        firstName,
        lastName,
        document: cleanDigits(cpf),
        phone: cleanDigits(telefone),
        email
      }
    };

    const payRes = await fetch(PAYMENTS_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const payBody = await payRes.text();
    if (!payRes.ok) {
      return res.status(502).send(payBody);
    }
    const data = JSON.parse(payBody);
    const link = data.paymentUrl || data.qrCodeLink || data.link || null;
    return res.status(200).json({ link, raw: data });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Erro interno' });
  }
};
