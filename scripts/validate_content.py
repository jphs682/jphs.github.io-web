#!/usr/bin/env python3
"""Validate blog front matter and internal links in the generated Hugo site."""

from __future__ import annotations

import re
import sys
from datetime import date, datetime
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT_DIR = ROOT / "content" / "blog"
PUBLIC_DIR = ROOT / "public"
BASE_URL = ( __import__("os").environ.get("SITE_BASE_URL") or "https://local.test/" ).rstrip("/") + "/"
BASE_PATH = urlparse(BASE_URL).path.rstrip("/")
ERRORS: list[str] = []


def fail(message: str) -> None:
    ERRORS.append(message)


def validate_front_matter() -> None:
    posts = sorted(p for p in CONTENT_DIR.rglob("*.md") if p.name != "_index.md")
    if not posts:
        fail("Nenhum artigo Markdown foi encontrado em content/blog/.")
        return

    required = ("title", "date", "description", "draft")
    for path in posts:
        relative = path.relative_to(ROOT)
        text = path.read_text(encoding="utf-8")
        match = re.match(r"^---\\s*\\n(.*?)\\n---(?:\\n|$)", text, re.DOTALL)
        if not match:
            fail(f"{relative}: front matter YAML ausente ou delimitadores inválidos.")
            continue

        try:
            data = yaml.safe_load(match.group(1))
        except yaml.YAMLError as exc:
            fail(f"{relative}: YAML inválido ({exc}).")
            continue

        if not isinstance(data, dict):
            fail(f"{relative}: front matter precisa ser um objeto YAML.")
            continue

        for key in required:
            if key not in data or data[key] is None or data[key] == "":
                fail(f"{relative}: campo obrigatório '{key}' ausente ou vazio.")

        if "title" in data and not isinstance(data["title"], str):
            fail(f"{relative}: 'title' precisa ser texto.")
        if "description" in data and not isinstance(data["description"], str):
            fail(f"{relative}: 'description' precisa ser texto.")
        elif isinstance(data.get("description"), str) and not data["description"].strip():
            fail(f"{relative}: 'description' não pode ficar vazia.")
        if "date" in data and not isinstance(data["date"], (date, datetime, str)):
            fail(f"{relative}: 'date' precisa ser uma data válida.")
        if "draft" in data and not isinstance(data["draft"], bool):
            fail(f"{relative}: 'draft' precisa ser true ou false.")
        for key in ("categories", "tags"):
            if key in data and data[key] is not None and not isinstance(data[key], list):
                fail(f"{relative}: '{key}' precisa ser uma lista YAML.")


class LinkCollector(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.targets: set[str] = set()
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        for key in ("id", "name"):
            value = values.get(key)
            if value:
                self.targets.add(value)
        for key in ("href", "src"):
            value = values.get(key)
            if value:
                self.links.append(value)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def output_target(url_path: str, current_page: Path) -> Path:
    decoded = unquote(url_path)
    if not decoded:
        return current_page

    if BASE_PATH and (decoded == BASE_PATH or decoded.startswith(BASE_PATH + "/")):
        decoded = decoded[len(BASE_PATH):] or "/"

    if decoded.startswith("/"):
        relative = decoded.lstrip("/")
    else:
        relative = decoded

    candidate = (PUBLIC_DIR / relative).resolve()
    public_root = PUBLIC_DIR.resolve()
    if candidate != public_root and public_root not in candidate.parents:
        raise ValueError("caminho sai da pasta public/")
    if candidate.is_dir() or decoded.endswith("/"):
        candidate = candidate / "index.html"
    elif not candidate.suffix:
        directory_index = candidate / "index.html"
        html_file = candidate.with_suffix(".html")
        if directory_index.exists():
            candidate = directory_index
        elif html_file.exists():
            candidate = html_file
    return candidate


def validate_generated_links() -> None:
    pages = sorted(PUBLIC_DIR.rglob("*.html")) if PUBLIC_DIR.exists() else []
    if not pages:
        fail("A pasta public/ não contém páginas HTML; execute o build do Hugo antes.")
        return

    parsed_pages: dict[Path, LinkCollector] = {}
    for page in pages:
        parser = LinkCollector()
        try:
            parser.feed(page.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError) as exc:
            fail(f"{page.relative_to(ROOT)}: não foi possível ler o HTML ({exc}).")
            continue
        parsed_pages[page.resolve()] = parser

    site_host = urlparse(BASE_URL).netloc
    for page, parser in parsed_pages.items():
        page_relative = page.relative_to(PUBLIC_DIR.resolve()).as_posix()
        current_url = urljoin("https://local.test/", page_relative)
        for raw_link in parser.links:
            link = raw_link.strip()
            if not link or link.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
                continue

            absolute = urljoin(current_url, link)
            parsed = urlparse(absolute)
            if parsed.scheme not in ("http", "https"):
                continue
            if parsed.netloc not in ("local.test", site_host):
                continue

            try:
                target = output_target(parsed.path, page)
            except ValueError as exc:
                fail(f"{page_relative}: link interno inseguro '{link}' ({exc}).")
                continue

            if not target.is_file():
                fail(f"{page_relative}: destino interno não encontrado: '{link}'.")
                continue

            if parsed.fragment and target.suffix.lower() == ".html":
                target_parser = parsed_pages.get(target.resolve())
                if target_parser is None:
                    target_parser = LinkCollector()
                    try:
                        target_parser.feed(target.read_text(encoding="utf-8"))
                    except OSError:
                        fail(f"{page_relative}: não foi possível verificar âncora de '{link}'.")
                        continue
                    parsed_pages[target.resolve()] = target_parser
                fragment = unquote(parsed.fragment)
                if fragment not in target_parser.targets:
                    fail(f"{page_relative}: âncora '#{fragment}' não encontrada em '{link}'.")


def main() -> int:
    validate_front_matter()
    validate_generated_links()

    if ERRORS:
        print(f"Validação encontrou {len(ERRORS)} problema(s):")
        for error in ERRORS:
            print(f"::error::{error}")
        return 1

    count = len([p for p in CONTENT_DIR.rglob("*.md") if p.name != "_index.md"])
    print(f"Validação concluída: {count} artigo(s) verificado(s) e links internos do HTML conferidos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
