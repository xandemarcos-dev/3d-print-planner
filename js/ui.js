/* ui.js — helpers de formatação e componentes HTML reutilizáveis */
(function () {
  const Planner = (window.Planner = window.Planner || {});

  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  const brlc = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

  function money(n) { return brl.format(isFinite(n) ? n : 0); }
  function moneyCents(n) { return brlc.format(isFinite(n) ? n : 0); }
  function num(n) { return new Intl.NumberFormat("pt-BR").format(isFinite(n) ? Math.round(n) : 0); }

  function meses(n) {
    if (!isFinite(n)) return "—";
    if (n < 1) return "< 1 mês";
    return `${Math.ceil(n)} ${Math.ceil(n) === 1 ? "mês" : "meses"}`;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // Nível textual a partir de escala 1–5
  function nivelLabel(n) {
    if (n >= 4.5) return "Muito Alto";
    if (n >= 3.5) return "Alto";
    if (n >= 2.5) return "Médio";
    if (n >= 1.5) return "Baixo";
    return "Muito Baixo";
  }
  function nivelClass(n) {
    if (n >= 3.5) return "lvl-high";
    if (n >= 2.5) return "lvl-mid";
    return "lvl-low";
  }

  // Barra de progresso para uma métrica 1–5 (ou valor/total)
  function bar(label, value, max = 5, opts = {}) {
    const pct = Math.round((value / max) * 100);
    const cls = opts.invert
      ? (value >= 3.5 ? "lvl-low" : value >= 2.5 ? "lvl-mid" : "lvl-high")
      : nivelClass(value);
    return `
      <div class="metric">
        <div class="metric-head">
          <span>${escapeHtml(label)}</span>
          <span class="metric-val">${opts.valueLabel || nivelLabel(value)}</span>
        </div>
        <div class="bar"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>
      </div>`;
  }

  function badge(text, level) {
    return `<span class="badge ${nivelClass(level)}">${escapeHtml(text)}</span>`;
  }

  // Anel de score SVG (0–100)
  function scoreRing(score, size = 160) {
    const r = size / 2 - 14;
    const c = 2 * Math.PI * r;
    const off = c * (1 - score / 100);
    const cx = size / 2;
    return `
      <svg class="score-ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#a855f7"/>
            <stop offset="100%" stop-color="#22d3ee"/>
          </linearGradient>
        </defs>
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="12"/>
        <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="url(#ringGrad)" stroke-width="12"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}"
          transform="rotate(-90 ${cx} ${cx})"/>
        <text x="50%" y="48%" text-anchor="middle" class="ring-num">${score}</text>
        <text x="50%" y="64%" text-anchor="middle" class="ring-lbl">/ 100</text>
      </svg>`;
  }

  function kpi(label, value, sub) {
    return `
      <div class="kpi">
        <div class="kpi-label">${escapeHtml(label)}</div>
        <div class="kpi-value">${value}</div>
        ${sub ? `<div class="kpi-sub">${sub}</div>` : ""}
      </div>`;
  }

  function sectionTitle(title, desc) {
    return `<header class="page-head">
      <h1>${escapeHtml(title)}</h1>
      ${desc ? `<p>${escapeHtml(desc)}</p>` : ""}
    </header>`;
  }

  Planner.ui = { money, moneyCents, num, meses, escapeHtml, nivelLabel, nivelClass, bar, badge, scoreRing, kpi, sectionTitle };
})();
