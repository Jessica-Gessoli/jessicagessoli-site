import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";

// 16/11/2026 (Jéssica): /conecte-se/ é o destino fixo do QR Code projetado no fim das palestras.
// O endereço nunca muda; só o conteúdo. Sem GA4 nem formulário: a plateia inclui estudantes menores de idade.
const fonte = readFileSync(new URL("../conecte-se/index.html", import.meta.url), "utf8");
const gerada = readFileSync(new URL("../conecte-se/index.html", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");

test("endereço permanente do QR Code", () => {
  assert.match(gerada, /<link rel="canonical" href="https:\/\/jessicagessoli\.zethic\.net\/conecte-se\/">/);
  assert.match(sitemap, /<loc>https:\/\/jessicagessoli\.zethic\.net\/conecte-se\/<\/loc>/);
});

test("três canais oficiais com os endereços validados", () => {
  assert.match(gerada, /href="https:\/\/www\.instagram\.com\/jessicagessoli\/"/);
  assert.match(gerada, /href="https:\/\/www\.linkedin\.com\/in\/jessicagessoli"/);
  assert.doesNotMatch(gerada, /linkedin\.com\/in\/jgessoli/);
  assert.match(gerada, /<a class="canal" href="\/">/);
});

test("links externos abrem com noopener noreferrer", () => {
  for (const m of gerada.matchAll(/<a [^>]*href="https?:\/\/[^"]+"[^>]*>/g)) {
    assert.match(m[0], /target="_blank" rel="noopener noreferrer"/, m[0]);
  }
});

test("sem medição, sem formulário e sem telefone", () => {
  for (const html of [fonte, gerada]) {
    assert.doesNotMatch(html, /googletagmanager|gtag|medicao\.js|connect\.facebook/);
    assert.doesNotMatch(html, /<form|<input|<textarea/);
    assert.doesNotMatch(html, /wa\.me|tel:|98180|98331/);
  }
  assert.match(gerada, /script-src 'none'/);
});

test("acessibilidade básica", () => {
  assert.match(gerada, /<html lang="pt-BR">/);
  assert.match(gerada, /class="pular" href="#canais"/);
  assert.equal((gerada.match(/<h1[ >]/g) || []).length, 1);
  for (const m of gerada.matchAll(/<img [^>]*>/g)) assert.match(m[0], /alt="/, m[0]);
});

// 16/11/2026 (Jéssica): conteúdo de carreira levado dos slides para a página (plano 7/90 dias, projetos, cursos, Jovem Aprendiz).
test("seção Seu próximo passo e cursos gratuitos", () => {
  assert.match(gerada, /<section class="mapa" aria-labelledby="t-mapa">/);
  assert.equal((gerada.match(/<details[ >]/g) || []).length, 5);
  for (const url of ["https://www.ev.org.br/", "https://loja.sebrae.com.br/aprender-a-empreender-1-372000001028",
    "https://pt.khanacademy.org/", "https://www.sp.senai.br/unidade/online",
    "https://www.gov.br/trabalho-e-emprego/pt-br/assuntos/aprendizagem-profissional"]) {
    assert.ok(gerada.includes(`href="${url}"`), url);
  }
  assert.doesNotMatch(gerada, /sebrae\.com\.br\/sites\/PortalSebrae/);
});

// 17/11/2026 (Jéssica): página de continuidade da palestra "Tecnologia também é lugar para você".
test("vídeos: dois formatos, com poster, sem download oferecido e sem autoplay", () => {
  const videos = [...gerada.matchAll(/<video [^>]*>/g)].map(m => m[0]);
  assert.equal(videos.length, 2);
  for (const v of videos) {
    assert.match(v, /controls/); assert.match(v, /preload="none"/); assert.match(v, /playsinline/);
    assert.match(v, /controlslist="nodownload"/); assert.match(v, /poster="\/assets\/img\/palestra\/poster-/);
    assert.doesNotMatch(v, /autoplay/);
  }
  assert.doesNotMatch(gerada, /href="[^"]*\.mp4"/, "nenhum link de download para o vídeo");
  assert.match(gerada, /media-src 'self'/);
  assert.match(gerada, /Versão vertical · Instagram/);
  assert.match(gerada, /Versão horizontal · tela cheia/);
});

test("downloads: material completo, slides em PDF e PPTX público e complemento", () => {
  for (const f of ["jessica-gessoli-palestra-material-completo.pdf", "jessica-gessoli-palestra-slides.pdf",
    "jessica-gessoli-palestra-slides.pptx", "jessica-gessoli-palestra-complemento.pdf"]) {
    assert.ok(gerada.includes(`href="/assets/docs/palestra/${f}"`), f);
  }
  // O PPTX de palco (notas e vídeos offline, ~160 MB) nunca vai para o site.
  const pptx = statSync(new URL("../assets/docs/palestra/jessica-gessoli-palestra-slides.pptx", import.meta.url));
  assert.ok(pptx.size < 20 * 1024 * 1024, "PPTX grande demais: parece a versão de palco");
  const zip = readFileSync(new URL("../assets/docs/palestra/jessica-gessoli-palestra-slides.pptx", import.meta.url)).toString("latin1");
  assert.doesNotMatch(zip, /ppt\/notesSlides\//, "PPTX público sem notas do apresentador");
  assert.doesNotMatch(zip, /ppt\/media\/[^\s"]+\.(mp4|mov|m4v)/, "PPTX público sem vídeos incorporados");
});

test("13 slides complementares em 5 grupos, com imagem leve e texto", () => {
  const slides = [...gerada.matchAll(/<figure class="slide" id="complemento-(\d+)">/g)].map(m => m[1]);
  assert.deepEqual(slides, ["15", "32", "19", "20", "21", "22", "24", "33", "34", "35", "37", "38", "39"]);
  assert.equal((gerada.match(/class="complementos__grupo"/g) || []).length, 5);
  for (const m of gerada.matchAll(/<img src="\/assets\/img\/palestra\/complemento-\d+\.webp"[^>]*>/g)) {
    assert.match(m[0], /loading="lazy"/); assert.match(m[0], /width="1201" height="675"/);
  }
});
