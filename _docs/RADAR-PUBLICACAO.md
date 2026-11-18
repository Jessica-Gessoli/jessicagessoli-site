# Radar Digital: como publicar uma edição no site

Processo técnico para publicar uma edição do Radar Digital neste repositório. Uma edição por PR.

## Onde fica

- Índice: `radar/index.html` → https://jessicagessoli.zethic.net/radar/
- Cada edição: `radar/<endereco-da-edicao>/index.html` → https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/
- Estilo: `assets/css/jessicagessoli-radar.css` (usa também `jessicagessoli.css` e `jessicagessoli-loja.css`)
- Capa da edição: `assets/img/radar/edicao-NN.jpg` (1200 x 675)
- Teste: `_tests/radar.static.test.mjs`

Este repositório é a fonte do site. O Radar é publicado só aqui, não em zethic.net.

## Passo a passo

1. Atualize e crie a branch:

   ```
   git fetch origin
   git switch -c radar-edicao-NN origin/main
   ```

2. Crie `radar/<endereco-da-edicao>/index.html` copiando uma edição publicada (cabeçalho, política de segurança,
   scripts e rodapé iguais) e troque só o conteúdo. Endereço em português, minúsculas, sem acento, palavras
   separadas por hífen. Coloque a capa em `assets/img/radar/edicao-NN.jpg`.

3. Endereços sempre no subdomínio:
   - `<link rel="canonical">`, `og:url` e as `url` dos dados estruturados: `https://jessicagessoli.zethic.net/radar/...`
   - `og:image`: `https://jessicagessoli.zethic.net/assets/img/radar/edicao-NN.jpg`
   - Links internos começam na raiz: `/`, `/loja/`, `/termos/`, `/privacidade/`, `/desistencia/`, `/radar/`.
   - O único link permitido para zethic.net é `https://zethic.net/para-o-seu-negocio?utm_source=jessicagessoli`.

4. Limites do teste de SEO (`_tests/seo.static.test.mjs`): `<title>` com até 75 caracteres e
   `<meta name="description">` com 70 a 155 caracteres. Se o texto recebido passar disso, encurte só esses dois
   campos; o texto visível da edição não muda.

5. No índice `radar/index.html`, acrescente a edição no alto da lista `<ol class="radar-lista" reversed>` (mais nova
   primeiro) e um item em `"blogPost"` nos dados estruturados.

6. No `sitemap.xml`, acrescente a edição com `<lastmod>` da data de publicação e atualize o `<lastmod>` de `/radar/`:

   ```
   <url><loc>https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/</loc><lastmod>AAAA-MM-DD</lastmod></url>
   ```

7. Atualize a versão de CSS e JS e rode os testes. Tudo precisa passar:

   ```
   python3 -I _ferramentas/versao.py
   python3 -I _ferramentas/versao.py --check
   node --test _tests/*.mjs
   ```

8. Abra o PR, faça o merge e espere o GitHub Pages publicar (1 a 2 minutos):

   ```
   git add -A && git commit -m "Radar Digital: edição NN"
   git push -u origin radar-edicao-NN
   gh pr create --base main --title "Radar Digital: edição NN" --body "..."
   gh pr merge --merge
   ```

9. Confira no ar:

   ```
   curl -s -o /dev/null -w '%{http_code}\n' https://jessicagessoli.zethic.net/radar/
   curl -s -o /dev/null -w '%{http_code}\n' https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/
   curl -s https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/ | grep -o '<h1>[^<]*</h1>'
   ```

   As duas primeiras respondem 200, e a terceira mostra o título da edição.

O link "Radar Digital" do menu da página inicial (logo depois de "Publicações") já existe e não muda a cada edição.
