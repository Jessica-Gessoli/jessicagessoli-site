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

## O que continua no zethic-site

- `zethic.net/jessicagessoli` e `zethic.net/en/jessicagessoli`, que só levam para este site (endereços antigos).
- A página `zethic.net/fale`, que monta as mensagens de WhatsApp (`?utm_source=jessicagessoli-...`).
- A política de privacidade `zethic.net/privacidade`, que cobre o Conte o seu golpe e as conversas pelo WhatsApp.
- A página `zethic.net/para-o-seu-negocio`, para onde este site leva quando recomenda a Zethic.
- A planilha de pedidos (Apps Script), que atende as três marcas.
