import http from 'node:http';
import { URL } from 'node:url';
import handler from './api/assistente.js';

const port = Number(process.env.PORT || 3000);
const MAX_BODY = 16000;
const buckets = new Map();

const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store');

  const path = new URL(req.url || '/', 'http://localhost').pathname;
  if (path === '/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ok:true, service:'meu-financeiro-api'}));
    return;
  }
  if (path !== '/api/assistente') {
    res.statusCode = 404;
    res.end('Not found');
    return;
  }

  // Proteção de custo simples por instância. Em produção, complemente com quota
  // diária no provedor e rate limiting persistente, quando disponível.
  const address = String(req.socket.remoteAddress || 'unknown');
  const now = Date.now();
  if (buckets.size > 10000) buckets.clear();
  const current = buckets.get(address);
  const b = current && current.until > now ? current : {until:now+60000,count:0};
  b.count++;
  buckets.set(address,b);
  if (b.count > 12) {
    res.statusCode = 429;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({error:'Muitas solicitações. Tente novamente mais tarde.'}));
    return;
  }

  let length = 0;
  const chunks = [];
  try {
    for await (const chunk of req) {
      length += chunk.length;
      if (length > MAX_BODY) {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({error:'Mensagem muito grande.'}));
        return;
      }
      chunks.push(chunk);
    }
    req.body = Buffer.concat(chunks).toString('utf8');
    res.status = code => { res.statusCode = code; return res; };
    res.json = value => {
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify(value));
      return res;
    };
    await handler(req,res);
    if (!res.writableEnded) res.end();
  } catch (err) {
    if (!res.writableEnded) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.end(JSON.stringify({error:'Erro interno.'}));
    }
  }
});
server.listen(port,'0.0.0.0');
