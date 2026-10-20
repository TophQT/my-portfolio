/* =============================================================
   Christopher Cariaga — portfolio
   Vanilla JavaScript: theme, navigation, reveal, fallbacks, form
   ============================================================= */
(() => {
  "use strict";

  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  doc.classList.add("js");

  /* -------------------------------------------------------------
     Theme
     The inline script in <head> already set data-theme before paint,
     so here we only re-apply the related attributes and handle clicks.
     ------------------------------------------------------------- */
  const THEME_COLOR = { dark: "#08090C", light: "#F7F7F4" };
  const themeBtn = $("#themeBtn");

  function applyTheme(theme) {
    doc.dataset.theme = theme;
    if (themeBtn) {
      themeBtn.setAttribute("aria-pressed", String(theme === "dark"));
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.dark);
  }

  applyTheme(doc.dataset.theme === "light" ? "light" : "dark");

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = doc.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* -------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------- */
  const burger = $("#burger");
  const menu = $("#menu");
  const desktop = window.matchMedia("(min-width: 901px)");

  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (burger && menu) {
    burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        burger.focus();
      }
    });
    const onBreakpoint = (e) => { if (e.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else desktop.addListener(onBreakpoint);
  }

  /* -------------------------------------------------------------
     Header elevation on scroll
     ------------------------------------------------------------- */
  const header = $(".header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* -------------------------------------------------------------
     Active navigation link
     ------------------------------------------------------------- */
  const navLinks = $$("#menu a");
  const navSections = navLinks
    .map((a) => {
      const href = a.getAttribute("href") || "";
      return href.startsWith("#") ? document.getElementById(href.slice(1)) : null;
    })
    .filter(Boolean);

  function markActive(id) {
    navLinks.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }

  let activeQueued = false;
  function updateActiveLink() {
    activeQueued = false;
    if (!navSections.length) return;

    const probe = window.scrollY + window.innerHeight * 0.32;
    let current = navSections[0].id;

    navSections.forEach((el) => {
      if (el.getBoundingClientRect().top + window.scrollY <= probe) current = el.id;
    });

    const atBottom = window.innerHeight + window.scrollY >= doc.scrollHeight - 4;
    if (atBottom) current = navSections[navSections.length - 1].id;

    markActive(current);
  }

  if (navSections.length) {
    window.addEventListener("scroll", () => {
      if (activeQueued) return;
      activeQueued = true;
      requestAnimationFrame(updateActiveLink);
    }, { passive: true });
    window.addEventListener("resize", updateActiveLink);
    updateActiveLink();
  }

  /* -------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------- */
  $$(".skills-grid, .project-grid").forEach((grid) => {
    $$(".reveal", grid).forEach((el, i) => {
      el.style.setProperty("--reveal-delay", Math.min(i, 5) * 70 + "ms");
    });
  });

  const revealItems = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -60px 0px" });
    revealItems.forEach((el) => io.observe(el));
  }

  /* -------------------------------------------------------------
     Pointer-follow glow on skill cards
     ------------------------------------------------------------- */
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    $$(".skill-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* -------------------------------------------------------------
     Image fallbacks — a broken or missing screenshot degrades to a
     labelled placeholder instead of a browser error icon.
     ------------------------------------------------------------- */
  $$("img[data-fallback]").forEach((img) => {
    const holder = img.closest(".project-media, .portrait");
    if (!holder) return;

    const showFallback = () => {
      holder.classList.add("is-fallback");
      holder.setAttribute("data-fallback", img.getAttribute("data-fallback") || "");
    };

    if (img.complete && img.naturalWidth === 0) showFallback();
    else img.addEventListener("error", showFallback);
  });

  /* -------------------------------------------------------------
     Project links — only show "View Project" / "Source Code" when a
     real URL exists; otherwise keep the "request a walkthrough" fallback.
     ------------------------------------------------------------- */
  $$("[data-project]").forEach((project) => {
    let hasExternalLink = false;

    [["data-project-live", "View Project"], ["data-project-repo", "Source Code"]].forEach(([attr, label]) => {
      const link = project.querySelector("[" + attr + "]");
      if (!link) return;

      const href = (link.getAttribute("href") || "").trim();
      if (!href || href === "#") {
        link.hidden = true;
        return;
      }

      link.hidden = false;
      hasExternalLink = true;
      if (!link.textContent.trim()) link.textContent = label;
      if (!link.hasAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    });

    const ask = project.querySelector("[data-project-ask]");
    if (ask) ask.hidden = hasExternalLink;
  });

  /* -------------------------------------------------------------
     Footer year
     ------------------------------------------------------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
