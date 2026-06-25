/* store.js — estado central, persistência em localStorage e pub/sub */
(function () {
  const Planner = (window.Planner = window.Planner || {});
  const KEY = "printPlanner2026";

  const defaultState = () => ({
    config: {
      capital: 0,
      custoImpressora: 3500,
      filamentos: 600,
      ferramentas: 300,
      marketing: 400,
      reserva: 500,
      objetivoMensal: 5000,
      prazoMeses: 6,
      impressoras: 1,
    },
    impressoraSelecionada: "bambu_a1_combo",
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

    /** Atualiza config (merge raso) */
    setConfig(patch) {
      state.config = { ...state.config, ...patch };
      persist(); emit();
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

    /** Seleciona a impressora "motor" do plano e alinha o custo na calculadora */
    setImpressora(id) {
      const p = (Planner.data.impressoras || []).find((i) => i.id === id);
      if (!p) return;
      state.impressoraSelecionada = id;
      state.config.custoImpressora = p.preco;
      persist(); emit();
    },

    /** Retorna o objeto da impressora selecionada (com fallback para a primeira) */
    getImpressora() {
      const list = Planner.data.impressoras || [];
      return list.find((i) => i.id === state.impressoraSelecionada) || list[0];
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
