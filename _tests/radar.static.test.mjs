import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";

// Radar Digital no site (aprovado pela Jéssica em 08/11/2026; publicado em 18/11/2026): a newsletter do LinkedIn
// também é publicada em /radar/, uma edição por vez, na data de cada uma. Passo a passo: _docs/RADAR-PUBLICACAO.md.
const raiz = new URL("../", import.meta.url);
const ler = (c) => readFileSync(new URL(c, raiz), "utf8");
const H = "https://jessicagessoli.zethic.net";
const edicoes = readdirSync(new URL("radar/", raiz), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
const indice = ler("radar/index.html");
const sitemap = ler("sitemap.xml");

test("o índice lista todas as edições publicadas, e só elas", () => {
  const links = [...indice.matchAll(/href="\/radar\/([^"/]+)\/"/g)].map((m) => m[1]);
  assert.ok(edicoes.length >= 1);
  assert.deepEqual([...new Set(links)].sort(), [...edicoes].sort());
});

test("o índice e as edições estão no sitemap", () => {
  assert.ok(sitemap.includes(`<loc>${H}/radar/</loc>`));
  for (const e of edicoes) assert.ok(sitemap.includes(`<loc>${H}/radar/${e}/</loc>`), e);
});

test("o menu da página inicial leva ao Radar, logo depois de Publicações", () => {
  assert.match(ler("index.html"), /<a href="#publicacoes">Publicações<\/a>\n\s*<a href="\/radar\/">Radar Digital<\/a>/);
});

for (const e of [".", ...edicoes]) {
  const caminho = e === "." ? "radar/index.html" : `radar/${e}/index.html`;
  const html = ler(caminho);
  test(`${caminho}: endereço canônico e og:url no subdomínio, política de segurança e rodapé`, () => {
    const url = e === "." ? `${H}/radar/` : `${H}/radar/${e}/`;
    assert.ok(html.includes(`<link rel="canonical" href="${url}">`));
    assert.ok(html.includes(`<meta property="og:url" content="${url}">`));
    assert.doesNotMatch(html, /zethic\.net\/jessicagessoli|href="\/jessicagessoli/);
    assert.match(html, /http-equiv="Content-Security-Policy" content="default-src 'none';/);
    assert.match(html, /<footer class="ident">/);
    assert.match(html, /href="\/assets\/css\/jessicagessoli-radar\.css\?v=[0-9a-f]+"/);
    assert.ok(!/style="/.test(html), "estilo inline é bloqueado pela política de segurança");
  });
  test(`${caminho}: LinkedIn sempre com o Instagram ao lado`, () => {
    const li = (html.match(/href="https:\/\/www\.linkedin\.com\//g) ?? []).length;
    const ig = (html.match(/href="https:\/\/www\.instagram\.com\/jessicagessoli\/"/g) ?? []).length;
    assert.ok(ig >= 1 && ig >= Math.min(li, 1));
  });
  test(`${caminho}: regras de texto (sem "PME" e sem "Riscos e IA")`, () => {
    const texto = html.replace(/<[^>]+>/g, " ");
    assert.ok(!/\bPMEs?\b|pequena e média empresa/i.test(texto));
    assert.ok(!/Riscos e IA/.test(texto));
  });
  test(`${caminho}: imagens existem`, () => {
    for (const m of html.matchAll(/src="(\/assets\/img\/[^"]+)"/g)) assert.ok(existsSync(new URL(m[1].slice(1), raiz)), m[1]);
  });
}
