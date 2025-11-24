# Configuração no Vercel

## Passo 1: Configurar Variável de Ambiente

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto **Criathon**
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Configure:
   - **Key:** `VITE_GEMINI_API_KEY`
   - **Value:** `AIzaSyCcKVbXh0ZvP3Pfq_rSl6c1VdQtWJ_3s8s`
   - **Environments:** Marque todos (Production, Preview, Development)
6. Clique em **Save**

## Passo 2: Deploy

```bash
git add .
git commit -m "feat: Implementa proxy serverless para API do Gemini"
git push origin main
```

O Vercel fará o deploy automaticamente!

## Como Funciona

- A chave da API fica segura no backend (Environment Variables do Vercel)
- O arquivo `api/gemini-proxy.js` é uma Vercel Function que age como proxy
- O frontend chama `/api/gemini-proxy` ao invés de chamar a API do Gemini diretamente
- A chave nunca é exposta no código do cliente

## Testando Localmente

Para testar localmente com a Vercel CLI:

```bash
npm install -g vercel
vercel env pull
vercel dev
```

Isso baixará as variáveis de ambiente e rodará localmente com as Vercel Functions.

