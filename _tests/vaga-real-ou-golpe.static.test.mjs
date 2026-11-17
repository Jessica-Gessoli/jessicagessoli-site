import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const ler = (f) => readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const html = ler("vaga-real-ou-golpe/index.html");
// As mensagens do /fale ficam no zethic-site e são testadas lá.

test("página do e-book é da marca Jéssica Gessoli, sem script inline", () => {
  assert.match(html, /class="logo marca-jg"/);
  assert.ok(!/<script>/.test(html), "script inline exige hash na CSP");
  assert.match(html, /<link rel="canonical" href="https:\/\/jessicagessoli\.zethic\.net\/vaga-real-ou-golpe\/">/);
});

// 16/11/2026 (Jéssica: "não quero nada na Zethic"): os botões vão direto ao WhatsApp, sem passar por zethic.net/fale.
const mensagens = [...html.matchAll(/href="https:\/\/wa\.me\/5519981800221\?text=([^"]+)"/g)].map((m) => decodeURIComponent(m[1]));
test("pedido do guia vai direto pelo WhatsApp, com a mensagem do guia", () => {
  assert.ok(mensagens.filter((t) => t === "Olá, Jéssica! Vim pelo site e quero o guia grátis Vaga real ou golpe.").length >= 2);
  assert.doesNotMatch(html, /zethic\.net\/fale/);
});

test("lead de RH tem mensagem própria e pedido para encaminhar ao RH", () => {
  assert.ok(mensagens.includes("Olá, Jéssica! Li o guia Vaga real ou golpe e quero proteger o recrutamento da minha empresa contra golpes."));
  assert.match(html, /Conhece alguém de RH\? Encaminhe esta página\./);
});

test("coautoria e perfis do Instagram aparecem", () => {
  assert.ok(html.includes("Bárbara Priori"));
  assert.ok(html.includes("https://www.instagram.com/barbara.priori.carreira/"));
  assert.ok(html.includes("https://www.instagram.com/jessicagessoli/"));
  assert.ok(html.includes("https://priorize-diagnostico.lovable.app/"));
  assert.ok(!html.includes("[perfil da Bá]"));
});

test("aviso de privacidade do número e link para a política", () => {
  assert.match(html, /O seu número fica só nessa conversa/);
  assert.match(html, /href="\/privacidade\/"/);
});

test("página no sitemap e nos materiais grátis", () => {
  assert.match(ler("sitemap.xml"), /<loc>https:\/\/jessicagessoli\.zethic\.net\/vaga-real-ou-golpe\/<\/loc>/);
  assert.match(ler("index.html"), /href="\/vaga-real-ou-golpe\/"/);
});

test("sem PME e com Há 18 anos", () => {
  assert.ok(!/\bPME\b|pequena e média empresa/i.test(html));
  assert.match(html, /Há 18 anos/);
});
test("PDF do guia publicado no site da marca, com links só para ela", () => {
  const pdf = readFileSync(new URL("../assets/docs/guia-vaga-real-ou-golpe.pdf", import.meta.url));
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.doesNotMatch(pdf.toString("latin1"), /\/URI\s*\(https:\/\/zethic\.net/);
});

// O endereço antigo zethic.net/vaga-real-ou-golpe e o PDF do direct ficam no zethic-site e são testados lá.

