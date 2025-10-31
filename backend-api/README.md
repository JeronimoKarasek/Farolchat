# FarolChat API (PicPay)

Esta é uma API serverless (Vercel) para gerar link de pagamento no PicPay sem expor segredos no front-end.

## Endpoints
- POST `/api/picpay/checkout` → cria pagamento e retorna `{ link }`
- POST `/api/picpay/webhook` → (opcional) recebe notificações do PicPay

## Variáveis de ambiente
- `PICPAY_CLIENT_ID`: Client ID do app no PicPay
- `PICPAY_CLIENT_SECRET`: Client Secret do app no PicPay
- `PICPAY_CALLBACK_URL` (opcional): URL pública do webhook (ex.: `https://api.farolchat.com/api/picpay/webhook`)
- `PICPAY_RETURN_URL` (opcional): URL de retorno (ex.: `https://farolchat.com/obrigado`)

## Deploy na Vercel
1. Crie um novo repositório no GitHub chamado `farolchat-api` e suba o conteúdo da pasta `backend-api`.
2. No painel da Vercel, importe o repo `farolchat-api`.
3. Em Settings > Environment Variables, adicione:
   - `PICPAY_CLIENT_ID`
   - `PICPAY_CLIENT_SECRET`
   - (opcionais) `PICPAY_CALLBACK_URL`, `PICPAY_RETURN_URL`
4. Deploy.

## Domínio `api.farolchat.com`
- Em Vercel > Project > Domains > Add: `api.farolchat.com`
- Vercel mostrará o alvo CNAME (normalmente `cname.vercel-dns.com`).
- No DNS da Hostinger, crie CNAME:
  - Tipo: CNAME
  - Host: `api`
  - Aponta para: `cname.vercel-dns.com` (ou o alvo que a Vercel indicar)
  - TTL: padrão
- Aguarde a propagação e verifique o status no painel da Vercel.

## Front-end
No repositório do site (GitHub Pages), o JS usa `API_BASE = 'https://api.farolchat.com'` e chama `POST /api/picpay/checkout`.

## Teste rápido
```bash
curl -X POST https://api.farolchat.com/api/picpay/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "nome":"Cliente Teste",
    "cpf":"000.000.000-00",
    "telefone":"(11) 99999-9999",
    "email":"cliente@teste.com",
    "usuarios":1,
    "conexoes":2
  }'
```

Se configurado corretamente, a resposta conterá `{ "link": "..." }` para redirecionar ao checkout do PicPay.
