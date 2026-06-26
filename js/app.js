/* app.js — roteador hash + bootstrap */
(function () {
  const Planner = (window.Planner = window.Planner || {});

  const ROUTES = [
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { id: "investimento", icon: "💰", label: "Investimento" },
    { id: "impressoras", icon: "🖨️", label: "Impressoras" },
    { id: "precificacao", icon: "💲", label: "Precificação" },
    { id: "catalogo", icon: "📦", label: "Catálogo" },
    { id: "nichos", icon: "🎯", label: "Nichos" },
    { id: "estrategias", icon: "♟️", label: "Estratégias" },
    { id: "softwares", icon: "🧰", label: "Softwares" },
    { id: "marketing", icon: "📣", label: "Marketing" },
    { id: "canvas", icon: "🧩", label: "Lean Canvas" },
    { id: "roadmap", icon: "🛣️", label: "Roadmap" },
    { id: "matriz", icon: "📈", label: "Matriz de Decisão" },
    { id: "printfarm", icon: "🏭", label: "Print Farm" },
    { id: "consultora", icon: "🤖", label: "IA Consultora" },
    { id: "relatorio", icon: "📄", label: "Relatório Final" },
  ];

  const content = () => document.getElementById("content");
  function currentRoute() {
    const id = (location.hash || "#dashboard").slice(1);
    return ROUTES.find((r) => r.id === id) ? id : "dashboard";
  }

  function renderNav() {
    const active = currentRoute();
    const nav = document.getElementById("nav");
    nav.innerHTML = ROUTES.map((r) =>
      `<a href="#${r.id}" class="nav-link ${r.id === active ? "active" : ""}">
        <span class="nav-icon">${r.icon}</span><span class="nav-label">${r.label}</span>
      </a>`).join("");
  }

  function renderView() {
    const id = currentRoute();
    const mod = Planner.modules[id];
    if (!mod) return;

    // preserva foco/caret de inputs durante re-render reativo
    const ae = document.activeElement;
    const focusKey = ae && ae.dataset ? ae.dataset.key : null;
    const caret = ae && typeof ae.selectionStart === "number" ? ae.selectionStart : null;

    mod.render(content());

    if (focusKey) {
      const next = content().querySelector(`input[data-key="${focusKey}"]`);
      if (next) {
        next.focus();
        if (caret !== null) { try { next.setSelectionRange(caret, caret); } catch (e) {} }
      }
    }
    renderNav();
  }

  function navigate() {
    document.getElementById("sidebar").classList.remove("open");
    renderView();
    content().scrollTop = 0;
    window.scrollTo(0, 0);
  }

  function init() {
    renderNav();
    renderView();

    window.addEventListener("hashchange", navigate);

    // re-render reativo quando o estado muda
    Planner.store.subscribe(() => renderView());

    // menu mobile
    document.getElementById("menuBtn").addEventListener("click", () =>
      document.getElementById("sidebar").classList.toggle("open"));

    // resetar plano
    document.getElementById("resetBtn").addEventListener("click", () => {
      if (confirm("Resetar todo o plano? Esta ação não pode ser desfeita.")) Planner.store.reset();
    });

    // redesenhar matriz no resize
    let rt;
    window.addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => { if (currentRoute() === "matriz") renderView(); }, 150);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
