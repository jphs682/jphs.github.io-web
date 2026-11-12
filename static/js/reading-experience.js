(() => {
  const progress = document.querySelector("[data-reading-progress]");
  const content = document.querySelector("[data-reading-content]");

  if (!progress || !content) return;

  const bar = progress.querySelector("[data-reading-progress-bar]");
  let frameRequested = false;

  const updateProgress = () => {
    const articleTop = content.getBoundingClientRect().top + window.scrollY;
    const articleHeight = content.offsetHeight;
    const readableDistance = articleHeight - window.innerHeight;

    let percentage = 0;

    if (readableDistance <= 0) {
      percentage = window.scrollY >= articleTop ? 100 : 0;
    } else {
      percentage = Math.round(
        ((window.scrollY - articleTop) / readableDistance) * 100
      );
    }

    percentage = Math.min(100, Math.max(0, percentage));

    if (bar) {
      bar.style.transform = `scaleX(${percentage / 100})`;
    }

    progress.setAttribute("aria-valuenow", String(percentage));
    progress.setAttribute("aria-valuetext", `${percentage}% lido`);
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
})();
