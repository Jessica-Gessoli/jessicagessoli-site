import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// 16/11/2026 (Jéssica, "vamos posicionar a página no Google", plano aprovado): regras básicas de SEO.
const raiz = new URL("../", import.meta.url);
const ler = (p) => readFileSync(new URL(p, raiz), "utf8");
const sitemap = ler("sitemap.xml");
const urls = [...sitemap.matchAll(/<loc>https:\/\/jessicagessoli\.zethic\.net\/([^<]*)<\/loc>/g)].map((m) => m[1]);
const arquivo = (u) => (u ? u : "") + "index.html";

test("robots libera o site e aponta o mapa do site", () => {
  const r = ler("robots.txt");
  assert.match(r, /Allow: \//);
  assert.match(r, /Sitemap: https:\/\/jessicagessoli\.zethic\.net\/sitemap\.xml/);
});

test("toda página do mapa tem data de atualização, canônico igual ao endereço e não está fora do Google", () => {
  assert.ok(urls.length >= 14);
  assert.equal((sitemap.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g) || []).length, urls.length);
  for (const u of urls) {
    const h = ler(arquivo(u));
    assert.ok(h.includes(`<link rel="canonical" href="https://jessicagessoli.zethic.net/${u}">`), u);
    assert.doesNotMatch(h, /name="robots" content="noindex/, u);
  }
});

test("título até 75 caracteres, descrição entre 70 e 155, um único h1 e dados estruturados válidos", () => {
  for (const u of urls) {
    const h = ler(arquivo(u));
    const t = h.match(/<title>([^<]*)<\/title>/)[1];
    const d = h.match(/name="description" content="([^"]*)"/)[1];
    assert.ok(t.length <= 75, `${u}: título com ${t.length}`);
    assert.ok(d.length >= 70 && d.length <= 155, `${u}: descrição com ${d.length}`);
    assert.equal((h.match(/<h1[ >]/g) || []).length, 1, u);
    const blocos = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    assert.ok(blocos.length > 0, `${u}: sem dados estruturados`);
    for (const b of blocos) JSON.parse(b[1]);
  }
});

test("página inicial fala com o público da marca e declara o site", () => {
  const h = ler("index.html");
  assert.match(h, /<title>Jéssica Gessoli \| Cibersegurança e IA para o Negócio<\/title>/);
  assert.match(h, /name="description" content="[^"]*escritórios de contabilidade, advocacia e RH e para escolas sem TI própria/);
  assert.match(h, /"@type": "WebSite"/);
});
