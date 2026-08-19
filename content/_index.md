---
title: "Meu Site"
description: "Linux, programação, código aberto e tecnologia."
---

# Olá, seja bem-vindo! 👋

Este é meu espaço para compartilhar **estudos, projetos e artigos sobre tecnologia**.

Aqui você encontrará conteúdos sobre Linux, programação, código aberto, administração de sistemas, segurança e outros assuntos que fazem parte da minha jornada de aprendizado.

<div class="mt-8 flex flex-wrap gap-4">

<a href="{{ "/blog/" | relURL }}"
class="rounded-lg border px-5 py-2.5 font-medium transition hover:opacity-70">
📚 Ver Blog
</a>

<a href="{{ "/docs/" | relURL }}"
class="rounded-lg border px-5 py-2.5 font-medium transition hover:opacity-70">
📖 Documentação
</a>

</div>

---

## 📝 Últimos artigos

<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

{{ range first 6 (where site.RegularPages "Section" "blog").ByDate.Reverse }}

<article class="group flex h-full flex-col rounded-2xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

  {{ with .Params.categories }}
  <div class="mb-4 flex flex-wrap gap-2">
    {{ range . }}
    <span class="rounded-full border px-2.5 py-1 text-xs opacity-70">
      {{ . }}
    </span>
    {{ end }}
  </div>
  {{ end }}

  <h3 class="mb-3 text-xl font-semibold">
    <a href="{{ .RelPermalink }}">
      {{ .Title }}
    </a>
  </h3>

  <p class="mb-6 flex-grow text-sm leading-relaxed opacity-70">
    {{ .Description | default (.Summary | plainify | truncate 140) }}
  </p>

  <div class="flex items-center justify-between border-t pt-4 text-sm">

    <time class="opacity-60">
      {{ .Date.Format "02/01/2006" }}
    </time>

    <a href="{{ .RelPermalink }}" class="font-medium">
      Ler artigo →
    </a>

  </div>

</article>

{{ end }}

</div>

<div class="mt-8 text-center">

<a href="{{ "/blog/" | relURL }}"
class="font-medium">
Ver todos os artigos →
</a>

</div>
