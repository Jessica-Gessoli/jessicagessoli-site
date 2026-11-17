import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

// 16/11/2026 (Jéssica: "solucionar definitivamente"): a Jéssica Gessoli saiu do zethic-site. As regras da marca que lá
// ficavam em testes misturados com a Zethic estão aqui, lidas nas páginas publicadas.
const ler = (p) => readFileSync(new URL("../" + p, import.meta.url), "utf8");
const semObrigatorios = (html) => html
  .replace(/<!-- grupo:inicio -->[\s\S]*?<!-- grupo:fim -->/, "")
  .replace(/<!-- cabecalho:inicio -->[\s\S]*?<!-- cabecalho:fim -->/, "")
  .replace(/<footer[^>]*>[\s\S]*?<\/footer>/, "")
  .replace(/"legalName": "[^"]*"/g, "")
  .replace(/jessica\.gessoli@zethic\.net/g, "")
  .replace(/<p>A controladora dos dados é[\s\S]*?<\/p>/, "")
  // Ficha v1.5 (03/11/2026): a Zethic pode citar a Pode Curtir só como parceira de mídia em serviços de tecnologia.
  .replace(/<p class="parceria">[\s\S]*?<\/p>/g, "");
const MOEDAS = ["Continuidade operacional", "Conformidade regulatória", "Prevenção de fraude e de vazamento", "Reputação", "Habilitação de negócio", "Auditoria e contratos"];
const raiz = new URL("../", import.meta.url);
const paginas = [];
const varre = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name.startsWith("_")) continue;
    const p = new URL(e.name + (e.isDirectory() ? "/" : ""), dir);
    if (e.isDirectory()) varre(p); else if (/\.(html|txt|xml|js)$/.test(e.name)) paginas.push(p);
  }
};
varre(raiz);

// Regra de 13/10/2026 (antes em emails.static.test.mjs no zethic-site): jessica.gessoli@ só na marca pessoal.
test("marca pessoal mantém jessica.gessoli@ e não usa contato@", () => {
  for (const p of ["index.html", "en/index.html"]) {
    assert.match(ler(p), /jessica\.gessoli@zethic\.net/, p);
    assert.doesNotMatch(ler(p), /contato@zethic\.net/, p);
  }
});

