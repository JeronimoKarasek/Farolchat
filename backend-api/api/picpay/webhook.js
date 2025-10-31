// Opcional: PicPay webhook (configure a URL em PICPAY_CALLBACK_URL)

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
    // Aqui você pode validar assinatura/headers do PicPay (se aplicável) e
    // atualizar o status do pagamento no seu sistema.
    console.log('PicPay webhook payload:', req.body);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Erro no webhook' });
  }
};

