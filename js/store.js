/* store.js — estado central, persistência em localStorage e pub/sub */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const KEY = "printPlanner2026.v2";

  const defaultState = () => ({
    config: {
      capital: 0,
      custoImpressora: 0,
      filamentos: 0,
      ferramentas: 0,
      marketing: 0,
      reserva: 0,
      objetivoMensal: 0,
      prazoMeses: 6,
      impressoras: 1,
    },
    impressoraSelecionada: null,
    canvas: { problema: "", segmentos: "", proposta: "", solucao: "", canais: "", receitas: "", custos: "", metricas: "", vantagem: "" },
    precificacao: { peso: 50, tempo: 3, precoKg: 120, margem: 100, posMin: 0, valorHora: 30, embalagem: 1.5, falha: 10, vidaUtil: 5000, tarifaKwh: 0.9 },
    produtos: [],
    nichosSelecionados: [],
    estrategiasSelecionadas: [],
    canaisMarketing: [],
    printFarm: { qtdImpressoras: 1 },
  });

  let state = load();
  const listeners = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      const base = defaultState();
      return {
        ...base,
        ...parsed,
        config: { ...base.config, ...(parsed.config || {}) },
        canvas: { ...base.canvas, ...(parsed.canvas || {}) },
        precificacao: { ...base.precificacao, ...(parsed.precificacao || {}) },
        produtos: parsed.produtos || [],
        printFarm: { ...base.printFarm, ...(parsed.printFarm || {}) },
      };
    } catch (e) {
      console.warn("Falha ao ler estado salvo, usando padrão.", e);
      return defaultState();
    }
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Não foi possível salvar no localStorage.", e);
    }
  }

  function emit() {
    listeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  const store = {
    get() { return state; },

    /** Atualiza config (merge raso). Se silent=true, persiste sem re-renderizar a view
     *  (usado pela calculadora para não reconstruir os inputs e perder o cursor). */
    setConfig(patch, silent) {
      state.config = { ...state.config, ...patch };
      persist();
      if (!silent) emit();
    },

    /** Liga/desliga um id em uma lista (nichos/estrategias/canais) */
    toggle(listName, id) {
      const list = state[listName];
      const i = list.indexOf(id);
      if (i === -1) list.push(id); else list.splice(i, 1);
      persist(); emit();
    },

    has(listName, id) {
      return state[listName].includes(id);
    },

    setPrintFarm(qtd) {
      state.printFarm.qtdImpressoras = qtd;
      persist(); emit();
    },

    /** Atualiza blocos do Lean Canvas. silent=true não re-renderiza (para edição inline). */
    setCanvas(patch, silent) {
      state.canvas = { ...state.canvas, ...patch };
      persist();
      if (!silent) emit();
    },

    /** Atualiza inputs da calculadora de precificação. silent=true não re-renderiza. */
    setPrecificacao(patch, silent) {
      state.precificacao = { ...state.precificacao, ...patch };
      persist();
      if (!silent) emit();
    },

    addProduto(prod) {
      state.produtos.push(prod);
      persist(); emit();
    },

    updateProduto(i, patch) {
      if (state.produtos[i]) {
        state.produtos[i] = { ...state.produtos[i], ...patch };
        persist(); emit();
      }
    },

    removeProduto(i) {
      state.produtos.splice(i, 1);
      persist(); emit();
    },

    /** Seleciona a impressora "motor" do plano e preenche a calculadora conforme ela */
    setImpressora(id) {
      const p = (Planner.data.impressoras || []).find((i) => i.id === id);
      if (!p) return;
      state.impressoraSelecionada = id;
      const sug = Planner.calc && Planner.calc.setupSugerido ? Planner.calc.setupSugerido(p) : {};
      state.config = { ...state.config, custoImpressora: p.preco, ...sug };
      persist(); emit();
    },

    /** Retorna o objeto da impressora selecionada, ou null se nenhuma foi escolhida */
    getImpressora() {
      const list = Planner.data.impressoras || [];
      return list.find((i) => i.id === state.impressoraSelecionada) || null;
    },

    reset() {
      state = defaultState();
      persist(); emit();
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
  };

  Planner.store = store;
})();
