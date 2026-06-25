/* charts.js — desenho da matriz de decisão em Canvas (sem libs) */
(function () {
  const Planner = (window.Planner = window.Planner || {});

  /**
   * Plota estratégias num scatter: X = dificuldade (1–5), Y = lucro/impacto (1–5).
   * Pontos selecionados ficam destacados.
   */
  function drawMatriz(canvas, estrategias, selecionadasIds) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth || 640;
    const H = canvas.clientHeight || 460;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    const pad = { t: 30, r: 24, b: 46, l: 56 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;

    const x = (v) => pad.l + ((v - 0.5) / 5) * plotW;       // dificuldade 0.5–5.5
    const y = (v) => pad.t + (1 - (v - 0.5) / 5) * plotH;   // lucro 0.5–5.5 (invertido)

    // Quadrantes
    const midX = x(3), midY = y(3);
    const quad = [
      { x: pad.l, y: pad.t, w: midX - pad.l, h: midY - pad.t, c: "rgba(34,211,153,.10)", label: "Alto lucro · Baixa dificuldade", lc: "#22d399" },
      { x: midX, y: pad.t, w: pad.l + plotW - midX, h: midY - pad.t, c: "rgba(168,85,247,.10)", label: "Alto lucro · Alta dificuldade", lc: "#c084fc" },
      { x: pad.l, y: midY, w: midX - pad.l, h: pad.t + plotH - midY, c: "rgba(56,189,248,.08)", label: "Baixo lucro · Baixa dificuldade", lc: "#7dd3fc" },
      { x: midX, y: midY, w: pad.l + plotW - midX, h: pad.t + plotH - midY, c: "rgba(248,113,113,.10)", label: "Baixo lucro · Alta dificuldade", lc: "#f87171" },
    ];
    ctx.font = "11px system-ui, sans-serif";
    quad.forEach((q) => {
      ctx.fillStyle = q.c;
      ctx.fillRect(q.x, q.y, q.w, q.h);
      ctx.fillStyle = q.lc;
      ctx.globalAlpha = 0.85;
      ctx.fillText(q.label, q.x + 8, q.y + 16);
      ctx.globalAlpha = 1;
    });

    // Eixos / grade
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(midX, pad.t); ctx.lineTo(midX, pad.t + plotH);
    ctx.moveTo(pad.l, midY); ctx.lineTo(pad.l + plotW, midY);
    ctx.stroke();

    // Rótulos de eixo
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Dificuldade de implementação →", pad.l + plotW / 2, H - 14);
    ctx.save();
    ctx.translate(16, pad.t + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Impacto financeiro →", 0, 0);
    ctx.restore();
    ctx.textAlign = "start";

    // Pontos (com leve jitter para evitar sobreposição)
    estrategias.forEach((e, i) => {
      const sel = selecionadasIds.includes(e.id);
      const jx = ((i % 3) - 1) * 6;
      const jy = ((Math.floor(i / 3) % 3) - 1) * 6;
      const px = x(e.facilidade ? (6 - e.facilidade) : e.dificuldade) + jx; // facilidade alta = dificuldade baixa
      const py = y(e.impactoFinanceiro) + jy;
      const radius = sel ? 9 : 6;

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = sel ? "#a855f7" : "rgba(125,211,252,.55)";
      ctx.fill();
      if (sel) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#fff";
        ctx.stroke();
      }
      // número de referência
      ctx.fillStyle = sel ? "#fff" : "rgba(255,255,255,.85)";
      ctx.font = "bold 10px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), px, py);
      ctx.textAlign = "start";
      ctx.textBaseline = "alphabetic";
    });
  }

  Planner.charts = { drawMatriz };
})();
