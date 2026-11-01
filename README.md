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
- [Manutenção](#manutenção)
- [Licença e contato](#licença-e-contato)

---

## O que é este projeto

O site é gerado com [Hugo](https://gohugo.io/) e o tema [Hextra](https://github.com/imfing/hextra), carregado como módulo Go. Os textos são escritos em Markdown dentro de `content/`. O GitHub Actions compila o site e publica o resultado no GitHub Pages quando há um push na branch `main`, ou quando o workflow é executado manualmente.

Seções presentes no repositório:

| Seção | Caminho | Função |
| --- | --- | --- |
| Início | `content/_index.md` | Apresentação do diário |
| Blog | `content/blog/` | Crônicas e artigos |
| Categorias | `content/categories/_index.md` | Página de categorias |
| Documentação | `content/docs/_index.md` | Índice da documentação, ainda em construção |
| Sobre | `content/about/_index.md` | Apresentação do autor e do projeto |

A página inicial também possui um template próprio em `layouts/home.html`, que apresenta os artigos do blog. O rodapé personalizado fica em `layouts/_partials/custom/footer.html`.

---

## Stack

| Peça | Versão / detalhe |
| --- | --- |
| Gerador | Hugo Extended |
| Hugo no CI | `0.165.0` |
| Tema | Hextra `v0.12.3`, via módulo Go |
| Go declarado no módulo | `1.27.0` |
| Idioma | `pt-br` |
| Deploy | GitHub Actions + GitHub Pages |
| Conteúdo | Markdown com front matter YAML |
| Busca | FlexSearch, configurada pelo Hextra |

O tema é declarado em `go.mod`; por isso, não é necessário cloná-lo manualmente para uma pasta `themes/`.

---

## Estrutura do repositório

Estrutura resumida dos arquivos versionados:

```text
jphs.github.io-web/
├── .github/
│   └── workflows/
│       └── hugo.yml              # build e deploy no GitHub Pages
├── archetypes/
│   └── default.md                # modelo para novos conteúdos
├── content/
│   ├── _index.md                 # página inicial
│   ├── about/
│   │   └── _index.md
│   ├── blog/
│   │   ├── _index.md
│   │   └── artigos em Markdown
│   ├── categories/
│   │   └── _index.md
│   └── docs/
│       └── _index.md             # índice; subseções ainda não criadas
├── i18n/
│   └── pt-br.yaml                # traduções da interface
├── layouts/
│   ├── home.html                 # template personalizado da página inicial
│   └── _partials/
│       └── custom/
│           └── footer.html       # rodapé personalizado
├── go.mod
├── go.sum
├── hugo.yaml                     # configuração do Hugo
└── README.md
```

Diretórios como `public/` são gerados durante a compilação e não devem ser editados manualmente. O tema Hextra é obtido pelo sistema de módulos do Hugo, não por uma pasta `themes/` versionada.

---

## Pré-requisitos

Instale:

- [Hugo Extended](https://gohugo.io/installation/) — a variante Extended é necessária para recursos do tema que dependem de Sass.
- [Go](https://go.dev/dl/) — necessário para trabalhar com os módulos do Hugo.
- Git.

No Omarchy / Arch Linux, os pacotes podem ser instalados com:

```bash
sudo pacman -S hugo go git
```

Confira a instalação:

```bash
hugo version
go version
git --version
```

O Hugo instalado deve indicar `extended`. O módulo Go declara a versão `1.27.0`; use uma versão compatível com essa declaração.

---

## Como rodar localmente

Clone o repositório e entre na pasta:

```bash
git clone https://github.com/jphs682/jphs.github.io-web.git
cd jphs.github.io-web
```

Baixe/atualize as dependências do tema e inicie o servidor:

```bash
hugo mod get
hugo server -D
```

O terminal informa o endereço local do servidor. Em geral, o Hugo utiliza [http://localhost:1313/](http://localhost:1313/).

Comandos úteis:

```bash
hugo server -D    # inclui conteúdos marcados como draft: true
hugo server       # serve o site sem incluir rascunhos
hugo --minify     # gera a versão otimizada em public/
```

---

## Como criar conteúdo

### Novo artigo no blog

Crie um arquivo em `content/blog/`:

```bash
hugo new content/blog/2026-10-31-titulo-do-artigo.md
```

O Hugo utiliza `archetypes/default.md` como modelo. O front matter inicial contém título, data, descrição, categorias, tags e `draft: true`.

Exemplo de front matter:

```yaml
---
title: "A história de um comando: o que acontece quando você digita ls?"
date: 2026-10-31
description: "Uma frase curta que apresenta o assunto do artigo."
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

Escreva o texto em Markdown abaixo do front matter. Quando o artigo estiver revisado e pronto para publicação, altere para `draft: false`.

### Convenções dos artigos

- **Nome do arquivo:** prefira `YYYY-MM-DD-titulo-curto.md`, sem acentos e com hífens.
- **Título:** use um título claro e coerente com o conteúdo.
- **Descrição:** escreva uma ou duas frases que resumam o artigo; a descrição também pode ser usada em listagens e metadados.
- **Categorias:** use assuntos abrangentes, mantendo nomes consistentes.
- **Tags:** use termos mais específicos relacionados ao texto.
- **Rascunhos:** mantenha `draft: true` enquanto o artigo não estiver pronto.

### Documentação

A seção `content/docs/` possui atualmente seu arquivo de índice (`_index.md`). As subseções citadas no índice, como Linux, programação e redes, ainda precisam ser criadas antes de receber novos documentos.

Quando uma subseção existir, uma página poderá ser criada, por exemplo:

```bash
hugo new content/docs/linux/permissoes.md
```

Exemplo de front matter para uma página de documentação:

```yaml
---
title: "Permissões"
weight: 1
---
```

O campo `weight` pode ser usado para controlar a ordenação quando a seção estiver configurada para isso.

### Página inicial e Sobre

As páginas de início e Sobre são arquivos `_index.md` em suas respectivas pastas. O conteúdo desses arquivos é escrito em Markdown.

A listagem de artigos da página inicial é controlada pelo template `layouts/home.html`; não é necessário adicionar manualmente cada novo artigo ao README ou a uma lista fixa na página inicial.

---

## Como publicar

1. Crie ou edite o conteúdo em `content/`.
2. Confira o resultado localmente com `hugo server -D`.
3. Revise o front matter e confirme que o conteúdo pronto para publicação está com `draft: false`.
4. Faça commit e push para a branch `main`.

Exemplo:

```bash
git add content/blog/
git commit -m "add: novo artigo sobre Linux"
git push origin main
```

O workflow em `.github/workflows/hugo.yml` executa a compilação com Hugo Extended e publica o diretório `public/` no GitHub Pages. Ele é acionado por push na branch `main` ou manualmente pela opção **Run workflow** na aba **Actions**.

Para que a publicação funcione, a origem do GitHub Pages deve estar configurada como **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Acompanhe o resultado da execução na aba **Actions** do repositório. Se o build falhar, consulte os logs do job antes de tentar publicar novamente.

---

## Configuração

A configuração principal fica em `hugo.yaml`.

| Chave | O que controla |
| --- | --- |
| `baseURL` | URL pública do GitHub Pages |
| `title` | Título do site |
| `defaultContentLanguage` | Idioma padrão |
| `languages.pt-br.menu.main` | Itens do menu principal |
| `params.author` | Nome e e-mail do autor |
| `params.theme` | Tema visual padrão e alternância claro/escuro |
| `params.search` | Busca FlexSearch |
| `params.editURL.enable` | Exibição do link para editar páginas |
| `module.imports` | Tema Hextra |

Outros arquivos importantes:

- `go.mod` e `go.sum`: dependências dos módulos Go.
- `i18n/pt-br.yaml`: textos traduzidos da interface.
- `archetypes/default.md`: modelo utilizado na criação de novos conteúdos.
- `.github/workflows/hugo.yml`: automação de build e deploy.
- `layouts/`: templates que personalizam partes do tema.

Para atualizar a dependência do Hextra, faça a alteração de forma controlada e confira o resultado localmente:

```bash
hugo mod get -u github.com/imfing/hextra
hugo mod tidy
hugo server
```

Revise as alterações em `go.mod` e `go.sum` antes de fazer commit.

---

## Manutenção

Antes de publicar mudanças na estrutura ou na configuração:

1. Execute `hugo server -D` e navegue pelas páginas afetadas.
2. Execute `hugo --minify` para verificar a compilação de produção.
3. Confira os links, imagens e arquivos estáticos alterados.
4. Verifique o resultado do workflow na aba **Actions** após o push.

Melhorias futuras podem incluir validação automática de links e metadados, expansão da documentação e aperfeiçoamento dos metadados para mecanismos de busca e compartilhamento social.

---

## Licença e contato

Este repositório não declara, neste momento, uma licença de uso específica. Para dúvidas, sugestões de pauta ou correções, abra uma issue no repositório ou escreva para `jphs@discente.ifpe.edu.br`.
