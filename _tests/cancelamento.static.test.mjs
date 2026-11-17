import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// 04/11/2026, 22h51 e 22h57 (aprovado pela Jéssica): política de cancelamento e devolução publicada
// para a Jéssica Gessoli e para a Zethic, com as regras do documento "Desistência, cancelamento e devolução".
const ler = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const semTags = (h) => h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// 06/11/2026 (aprovado pela Jéssica): as regras saíram da página própria e ficaram na cláusula 8 dos termos.
// O endereço antigo continua existindo só para levar à cláusula, fora do Google.
test("Jéssica Gessoli: regras de cancelamento na cláusula 8 dos termos", () => {
  const t = semTags(ler("termos/index.html").split('<h2 id="desistencia">')[1].split('<h2 id="dados">')[0]);
  assert.match(t, /Estas regras valem para quem contratou a distância: pela loja, pelo WhatsApp ou por e-mail/);
  assert.match(t, /recebe de volta o valor integral, mesmo que uma sessão, a consulta ou a aula já tenha acontecido \(art\. 49 do Código de Defesa do Consumidor\)/);
  assert.match(t, /Depois de 7 dias, antes da primeira sessão ou da aula: o valor pago é devolvido com desconto de 25% do valor total do serviço/);
  assert.match(t, /Fica retido o maior valor entre 25% do valor total do programa e as sessões feitas/);
  assert.match(t, /o contrato prevê 7 dias depois da assinatura para desistir com devolução integral, enquanto o trabalho não começou/);
  assert.match(t, /Nos contratos mensais, o cancelamento é feito com aviso de 30 dias, e o mês já pago não é devolvido/);
  assert.match(t, /Como pedir\. Comprou pela loja\? Use a página Desistir de uma compra/);
  assert.match(t, /a resposta completa sai em até 5 dias/);
});

test("Jéssica Gessoli: o endereço antigo leva à cláusula 8 e sai do Google", () => {
  const h = ler("cancelamento/index.html");
  assert.match(h, /<meta http-equiv="refresh" content="0; url=\.\.\/termos\/#desistencia">/);
  assert.match(h, /<link rel="canonical" href="https:\/\/jessicagessoli\.zethic\.net\/termos\/">/);
  assert.match(h, /<meta name="robots" content="noindex, follow">/);
  assert.doesNotMatch(h, /<script/, "página sem script");
  assert.match(ler("index.html"), /<a href="\/termos\/#desistencia">Cancelamento e devolução<\/a>/);
  assert.doesNotMatch(ler("sitemap.xml"), /jessicagessoli\/cancelamento/);
});
