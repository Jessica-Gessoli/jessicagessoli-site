# Jéssica Gessoli

Site da Jéssica Gessoli, publicado em https://jessicagessoli.zethic.net pelo GitHub Pages.

Desde 16/11/2026 este repositório é a fonte da Jéssica Gessoli: tudo o que é da marca fica só aqui, independente da
Zethic. As páginas são editadas direto nos arquivos deste repositório, com um PR só por mudança. Antes elas eram
geradas no `Jessica-Gessoli/zethic-site` e copiadas para cá; isso acabou.

## Onde fica cada coisa

| O quê | Onde |
| --- | --- |
| Página inicial e versão em inglês | `index.html`, `en/index.html` |
| Loja, pedido recebido, termos, privacidade, desistência, cancelamento | `loja/`, `loja/obrigado/`, `termos/`, `privacidade/`, `desistencia/`, `cancelamento/` |
| Checkup, diagnóstico, testes e materiais grátis | `checkup/`, `diagnostico/`, `teste-golpe/`, `teste-ia/`, `copia-e-cola/`, `checklist-antigolpe/`, `vaga-real-ou-golpe/`, `conte-seu-golpe/`, `entre-os-times/` |
| Página das palestras (destino fixo do QR Code) | `conecte-se/` |
| Estilo e scripts | `assets/css/`, `assets/js/` |
| Fotos, PDFs e fontes | `assets/img/`, `assets/docs/`, `assets/fonts/` |
| Testes | `_tests/` |

## Antes de abrir um PR

1. Mudou algum arquivo de `assets/css` ou `assets/js`? Rode `python3 _ferramentas/versao.py` para atualizar o
   `?v=` nas páginas (o navegador baixa o arquivo novo).
2. Rode os testes: `node --test _tests/*.mjs`

## Página das palestras

O QR Code projetado no fim das palestras aponta sempre para https://jessicagessoli.zethic.net/conecte-se/.
Troque o conteúdo em `conecte-se/index.html`; nunca troque o endereço.

## Currículo, resume e kit de palestrante

As fontes ficam em `_docs/` (`curriculo.html`, `resume.html`, `kit-palestrante.html`). Para gerar os PDFs de
`assets/docs/`, abra a página no Chrome e imprima em A4, sem margens e com gráficos de fundo (ou use o Playwright
com `prefer_css_page_size` e `print_background`).

## Independente da Zethic

Desde 16/11/2026 (Jéssica: "não quero nada na Zethic"), o site não depende de zethic.net: os botões vão direto ao
WhatsApp (`wa.me/5519981800221`), a política de privacidade é a própria (`/privacidade/`) e os PDFs ficam em
`assets/docs/`. O único link para zethic.net é a recomendação da Zethic (`zethic.net/para-o-seu-negocio`), sempre
com "Jéssica Gessoli é fundadora da Zethic". Um teste em `_tests/regras-da-marca.static.test.mjs` impede que outro
link volte.

Os pedidos e o checkout da loja usam os endereços `FORM_ENDPOINT` e `CHECKOUT_ENDPOINT` de
`assets/js/jessicagessoli-config.js` (hoje vazios: o pedido segue pelo WhatsApp ou pelo e-mail).