// Regra de 11/10/2026 (antes em instagram-junto-linkedin.static.test.mjs): onde cita o LinkedIn pessoal, cita o Instagram.
const LINKEDIN = /href="https:\/\/www\.linkedin\.com\/in\/jessicagessoli\/?"/g;
const INSTAGRAM = /href="https:\/\/www\.instagram\.com\/jessicagessoli\/?"/g;
for (const arquivo of ["index.html", "en/index.html"]) {
  test(`${arquivo}: cada menção ao LinkedIn pessoal tem o Instagram ao lado`, () => {
    const texto = ler(arquivo);
    const linkedin = (texto.match(LINKEDIN) ?? []).length;
    const instagram = (texto.match(INSTAGRAM) ?? []).length;
    assert.ok(linkedin > 0, "o arquivo não cita o LinkedIn pessoal");
    assert.ok(instagram >= linkedin, `LinkedIn ${linkedin} vez(es), Instagram ${instagram} vez(es)`);
  });
  test(`${arquivo}: dados estruturados listam LinkedIn e Instagram`, () => {
    const sameAs = ler(arquivo).match(/"sameAs":\s*\[([^\]]*)\]/)?.[1] ?? "";
    assert.match(sameAs, /https:\/\/www\.linkedin\.com\/in\/jessicagessoli"/);
    assert.match(sameAs, /https:\/\/www\.instagram\.com\/jessicagessoli\/"/);
  });
  test(`${arquivo}: o topo da página leva ao LinkedIn e ao Instagram`, () => {
    const acoes = ler(arquivo).match(/<div class="hero">[\s\S]*?<\/figure>|<section class="vj"[\s\S]*?class="vj-slide vj-matrix"/)?.[0] ?? "";
    assert.match(acoes, /href="https:\/\/www\.linkedin\.com\/in\/jessicagessoli"/);
    assert.match(acoes, /href="https:\/\/www\.instagram\.com\/jessicagessoli\/"/);
  });
}

// 03/11/2026 (antes em fale.static.test.mjs): o 0769 é da Pode Curtir e não aparece no site da Jéssica Gessoli.
test("o 0769 não aparece no site", () => {
  for (const p of paginas) assert.doesNotMatch(readFileSync(p, "utf8"), /98331|0769|5519983310769/, p.pathname);
});

// O /fale da Zethic tem a mesma lista de moedas; o zethic-site confere a cópia de lá.
test("moedas da autoavaliação, na ordem combinada com o /fale", () => {
  const d = ler("diagnostico/index.html");
  assert.deepEqual([...d.matchAll(/\{ nome: "([^"]+)"/g)].map((m) => m[1]), MOEDAS);
});

// Antes em marcas-regras.static.test.mjs.
test("Página profissional: a seção se chama Serviços", () => {
  const h = ler("index.html");
  assert.match(h, /<a href="#trabalho">Serviços<\/a>/);
  assert.match(h, /<h2 id="t-trabalho">Serviços<\/h2>/);
  assert.doesNotMatch(h, /Como trabalhar comigo/);
});

// 28/10/2026 (decisão da Jéssica): o rodapé da página dela não traz o título de fundadora da Zethic.
test("rodapé sem o título de fundadora da Zethic", () => {
  assert.doesNotMatch(ler("index.html").match(/<footer>[\s\S]*<\/footer>/)[0], /diretora executiva|Zethic/);
});

// 21/10/2026 (antes em torres.static.test.mjs): a página da marca é própria.
test("página da marca é própria: sem barra do grupo e sem menu da Zethic", () => {
  const html = ler("index.html");
  assert.doesNotMatch(html, /<!-- grupo:inicio -->|class="grupo"|grupo\.css/);
  assert.doesNotMatch(html, /<!-- cabecalho:inicio -->/);
  assert.doesNotMatch(html, /100 km|geoRadius/);
});

test("autoavaliação: a frase de privacidade segue a política", () => {
  const d = ler("diagnostico/index.html");
  assert.doesNotMatch(d, /nada é enviado/);
  assert.match(d, /não são enviadas nem guardadas/);
});

// Antes em zethic-institucional.static.test.mjs.
test("perguntas frequentes no Diagnóstico, com dados estruturados", () => {
  const d = ler("diagnostico/index.html");
  assert.match(d, /<section id="perguntas">/);
  assert.match(d, /"@type": "FAQPage"/);
});

test("Jéssica Gessoli: Google Analytics próprio, com aceite, fora das páginas sem rastreador", () => {
  const com = ["index.html", "en/index.html", "diagnostico/index.html",
    "teste-golpe/index.html", "vaga-real-ou-golpe/index.html", "loja/index.html",
    "checkup/index.html", "entre-os-times/index.html", "privacidade/index.html"];
  for (const p of com) {
    const h = ler(p);
    assert.match(h, /<script src="\/assets\/js\/jessicagessoli-medicao\.js(?:\?v=[0-9a-f]+)?" defer><\/script>/, p);
    assert.doesNotMatch(h, /src="\/assets\/js\/medicao\.js(?:\?v=[0-9a-f]+)?"/, p);
    assert.match(h, /script-src 'self'[^;]*https:\/\/www\.googletagmanager\.com/, p);
    assert.match(h, /connect-src[^;]*https:\/\/\*\.google-analytics\.com/, p);
  }
  for (const p of ["teste-ia/index.html", "copia-e-cola/index.html",
    "conte-seu-golpe/index.html", "cancelamento/index.html"])
    assert.doesNotMatch(ler(p), /medicao\.js|googletagmanager/, p);
  const js = ler("assets/js/jessicagessoli-medicao.js");
  assert.match(js, /GA4_ID = "G-883BVBTM0E"/);
  assert.match(js, /if \(v === "aceito"\) carregar\(\); else if \(v !== "recusado"\) banner\(\);/);
  assert.match(js, /ad_storage: "denied"/);
  assert.match(ler("privacidade/index.html"), /<strong>Google Analytics, só se você aceitar:<\/strong>/);
});

test("Diagnóstico e Teste de golpe são páginas da Jéssica Gessoli", () => {
  for (const p of ["diagnostico/index.html", "teste-golpe/index.html"]) {
    const h = ler(p);
    assert.match(h, /<title>[^<]*\| Jéssica Gessoli<\/title>/, p);
    assert.match(h, /<meta property="og:site_name" content="Jéssica Gessoli">/, p);
    assert.doesNotMatch(h, /<!-- grupo:inicio -->|grupo\.css/, p);
    // 11/11/2026 (Jéssica, estratégia de collab): o Diagnóstico pode indicar a Zethic numa única linha de ponte,
    // sempre com o aviso de fundadora e a liberdade de contratar a execução com quem preferir.
    const ponte = /<p><strong>Quer que alguém execute as correções\?<\/strong>[\s\S]*?<\/p>/;
    if (p.includes("diagnostico")) {
      const m = h.match(ponte);
      assert.ok(m, p);
      assert.match(m[0], /Jéssica Gessoli é fundadora da Zethic/, p);
      assert.match(m[0], /contratar a execução com quem preferir/, p);
    }
    assert.doesNotMatch(semObrigatorios(h.replace(ponte, "")).replace(/zethicEvento/g, ""), /Zethic/, p);
    // 10/11/2026 (Jéssica): sem conversa grátis no caminho de compra; o próximo passo é a loja da Jéssica Gessoli.
    assert.doesNotMatch(h, /calendly\.com/, p);
    assert.match(h, /\/loja\/#item-/, p);
  }
});

test("páginas da Jéssica: tempo de área e Brasil como mercado", () => {
  for (const p of ["index.html", "en/index.html"]) {
    assert.doesNotMatch(ler(p), /Desde 2008|Since 2008/, p);
    assert.doesNotMatch(ler(p), /<figcaption>Campinas/, p);
  }
  assert.match(ler("index.html"), /Há 18 anos em bancos/);
  for (const p of ["index.html", "diagnostico/index.html", "teste-golpe/index.html", "copia-e-cola/index.html", "teste-ia/index.html", "conte-seu-golpe/index.html"]) {
    const rodape = ler(p).match(/<footer[^>]*>[\s\S]*?<\/footer>/)[0];
    assert.doesNotMatch(rodape, /Campinas/, p);
  }
  assert.doesNotMatch(ler("diagnostico/index.html"), /Atende fora de Campinas/);
});

// Antes em zethic-ofertas-conjuntas.static.test.mjs.
test("sites da Jéssica Gessoli e da Pode Curtir levam à Zethic, com a fundadora declarada do lado da Jéssica", () => {
  for (const p of ["checkup/index.html", "loja/obrigado/index.html"]) {
    const h = ler(p);
    assert.match(h, /https:\/\/zethic\.net\/para-o-seu-negocio\?utm_source=jessicagessoli/, p);
    assert.match(h, /Jéssica Gessoli é fundadora da Zethic, e você pode contratar a execução com quem preferir\./, p);
  }
});

// 16/11/2026 (Jéssica: "não quero nada na Zethic. Vamos desvincular tudo"): o site não depende de zethic.net.
// Fica só a ponte de recomendação (zethic.net/para-o-seu-negocio), que a Jéssica decidiu manter.
test("nenhum link para zethic.net além da ponte de recomendação", () => {
  for (const p of paginas) {
    for (const m of readFileSync(p, "utf8").matchAll(/https?:\/\/zethic\.net(\/[^"' )<]*)?/g)) {
      assert.match(m[0], /^https:\/\/zethic\.net\/para-o-seu-negocio\?utm_source=jessicagessoli/, p.pathname + ": " + m[0]);
    }
  }
});

test("PDFs da marca sem link para zethic.net", () => {
  for (const f of readdirSync(new URL("../assets/docs/", import.meta.url))) {
    const b = readFileSync(new URL("../assets/docs/" + f, import.meta.url)).toString("latin1");
    assert.doesNotMatch(b, /\/URI\s*\(https?:\/\/zethic\.net/, f);
  }
});
