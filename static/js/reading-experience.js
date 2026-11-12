(() => {
  const progress = document.querySelector("[data-reading-progress]");
  const content = document.querySelector("[data-reading-content]");
  if (!progress || !content) return;

  const bar = progress.querySelector("[data-reading-progress-bar]");
  const topButton = document.querySelector("[data-back-to-top]");
  const status = document.querySelector("[data-reading-status]");
  let frameRequested = false;

  const updateProgress = () => {
    const articleTop = content.getBoundingClientRect().top + window.scrollY;
    const articleHeight = content.offsetHeight;
    const readableDistance = articleHeight - window.innerHeight;
    let percentage = 0;

    if (readableDistance <= 0) {
      percentage = window.scrollY >= articleTop ? 100 : 0;
    } else {
      percentage = Math.round(((window.scrollY - articleTop) / readableDistance) * 100);
    }

    percentage = Math.min(100, Math.max(0, percentage));
    if (bar) bar.style.transform = `scaleX(${percentage / 100})`;
    progress.setAttribute("aria-valuenow", String(percentage));
    progress.setAttribute("aria-valuetext", `${percentage}% lido`);

    if (topButton) {
      topButton.classList.toggle("is-visible", window.scrollY > 480);
      topButton.setAttribute("aria-hidden", window.scrollY > 480 ? "false" : "true");
      topButton.tabIndex = window.scrollY > 480 ? 0 : -1;
    }
    frameRequested = false;
  };

  const scheduleUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  updateProgress();

  // Preferências tipográficas locais, sem conta ou serviço externo.
  const fontControls = [...document.querySelectorAll("[data-font-size]")];
  const fontScales = { small: "0.94", normal: "1", large: "1.14" };
  const storageKey = "diario-computador-reading-font";
  const applyFontSize = (size) => {
    const scale = fontScales[size] || fontScales.normal;
    content.style.setProperty("--reading-font-scale", scale);
    fontControls.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.fontSize === size));
    });
    try { window.localStorage.setItem(storageKey, size); } catch (_) { /* armazenamento opcional */ }
  };

  let savedFontSize = "normal";
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (stored && Object.prototype.hasOwnProperty.call(fontScales, stored)) savedFontSize = stored;
  } catch (_) { /* armazenamento opcional */ }
  applyFontSize(savedFontSize);
  fontControls.forEach((button) => {
    button.addEventListener("click", () => applyFontSize(button.dataset.fontSize));
  });

  // Compartilhamento nativo, com cópia de link como alternativa.
  const shareButton = document.querySelector("[data-share-article]");
  const copyLink = async () => {
    const url = window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(url);
      return;
    }
    const field = document.createElement("textarea");
    field.value = url;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (!copied) throw new Error("Não foi possível copiar o link neste navegador.");
  };

  if (shareButton) {
    shareButton.addEventListener("click", async () => {
      const shareData = { title: document.title, url: window.location.href };
      try {
        if (navigator.share) {
          await navigator.share(shareData);
          if (status) status.textContent = "Compartilhamento aberto.";
        } else {
          await copyLink();
          if (status) status.textContent = "Link copiado.";
        }
      } catch (error) {
        if (error && error.name === "AbortError") return;
        try {
          await copyLink();
          if (status) status.textContent = "Link copiado.";
        } catch (_) {
          if (status) status.textContent = "Não foi possível compartilhar. Copie o endereço do navegador.";
        }
      }
    });
  }

  if (topButton) {
    topButton.addEventListener("click", () => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Destaca a seção atual no sumário nativo do Hextra/Hugo.
  const tocLinks = [...document.querySelectorAll(
    "#TableOfContents a, #table-of-contents a, .hextra-toc a, [data-toc] a"
  )];
  const headingById = tocLinks
    .map((link) => {
      try {
        const id = decodeURIComponent(new URL(link.href, window.location.href).hash.slice(1));
        const heading = id && document.getElementById(id);
        return heading ? { link, heading } : null;
      } catch (_) { return null; }
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && headingById.length) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (!visible.length) return;
      const current = headingById.find((item) => item.heading === visible[0].target);
      if (!current) return;
      headingById.forEach(({ link }) => {
        const active = link === current.link;
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -70% 0px", threshold: 0 });
    headingById.forEach(({ heading }) => observer.observe(heading));
  }

  // Torna os destinos do pager mais claros para tecnologias assistivas.
  document.querySelectorAll("#content nav a").forEach((link) => {
    if (!link.hasAttribute("aria-label")) {
      const text = (link.textContent || "").trim();
      if (text) link.setAttribute("aria-label", text);
    }
  });
})();
