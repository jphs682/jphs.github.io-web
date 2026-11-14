# Diário de um Computador

Site pessoal de João Paulo: crônicas, estudos e descobertas sobre Linux, programação, sistemas, código aberto e tecnologia.

- **Site:** https://jphs682.github.io/jphs.github.io-web/
- **Repositório:** https://github.com/jphs682/jphs.github.io-web
- **Autor:** João Paulo

O blog não é apenas uma coleção de tutoriais. Cada texto parte de uma pergunta, experiência, erro ou curiosidade e desenvolve o assunto com contexto e explicações técnicas.

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Estrutura](#estrutura)
- [Executar localmente](#executar-localmente)
- [Criar conteúdo](#criar-conteúdo)
- [Categorias e tags](#categorias-e-tags)
- [Publicação](#publicação)
- [Manutenção](#manutenção)
- [Licenciamento](#licenciamento)
- [Contato](#contato)

## Sobre o projeto

O site é gerado com [Hugo Extended](https://gohugo.io/) e o tema [Hextra](https://github.com/imfing/hextra), carregado como módulo Go. Os textos ficam em Markdown dentro de `content/`. O GitHub Actions compila o site e publica o resultado no GitHub Pages após alterações na branch `main`, ou por execução manual do workflow.

A página inicial possui um template próprio em `layouts/home.html`. A área de categorias dessa página é gerada diretamente da taxonomia `categories` do Hugo: ao atribuir uma categoria a um artigo publicado, ela passa a aparecer automaticamente, com o número de publicações. Não é necessário editar o template para cadastrar novas categorias.

## Tecnologias

| Componente | Uso |
| --- | --- |
| Hugo Extended | Geração do site estático |
| Hextra | Tema e componentes de interface |
| Go Modules | Gerenciamento do tema |
| Markdown + YAML | Conteúdo e metadados |
| FlexSearch | Busca do site |
| GitHub Actions | Compilação e deploy |
| GitHub Pages | Hospedagem |

A versão do Hugo usada no CI está definida em `.github/workflows/hugo.yml`. O tema é declarado em `go.mod`; não é necessário cloná-lo manualmente para uma pasta `themes/`.

## Estrutura

```text
.
├── .github/workflows/hugo.yml  # build e deploy
├── archetypes/default.md       # modelo para novos conteúdos
├── assets/css/custom.css       # estilos personalizados
├── content/
│   ├── _index.md               # página inicial
│   ├── about/                  # sobre o autor e o projeto
│   ├── blog/                   # artigos e crônicas
│   ├── categories/             # índice das categorias
│   ├── docs/                   # documentação técnica
│   └── licenca/                # política de uso do conteúdo
├── layouts/
│   └── home.html               # página inicial personalizada
├── scripts/                    # validações de conteúdo
├── static/js/                  # recursos JavaScript
├── hugo.yaml                   # configuração do Hugo
├── go.mod
├── go.sum
├── LICENSE                     # aviso de licença do conteúdo editorial
└── CONTENT-LICENSE.md          # explicação da licença do conteúdo
```

Arquivos como `public/` são gerados pelo Hugo. Não edite o conteúdo publicado diretamente nesse diretório.

## Executar localmente

### Pré-requisitos

- [Hugo Extended](https://gohugo.io/installation/), na versão compatível com a definida no workflow;
- [Go](https://go.dev/dl/), para os módulos do Hugo;
- Git.

No Arch Linux, por exemplo:

```bash
sudo pacman -S hugo go git
```

Confira se o Hugo instalado é a variante Extended:

```bash
hugo version
go version
git --version
```

### Instalação e servidor local

```bash
git clone https://github.com/jphs682/jphs.github.io-web.git
cd jphs.github.io-web
hugo mod get
hugo server -D
```

Abra o endereço informado pelo Hugo, normalmente [http://localhost:1313](http://localhost:1313).

Comandos úteis:

```bash
hugo server -D    # inclui rascunhos
hugo server       # exclui rascunhos
hugo --minify     # gera a versão otimizada em public/
```

## Criar conteúdo

### Novo artigo

Crie um arquivo dentro de `content/blog/`:

```bash
hugo new content/blog/titulo-do-artigo.md
```

O archetype em `archetypes/default.md` fornece o front matter inicial. Um exemplo:

```yaml
---
title: "O que acontece quando você executa um comando no Linux?"
date: 2026-11-14
description: "Uma explicação curta sobre o assunto do artigo."
categories:
  - linux
  - sistemas-operacionais
tags:
  - terminal
  - shell
draft: true
---
```

Escreva o artigo abaixo do front matter. Mantenha `draft: true` enquanto estiver em elaboração e altere para `false` quando estiver pronto para publicação.

### Boas práticas

- Prefira nomes de arquivo curtos, sem acentos e com hífens.
- Escreva uma descrição objetiva para cada publicação.
- Use categorias abrangentes e consistentes.
- Use tags para termos mais específicos.
- Em tutoriais técnicos, informe versões, ambiente e comandos relevantes sempre que isso afetar o resultado.
- Dê crédito e verifique as condições de uso de imagens, trechos de código e materiais de terceiros.

## Categorias e tags

Categorias e tags são taxonomias do Hugo, configuradas em `hugo.yaml`.

- **Categorias** agrupam assuntos amplos, como Linux, programação ou sistemas operacionais.
- **Tags** identificam tecnologias, ferramentas e conceitos mais específicos.

Para adicionar uma categoria, basta incluí-la no front matter de um artigo:

```yaml
categories:
  - redes
```

A página inicial percorre automaticamente as categorias existentes e mostra somente aquelas que possuem publicações. O nome exibido é obtido da página do termo gerada pelo Hugo. Portanto, mantenha a grafia consistente entre os artigos para evitar categorias duplicadas com significados iguais.

## Publicação

1. Execute `hugo server -D` e confira as páginas localmente.
2. Gere a versão de produção com `hugo --minify`.
3. Revise metadados, links, imagens e status de rascunho.
4. Faça commit e push para `main`.

```bash
git add content/
git commit -m "content: adicionar novo artigo"
git push origin main
```

O workflow em `.github/workflows/hugo.yml` compila o site e publica o diretório gerado no GitHub Pages. A origem do Pages deve estar configurada como **GitHub Actions** em **Settings → Pages**. Acompanhe o resultado na aba **Actions**.

## Manutenção

Antes de publicar alterações estruturais:

1. Execute `hugo server -D` e navegue pelas páginas afetadas.
2. Execute `hugo --minify` para validar a compilação de produção.
3. Confira links, imagens, metadados e arquivos estáticos.
4. Verifique o workflow de deploy após o push.

O repositório também contém o validador `scripts/validate_content.py`, usado para verificar aspectos do conteúdo durante o processo de publicação. Consulte o próprio script e o workflow para os comandos exatos.

## Licenciamento

**A licença Creative Commons BY 4.0 deste projeto cobre o conteúdo editorial original — textos e imagens produzidos para o Diário de um Computador — e não o código-fonte do site.**

Você pode compartilhar e adaptar esse conteúdo, inclusive para fins comerciais, desde que atribua o crédito apropriado, indique a licença e informe se fez alterações. Salvo indicação diferente na própria publicação, a licença aplicável é [Creative Commons Atribuição 4.0 Internacional (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

- `CONTENT-LICENSE.md` detalha os termos aplicáveis ao conteúdo.
- `LICENSE` contém o aviso resumido de licenciamento editorial.
- A página [/licenca/](https://jphs682.github.io/jphs.github.io-web/licenca/) explica as condições de reutilização.

**O código-fonte do site não possui uma licença de reutilização declarada neste momento.** A presença do arquivo chamado `LICENSE` não deve ser interpretada como concessão de licença sobre o código: seu texto limita expressamente a CC BY 4.0 ao conteúdo editorial. O tema Hextra, módulos, bibliotecas, fontes e materiais de terceiros permanecem sujeitos às respectivas licenças.

Se futuramente quiser permitir que outras pessoas reutilizem ou contribuam com o código, escolha uma licença de software específica (por exemplo, MIT ou Apache-2.0) e aplique-a explicitamente ao código do projeto. Não é necessário fazer essa escolha para manter o site publicado.

## Contato

Para sugestões, correções ou ideias de pauta, abra uma issue no [repositório](https://github.com/jphs682/jphs.github.io-web).
