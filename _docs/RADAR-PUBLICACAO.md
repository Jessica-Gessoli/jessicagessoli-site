# Radar Digital: como publicar uma edição no site

Processo usado na edição 01 (publicada em 18/11/2026). As edições 02 a 06 seguem o mesmo caminho, uma edição por PR,
na data de cada uma. Nunca suba uma edição antes da data dela.

## Onde fica

- Índice: `radar/index.html` → https://jessicagessoli.zethic.net/radar/
- Cada edição: `radar/<endereco-da-edicao>/index.html` → https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/
- Estilo: `assets/css/jessicagessoli-radar.css` (usa também `jessicagessoli.css` e `jessicagessoli-loja.css`)
- Capa da edição: `assets/img/radar/edicao-NN.jpg` (1200 x 675)
- Teste: `_tests/radar.static.test.mjs`

Desde 16/11/2026 este repositório é a fonte do site. O `zethic-site` e o gerador `_ferramentas/gerar_marcas.py` de lá
não montam mais nada da Jéssica Gessoli, e `zethic.net/jessicagessoli/*` dá 404 de propósito. Não publique o Radar
em zethic.net.

## Passo a passo

1. Atualize e crie a branch:

   ```
   git fetch origin
   git switch -c radar-edicao-NN origin/main
   ```

2. Se a edição veio num pacote antigo (`git format-patch` feito para o `zethic-site`), não aplique o pacote aqui com
   `git am`: os caminhos são outros. Copie só os arquivos da edição e faça as trocas do passo 4.

3. Crie `radar/<endereco-da-edicao>/index.html` copiando a edição anterior (cabeçalho, política de segurança, scripts
   e rodapé iguais) e troque só o conteúdo. Endereço em português, minúsculas, sem acento, palavras separadas por
   hífen. Coloque a capa em `assets/img/radar/edicao-NN.jpg`.

4. Endereços sempre no subdomínio, nunca em `zethic.net/jessicagessoli`:
   - `<link rel="canonical">`, `og:url` e as `url` dos dados estruturados: `https://jessicagessoli.zethic.net/radar/...`
   - `og:image`: `https://jessicagessoli.zethic.net/assets/img/radar/edicao-NN.jpg`
   - Links internos começam na raiz: `/`, `/loja/`, `/termos/`, `/privacidade/`, `/desistencia/`, `/radar/`
     (nunca `/jessicagessoli/...`).
   - O único link permitido para zethic.net é `https://zethic.net/para-o-seu-negocio?utm_source=jessicagessoli`.

5. Limites do teste de SEO (`_tests/seo.static.test.mjs`): `<title>` com até 75 caracteres e
   `<meta name="description">` com 70 a 155. Na edição 01, o pacote trazia título com 76 e descrição com 187
   caracteres. Ficou `O que nunca colar no ChatGPT do escritório | Jéssica Gessoli` e uma descrição mais curta, tirada
   do próprio texto. O texto visível da edição não muda.

6. No índice `radar/index.html`, acrescente a edição no alto da lista `<ol class="radar-lista" reversed>` (mais nova
   primeiro) e um item em `"blogPost"` nos dados estruturados.

7. No `sitemap.xml`, acrescente a edição com `<lastmod>` da data de publicação e atualize o `<lastmod>` de `/radar/`:

   ```
   <url><loc>https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/</loc><lastmod>AAAA-MM-DD</lastmod></url>
   ```

8. Atualize a versão de CSS e JS e rode os testes. Tudo precisa passar:

   ```
   python3 -I _ferramentas/versao.py
   python3 -I _ferramentas/versao.py --check
   node --test _tests/*.mjs
   ```

9. Abra o PR, faça o merge e espere o GitHub Pages publicar (1 a 2 minutos):

   ```
   git add -A && git commit -m "Radar Digital: edição NN"
   git push -u origin radar-edicao-NN
   gh pr create --base main --title "Radar Digital: edição NN" --body "..."
   gh pr merge --merge
   ```

10. Confira no ar:

    ```
    curl -s -o /dev/null -w '%{http_code}\n' https://jessicagessoli.zethic.net/radar/
    curl -s -o /dev/null -w '%{http_code}\n' https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/
    curl -s https://jessicagessoli.zethic.net/radar/<endereco-da-edicao>/ | grep -o '<h1>[^<]*</h1>'
    ```

    As duas primeiras respondem 200, e a terceira mostra o título da edição.

## O que não fazer

- Não publique edições futuras antes da data delas.
- Não mexa em Hootsuite, LinkedIn nem Instagram por este processo: aqui é só o site.
- O link "Radar Digital" do menu da página inicial (logo depois de "Publicações") já existe; não precisa mudar a
  cada edição.
