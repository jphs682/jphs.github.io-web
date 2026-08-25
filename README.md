# Diário de um Computador

Site pessoal de João Paulo: crônicas, estudos e descobertas sobre Linux, programação, código aberto e tecnologia.

- **Site:** https://jphs682.github.io/jphs.github.io-web/
- **Repositório:** https://github.com/jphs682/jphs.github.io-web
- **Autor:** João Paulo (`jphs@discente.ifpe.edu.br`)

O blog não é só uma coleção de tutoriais. Cada texto começa como uma pergunta, um erro ou uma curiosidade, e depois entra na parte técnica.

---

## Sumário

- [O que é este projeto](#o-que-é-este-projeto)
- [Stack](#stack)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Como criar conteúdo](#como-criar-conteúdo)
- [Como publicar](#como-publicar)
- [Configuração](#configuração)
- [Melhorias recomendadas](#melhorias-recomendadas)

---

## O que é este projeto

O site é gerado com [Hugo](https://gohugo.io/) e o tema [Hextra](https://github.com/imfing/hextra). O conteúdo vive em Markdown em `content/`. O GitHub Actions gera o HTML e publica no GitHub Pages a cada push na branch `main`.

Seções atuais:

| Seção | Caminho | Função |
| --- | --- | --- |
| Início | `content/_index.md` | Apresentação do diário |
| Blog | `content/blog/` | Crônicas e artigos longos |
| Categorias | `content/categories/` | Índice por assunto |
| Documentação | `content/docs/` | Caderno de referência (ainda em construção) |
| Sobre | `content/about/` | Quem escreve e por quê |

Há 9 artigos publicados, cobrindo permissões no Linux, compilação, GNU/Linux e código aberto, GPG, variáveis de ambiente, monitoramento, logs, mulheres no FOSS e análise combinatória.

---

## Stack

| Peça | Versão / detalhe |
| --- | --- |
| Gerador | Hugo Extended |
| Tema | Hextra `v0.12.3` (módulo Go) |
| Idioma | `pt-br` |
| Deploy | GitHub Actions → GitHub Pages |
| Conteúdo | Markdown + front matter YAML |

O tema entra pelo `go.mod`, não pela pasta `themes/`. Não é necessário clonar o Hextra à mão.

---

## Estrutura do repositório

```text
jphs.github.io-web/
├── archetypes/              # modelo usado por `hugo new`
│   └── default.md
├── assets/                  # CSS/JS próprios (vazio por enquanto)
├── content/                 # todo o conteúdo do site
│   ├── _index.md            # página inicial
│   ├── about/_index.md
│   ├── blog/
│   │   ├── _index.md
│   │   └── YYYY-MM-DD-titulo.md
│   ├── categories/_index.md
│   └── docs/
│       ├── _index.md
│       ├── linux/           # vazio — reservado
│       ├── programacao/     # vazio — reservado
│       └── redes/           # vazio — reservado
├── data/                    # dados extras do Hugo (vazio)
├── i18n/                    # traduções próprias (vazio)
├── layouts/                 # overrides do tema (vazio)
├── static/                  # favicon, imagens, arquivos estáticos
├── themes/                  # não usada (o tema vem do módulo)
├── .github/workflows/
│   └── hugo.yml             # deploy no GitHub Pages
├── go.mod / go.sum          # módulo Hugo + Hextra
├── hugo.yaml                # configuração do site
└── README.md
```

Pastas geradas na máquina e **não** versionadas:

- `public/` — HTML gerado pelo Hugo
- `.hugo_build.lock` — lock do servidor de desenvolvimento

---

## Pré-requisitos

Instale o **Hugo Extended**. No Omarchy / Arch:

```bash
sudo pacman -S hugo go git
```

Confira:

```bash
hugo version
# precisa aparecer "+extended"
```

Versões de referência neste repositório:

- Hugo: `v0.165.0+extended` (local e CI)
- Go: `1.27`

O tema é baixado automaticamente na primeira build, via `go.mod`.

---

## Como rodar localmente

No diretório do repositório:

```bash
git clone git@github.com:jphs682/jphs.github.io-web.git
cd jphs.github.io-web

hugo mod get
hugo server -D
```

O site abre em http://localhost:1313/jphs.github.io-web/.

Flags úteis:

```bash
hugo server -D          # inclui rascunhos (draft: true)
hugo server             # só páginas publicadas
hugo --minify           # build de produção em public/
```

`-D` é importante enquanto um artigo ainda está com `draft: true`.

---

## Como criar conteúdo

### Novo artigo no blog

```bash
hugo new content/blog/2026-08-25-o-que-acontece-quando-digito-ls.md
```

O arquivo nasce a partir de `archetypes/default.md`. Edite o front matter:

```yaml
---
title: "A história de um comando: o que acontece quando você digita ls?"
date: 2026-08-25
description: "Uma frase curta que aparece nas listagens e no Google."
categories:
  - linux
  - sistemas-operacionais
tags:
  - linux
  - shell
  - processos
draft: true
---
```

Escreva o texto em Markdown abaixo do `---`. Quando estiver pronto para publicar, mude `draft: false`.

### Convenções dos artigos

- **Nome do arquivo:** `YYYY-MM-DD-titulo-curto.md` (sem acento, se possível).
- **Título:** frase de crônica, não só o nome técnico.
- **Descrição:** 1 ou 2 frases; vira resumo na listagem e no SEO.
- **Categorias:** assuntos largos (`linux`, `programação`, `segurança`, `código-aberto`).
- **Tags:** termos específicos (`chmod`, `gpg`, `journald`).
- **Tom:** começa com uma cena ou pergunta, depois entra no comando e no conceito.

### Nova página de documentação

A seção `docs/` está reservada para anotações curtas, não para crônicas. Exemplo:

```bash
hugo new content/docs/linux/permissoes.md
```

```yaml
---
title: "Permissões"
weight: 1
---
```

`weight` controla a ordem na barra lateral do Hextra.

### Página inicial e Sobre

São arquivos `_index.md`. Qualquer Markdown extra nesses arquivos aparece na página correspondente.

---

## Como publicar

1. Escreva ou edite o Markdown em `content/`.
2. Confira localmente com `hugo server -D`.
3. Commit e push na `main`:

```bash
git add content/blog/2026-08-25-o-que-acontece-quando-digito-ls.md
git commit -m "add: crônica sobre o comando ls"
git push origin main
```

O workflow `.github/workflows/hugo.yml` faz o resto:

1. instala o Hugo Extended
2. executa `hugo --minify`
3. envia `public/` para o GitHub Pages

O site no ar atualiza em alguns minutos. Acompanhe em **Actions** no GitHub.

No repositório, a origem de publicação precisa estar em **Settings → Pages → Source = GitHub Actions**.

---

## Configuração

O arquivo principal é `hugo.yaml`.

| Chave | O que controla |
| --- | --- |
| `baseURL` | URL pública do GitHub Pages |
| `title` | Título na navbar |
| `languages.pt-br.menu.main` | Itens do menu |
| `params.author` | Nome e e-mail do autor |
| `params.theme.default` | Tema (`system`, com botão claro/escuro) |
| `params.search.enable` | Busca FlexSearch (ligada) |
| `params.editURL.enable` | Link “editar esta página” |
| `module.imports` | Tema Hextra |

O CSS/JS customizado, quando existir, vai em `assets/` ou `static/`. Overrides de template vão em `layouts/`.

Para atualizar o tema:

```bash
hugo mod get -u github.com/imfing/hextra
hugo mod tidy
```

---

## Próximos passos

O que ainda falta, agora que o deploy, a busca e o Sobre já foram ajustados:

- Escrever as primeiras fichas em `content/docs/linux`, `programacao` e `redes`.
- Listar os últimos artigos na home com os shortcodes do Hextra.
- Usar `slug:` no front matter se quiser URLs sem a data (`aliases` para não quebrar links antigos).
- Colocar favicon e logo em `static/`.
- Adicionar uma `LICENSE` (MIT para o código, CC BY-SA para os textos, se for o caso).
- Ligar `enableRobotsTXT: true` e, se quiser, Open Graph.

Pauta natural para o tom do diário:

1. O que acontece quando você digita `ls`
2. O que acontece quando o Linux liga
3. A vida de um processo
4. Por que `777` parece solução e é problema
5. O que acontece quando você digita `google.com`

---

## Licença e contato

O código do site ainda não declara uma licença. O tema Hextra é MIT.

Dúvidas, sugestões de pauta ou correções: abra uma issue no repositório ou escreva para `jphs@discente.ifpe.edu.br`.
