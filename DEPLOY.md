# Deploy FarolChat (GitHub Pages + API)

## 1) GitHub Pages (site)
- Branch: `main` | pasta: raiz (`/`).
- Arquivos chave:
  - `index.html` → redireciona para `SiteFarolChatLand.html`
  - `CNAME` → `farolchat.com`

## 2) Domínio customizado (erro "already taken")
1. No GitHub (Profile Settings) > Pages > Verified domains > Add a domain: `farolchat.com`.
2. O GitHub mostrará um TXT para verificar, algo como:
   - Host/Name: `_github-pages-challenge-JeronimoKarasek` (ou `_github-pages-challenge-JeronimoKarasek.farolchat.com`)
   - Value: `<token fornecido>`
3. Na Hostinger (DNS Zone Editor do farolchat.com), crie o TXT com esses dados.
4. Aguarde e volte no GitHub para concluir a verificação (Continue verifying > Verify).
5. Depois, no repo Farolchat: Settings > Pages > Custom domain: `farolchat.com` e salve. Ative “Enforce HTTPS”.

## 3) DNS do farolchat.com (Hostinger)
- A (host `@`) → 185.199.108.153
- A (host `@`) → 185.199.109.153
- A (host `@`) → 185.199.110.153
- A (host `@`) → 185.199.111.153
- CNAME (host `www`) → `jeronimokarasek.github.io`

## 4) API de pagamento (api.farolchat.com)
- Pasta `backend-api/` contém uma API serverless pronta para Vercel.
- Passos:
  1. Crie o repo `farolchat-api` e suba o conteúdo de `backend-api/`.
  2. Importe na Vercel e configure variáveis:
     - `PICPAY_CLIENT_ID`, `PICPAY_CLIENT_SECRET`
     - (opcional) `PICPAY_CALLBACK_URL`, `PICPAY_RETURN_URL`
  3. Adicione domínio `api.farolchat.com` no projeto da Vercel.
  4. Na Hostinger crie CNAME:
     - Host: `api`
     - Aponta para: `cname.vercel-dns.com` (ou alvo exibido pela Vercel)

## 5) Fluxo do checkout no front-end
- `SiteFarolChatLand.html` agora chama `POST https://api.farolchat.com/api/picpay/checkout`.
- Sem backend configurado, o botão exibirá erro. Implante a API antes de testar.

## 6) Verificações rápidas
- DNS: `nslookup -type=A farolchat.com` deve retornar IPs do GitHub Pages.
- DNS: `nslookup -type=CNAME api.farolchat.com` deve apontar para o alvo da Vercel.
- Site: `https://farolchat.com` com HTTPS ativo.
- API: `curl -X POST https://api.farolchat.com/api/picpay/checkout ...` retorna `{ link }`.
