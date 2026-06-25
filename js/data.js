/* data.js — dados estáticos do planejador (escala 1–5 onde aplicável) */
(function () {
  const Planner = (window.Planner = window.Planner || {});

  // Nichos: potencial, dificuldade, velocidadeRetorno, escalabilidade (1–5)
  const nichos = [
    {
      id: "geek",
      nome: "Geek e Cosplay",
      icone: "🎮",
      potencial: 5, dificuldade: 3, velocidadeRetorno: 4, escalabilidade: 4,
      riscoNivel: 3,
      riscos: "Direitos autorais de franquias; concorrência alta; modas passageiras.",
      resumo: "Action figures, props, suportes de fones, itens de fãs. Margem alta com peças multicoloridas.",
    },
    {
      id: "miniaturas",
      nome: "Miniaturas",
      icone: "🐉",
      potencial: 4, dificuldade: 3, velocidadeRetorno: 3, escalabilidade: 3,
      riscoNivel: 2,
      riscos: "A1 (FDM) tem menos detalhe que resina; nicho exige acabamento fino.",
      resumo: "RPG, wargames, terrenos. Público fiel e recorrente, mas detalhe é desafio no FDM.",
    },
    {
      id: "engenharia",
      nome: "Engenharia e B2B",
      icone: "⚙️",
      potencial: 5, dificuldade: 4, velocidadeRetorno: 4, escalabilidade: 5,
      riscoNivel: 2,
      riscos: "Exige conhecimento técnico (CAD), tolerâncias e atendimento a empresas.",
      resumo: "Peças funcionais, gabaritos, reposição. Tickets altos e contratos recorrentes B2B.",
    },
    {
      id: "pet",
      nome: "Mercado Pet",
      icone: "🐾",
      potencial: 4, dificuldade: 2, velocidadeRetorno: 4, escalabilidade: 4,
      riscoNivel: 2,
      riscos: "Necessário materiais atóxicos; comoditização de itens simples.",
      resumo: "Comedouros, brinquedos, placas personalizadas. Mercado emocional e em crescimento.",
    },
    {
      id: "utilidades",
      nome: "Utilidades Domésticas",
      icone: "🏠",
      potencial: 3, dificuldade: 1, velocidadeRetorno: 5, escalabilidade: 3,
      riscoNivel: 2,
      riscos: "Margens baixas; fácil de copiar; competição por preço.",
      resumo: "Organizadores, suportes, ganchos. Vendas rápidas e fáceis, porém ticket baixo.",
    },
    {
      id: "multicolor",
      nome: "Produtos Multicoloridos",
      icone: "🌈",
      potencial: 5, dificuldade: 3, velocidadeRetorno: 4, escalabilidade: 4,
      riscoNivel: 2,
      riscos: "Consumo de filamento e tempo maior com AMS; desperdício na troca de cor.",
      resumo: "O diferencial do AMS. Peças vibrantes com percepção de valor muito maior.",
    },
    {
      id: "prototipagem",
      nome: "Prototipagem",
      icone: "🧪",
      potencial: 4, dificuldade: 4, velocidadeRetorno: 3, escalabilidade: 3,
      riscoNivel: 3,
      riscos: "Vendas irregulares; exige relacionamento com makers/startups/designers.",
      resumo: "Protótipos rápidos para inventores e empresas. Ticket alto, demanda intermitente.",
    },
    {
      id: "stl",
      nome: "STL e Produtos Digitais",
      icone: "💾",
      potencial: 5, dificuldade: 4, velocidadeRetorno: 2, escalabilidade: 5,
      riscoNivel: 3,
      riscos: "Pirataria; exige habilidade de modelagem; retorno lento no início.",
      resumo: "Renda passiva escalável: venda arquivos sem imprimir nada. Margem ~100%.",
    },
  ];

  // Estratégias: impactoFinanceiro, facilidade, velocidadeRetorno, riscoOperacional (1–5)
  const estrategias = [
    { id: "e_multicolor", nome: "Especialização em Produtos Multicoloridos", impactoFinanceiro: 5, facilidade: 4, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Usar o AMS como diferencial central, vendendo peças multicoloridas que a maioria dos concorrentes FDM não entrega." },
    { id: "e_velocidade", nome: "Produção em Alta Velocidade", impactoFinanceiro: 4, facilidade: 4, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Otimizar perfis de slicing e fluxo de trabalho para maximizar peças/dia e reduzir custo unitário." },
    { id: "e_cadcam", nome: "Ecossistema CAD/CAM", impactoFinanceiro: 5, facilidade: 2, velocidadeRetorno: 3, riscoOperacional: 2,
      descricao: "Dominar Fusion 360 + slicers para atender peças técnicas sob medida e fugir da concorrência de preço." },
    { id: "e_timelapse", nome: "Marketing por Timelapses", impactoFinanceiro: 4, facilidade: 5, velocidadeRetorno: 4, riscoOperacional: 1,
      descricao: "Gravar timelapses das impressões para TikTok/Reels — conteúdo viral de baixo custo que gera demanda." },
    { id: "e_b2b", nome: "Peças de Engenharia B2B", impactoFinanceiro: 5, facilidade: 2, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Fechar contratos recorrentes com empresas para reposição e gabaritos — receita previsível e ticket alto." },
    { id: "e_hibrida", nome: "Modelagem Híbrida", impactoFinanceiro: 4, facilidade: 3, velocidadeRetorno: 3, riscoOperacional: 2,
      descricao: "Combinar modelagem orgânica (Blender) e paramétrica (Fusion) para cobrir qualquer tipo de pedido." },
    { id: "e_ia", nome: "IA para Design", impactoFinanceiro: 4, facilidade: 4, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Usar Meshy/Kaedim/Luma para gerar modelos 3D rapidamente, multiplicando o catálogo sem modelar do zero." },
    { id: "e_247", nome: "Operação Residencial 24/7", impactoFinanceiro: 4, facilidade: 3, velocidadeRetorno: 4, riscoOperacional: 3,
      descricao: "Imprimir continuamente em casa com monitoramento remoto, transformando horas ociosas em produção." },
    { id: "e_stl", nome: "Venda de STL", impactoFinanceiro: 5, facilidade: 3, velocidadeRetorno: 2, riscoOperacional: 2,
      descricao: "Criar e vender arquivos digitais (Cults, MyMiniFactory, próprio site): renda passiva e escalável." },
    { id: "e_pos", nome: "Pós-processamento Premium", impactoFinanceiro: 4, facilidade: 3, velocidadeRetorno: 3, riscoOperacional: 2,
      descricao: "Lixar, pintar e montar para vender produtos acabados de alto valor agregado em vez de peças cruas." },
    { id: "e_hotend", nome: "Hotends Intercambiáveis", impactoFinanceiro: 3, facilidade: 3, velocidadeRetorno: 3, riscoOperacional: 2,
      descricao: "Trocar bicos por diâmetro: 0.2mm para detalhe, 0.8mm para velocidade — flexibilidade de produto." },
    { id: "e_param", nome: "Customização Paramétrica", impactoFinanceiro: 4, facilidade: 3, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Produtos personalizáveis (nome, tamanho, cor) gerados via parâmetros — alto valor percebido, baixo esforço." },
    { id: "e_boot", nome: "Bootstrapping", impactoFinanceiro: 3, facilidade: 5, velocidadeRetorno: 3, riscoOperacional: 1,
      descricao: "Reinvestir 100% do lucro inicial em filamento e marketing antes de gastar com nova impressora." },
    { id: "e_sazonal", nome: "Produtos Sazonais", impactoFinanceiro: 4, facilidade: 4, velocidadeRetorno: 5, riscoOperacional: 2,
      descricao: "Aproveitar datas (Natal, Páscoa, festa junina, Halloween) com produtos de demanda explosiva e curta." },
    { id: "e_render", nome: "Renderização para Pré-venda", impactoFinanceiro: 4, facilidade: 3, velocidadeRetorno: 4, riscoOperacional: 2,
      descricao: "Renderizar o produto antes de imprimir e validar a venda — produzir só o que já foi pago (zero estoque)." },
  ];

  // Softwares: custo / curvaAprendizado / prioridade (1–5; prioridade maior = mais importante)
  const softwares = [
    { id: "blender", nome: "Blender", finalidade: "Modelagem orgânica e arte 3D", custo: "Gratuito", custoNivel: 1, curvaAprendizado: 5, prioridade: 3 },
    { id: "fusion", nome: "Fusion 360", finalidade: "Modelagem paramétrica / engenharia", custo: "Gratuito (pessoal) / pago", custoNivel: 3, curvaAprendizado: 4, prioridade: 5 },
    { id: "bambu", nome: "Bambu Studio", finalidade: "Slicer oficial da Bambu Lab (AMS)", marca: "Bambu Lab", custo: "Gratuito", custoNivel: 1, curvaAprendizado: 2, prioridade: 5 },
    { id: "creality_print", nome: "Creality Print", finalidade: "Slicer oficial da Creality (CFS)", marca: "Creality", custo: "Gratuito", custoNivel: 1, curvaAprendizado: 2, prioridade: 4 },
    { id: "chitubox", nome: "ChiTuBox", finalidade: "Slicer para impressoras de resina", marca: "Resina", custo: "Freemium", custoNivel: 2, curvaAprendizado: 3, prioridade: 4 },
    { id: "orca", nome: "OrcaSlicer", finalidade: "Slicer universal / tuning fino", custo: "Gratuito", custoNivel: 1, curvaAprendizado: 3, prioridade: 4 },
    { id: "meshy", nome: "Meshy", finalidade: "Texto/imagem → modelo 3D (IA)", custo: "Freemium", custoNivel: 2, curvaAprendizado: 1, prioridade: 3 },
    { id: "kaedim", nome: "Kaedim", finalidade: "Imagem → malha 3D limpa (IA)", custo: "Pago", custoNivel: 4, curvaAprendizado: 2, prioridade: 2 },
    { id: "luma", nome: "Luma AI", finalidade: "Fotogrametria / captura 3D real", custo: "Freemium", custoNivel: 2, curvaAprendizado: 2, prioridade: 2 },
    { id: "chatgpt", nome: "ChatGPT", finalidade: "Ideias, copy, scripts, automação", custo: "Freemium", custoNivel: 2, curvaAprendizado: 1, prioridade: 4 },
    { id: "claude", nome: "Claude", finalidade: "Análise, planejamento, código", custo: "Freemium", custoNivel: 2, curvaAprendizado: 1, prioridade: 4 },
  ];

  // Canais: dificuldade / custo / alcance / roiEstimado (1–5)
  const canais = [
    { id: "shopee", nome: "Shopee", icone: "🛒", dificuldade: 2, custo: 2, alcance: 5, roiEstimado: 4,
      nota: "Alto tráfego e público que compra por impulso. Concorrência por preço é forte." },
    { id: "mercadolivre", nome: "Mercado Livre", icone: "📦", dificuldade: 3, custo: 3, alcance: 5, roiEstimado: 4,
      nota: "Ótimo para ticket médio/alto e itens funcionais. Boa reputação = mais vendas." },
    { id: "instagram", nome: "Instagram", icone: "📸", dificuldade: 3, custo: 2, alcance: 4, roiEstimado: 3,
      nota: "Vitrine visual e vendas diretas. Exige constância de conteúdo." },
    { id: "tiktok", nome: "TikTok", icone: "🎵", dificuldade: 2, custo: 1, alcance: 5, roiEstimado: 5,
      nota: "Timelapses viralizam com facilidade. Maior potencial de alcance orgânico." },
    { id: "youtube", nome: "YouTube", icone: "▶️", dificuldade: 4, custo: 2, alcance: 4, roiEstimado: 3,
      nota: "Autoridade de longo prazo e tráfego recorrente. Retorno mais lento." },
  ];

  // Impressoras: a escolhida vira o "motor" do plano (preço, velocidade, capacidade, multicor)
  // preco em R$; velocidade em mm/s; multicor = nº de cores (0/1 = cor única);
  // pecasMes = capacidade-base/máquina; ticket = R$ médio por peça (resina = maior valor)
  const ml = (q) => `https://lista.mercadolivre.com.br/${encodeURIComponent(q)}`;
  const impressoras = [
    {
      id: "bambu_a1_combo", nome: "Bambu Lab A1 Combo (AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "256×256×256 mm", preco: 4797, avaliacao: 4.9,
      pecasMes: 90, ticket: 35, loja: "Shopee", link: ml("Bambu Lab A1 Combo AMS"),
      destaque: "O melhor custo-benefício multicolor para começar. Padrão do plano.",
    },
    {
      id: "bambu_a1_mini_combo", nome: "Bambu Lab A1 mini Combo (AMS lite)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "180×180×180 mm", preco: 3997, avaliacao: 4.8,
      pecasMes: 75, ticket: 32, loja: "Mercado Livre", link: ml("Bambu Lab A1 mini combo AMS lite 4 cores"),
      destaque: "Multicor 4 cores em formato compacto e mais barato. Volume menor.",
    },
    {
      id: "bambu_a1_mini", nome: "Bambu Lab A1 mini (sem AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 1, velocidade: 500, volume: "180×180×180 mm", preco: 2249, avaliacao: 4.6,
      pecasMes: 70, ticket: 25, loja: "Mercado Livre", link: ml("Bambu Lab A1 Mini sem AMS"),
      destaque: "Entrada FDM confiável, cor única. Ótima para validar com baixo custo.",
    },
    {
      id: "bambu_p1s_combo", nome: "Bambu Lab P1S Combo (AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "256×256×256 mm", preco: 8449, avaliacao: 5.0,
      pecasMes: 95, ticket: 35, loja: "Shopee", link: ml("Bambu Lab P1S Combo AMS"),
      destaque: "FDM fechada e robusta — ótima com ABS/ASA e produção contínua. Multicor 4 cores.",
    },
    {
      id: "bambu_x1c_combo", nome: "Bambu Lab X1-Carbon Combo (AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "256×256×256 mm", preco: 12999, avaliacao: 5.0,
      pecasMes: 100, ticket: 37, loja: "Shopee", link: ml("Bambu Lab X1 Carbon Combo AMS"),
      destaque: "Carro-chefe Bambu: sensor LiDAR, fechada e precisa. Premium para qualidade máxima.",
    },
    {
      id: "bambu_h2d_combo", nome: "Bambu Lab H2D Combo (AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 600, volume: "350×320×325 mm", preco: 25349, avaliacao: 5.0,
      pecasMes: 130, ticket: 42, loja: "Shopee", link: ml("Bambu Lab H2D Combo AMS"),
      destaque: "Topo de linha com duplo bico e volume grande. Maior produtividade, investimento elevado.",
    },
    {
      id: "bambu_p2s_combo", nome: "Bambu Lab P2S Combo (AMS)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "256×256×256 mm", preco: 9999, avaliacao: 5.0,
      pecasMes: 96, ticket: 35, loja: "Shopee", link: ml("Bambu Lab P2S Combo AMS"),
      destaque: "Evolução da linha P fechada, multicor 4 cores. Boa para produção em série confiável.",
    },
    {
      id: "bambu_x1e_combo", nome: "Bambu Lab X1E (empresarial)", marca: "Bambu Lab", tipo: "FDM",
      multicor: 4, velocidade: 500, volume: "256×256×256 mm", preco: 19999, avaliacao: 5.0,
      pecasMes: 105, ticket: 40, loja: "Shopee", link: ml("Bambu Lab X1E empresarial"),
      destaque: "Versão corporativa da X1: câmara aquecida, segurança e materiais de engenharia. Foco B2B.",
    },
    {
      id: "creality_k2_cfs", nome: "Creality K2 Combo CFS", marca: "Creality", tipo: "FDM",
      multicor: 16, velocidade: 600, volume: "350×350×350 mm", preco: 8413, avaliacao: 5.0,
      pecasMes: 120, ticket: 38, loja: "Mercado Livre", link: ml("Creality K2 Combo CFS Multicolor"),
      destaque: "Topo multicolor: grande, rápida (600 mm/s) e até 16 cores. Investimento alto.",
    },
    {
      id: "creality_k1c", nome: "Creality K1C", marca: "Creality", tipo: "FDM",
      multicor: 1, velocidade: 600, volume: "220×220×250 mm", preco: 3200, avaliacao: 4.9,
      pecasMes: 100, ticket: 30, loja: "Mercado Livre", link: ml("Creality K1C compativel CFS"),
      destaque: "Rápida e fechada (600 mm/s), boa com filamentos técnicos. Cor única (CFS opcional).",
    },
    {
      id: "creality_ender5_max", nome: "Creality Ender-5 Max", marca: "Creality", tipo: "FDM",
      multicor: 1, velocidade: 700, volume: "400×400×400 mm", preco: 4500, avaliacao: 4.9,
      pecasMes: 110, ticket: 30, loja: "Mercado Livre", link: ml("Creality Ender-5 Max 700mm/s"),
      destaque: "Volume enorme e 700 mm/s — ideal para peças grandes e lotes. Cor única.",
    },
    {
      id: "creality_ender3_v3ke", nome: "Creality Ender-3 V3 KE", marca: "Creality", tipo: "FDM",
      multicor: 1, velocidade: 500, volume: "220×220×240 mm", preco: 1697, avaliacao: 4.5,
      pecasMes: 80, ticket: 24, loja: "Mercado Livre", link: ml("Creality Ender-3 V3 KE 500mm/s"),
      destaque: "A opção mais barata para bootstrapping. Exige mais ajuste manual.",
    },
    {
      id: "elegoo_centauri_carbon", nome: "Elegoo Centauri Carbon", marca: "Elegoo", tipo: "FDM",
      multicor: 1, velocidade: 500, volume: "256×256×256 mm", preco: 2800, avaliacao: 4.7,
      pecasMes: 85, ticket: 27, loja: "Mercado Livre", link: ml("Elegoo Centauri Carbon FDM 500mm/s"),
      destaque: "FDM robusta com bom custo, pronta para fibra de carbono. Cor única.",
    },
    {
      id: "elegoo_mars5_ultra", nome: "Elegoo Mars 5 Ultra", marca: "Elegoo", tipo: "Resina",
      multicor: 1, velocidade: 0, volume: "153×77×165 mm", preco: 2525, avaliacao: 4.6,
      pecasMes: 50, ticket: 55, loja: "Mercado Livre", link: ml("Elegoo Mars 5 Ultra resina"),
      destaque: "Resina de altíssimo detalhe para miniaturas premium. Peças menores, ticket alto.",
    },
  ];

  // Recomendações por impressora: nichos mais apropriados + softwares (inclui slicer da marca)
  const reco = {
    bambu_a1_combo:        { nichos: ["multicolor", "geek", "pet", "utilidades"],       softwares: ["bambu", "orca", "fusion", "meshy", "claude"] },
    bambu_a1_mini_combo:   { nichos: ["multicolor", "geek", "utilidades", "pet"],        softwares: ["bambu", "orca", "fusion", "meshy"] },
    bambu_a1_mini:         { nichos: ["utilidades", "geek", "stl", "pet"],               softwares: ["bambu", "orca", "fusion"] },
    bambu_p1s_combo:       { nichos: ["multicolor", "geek", "engenharia", "utilidades"], softwares: ["bambu", "orca", "fusion", "claude"] },
    bambu_x1c_combo:       { nichos: ["engenharia", "prototipagem", "multicolor", "geek"], softwares: ["bambu", "orca", "fusion", "claude"] },
    bambu_h2d_combo:       { nichos: ["engenharia", "prototipagem", "multicolor", "geek"], softwares: ["bambu", "orca", "fusion", "claude"] },
    bambu_p2s_combo:       { nichos: ["multicolor", "geek", "utilidades", "pet"],        softwares: ["bambu", "orca", "fusion"] },
    bambu_x1e_combo:       { nichos: ["engenharia", "prototipagem", "stl"],              softwares: ["bambu", "orca", "fusion", "claude"] },
    creality_k2_cfs:       { nichos: ["multicolor", "geek", "engenharia", "prototipagem"], softwares: ["creality_print", "orca", "fusion", "meshy"] },
    creality_k1c:          { nichos: ["engenharia", "prototipagem", "geek", "utilidades"], softwares: ["creality_print", "orca", "fusion"] },
    creality_ender5_max:   { nichos: ["engenharia", "prototipagem", "geek"],             softwares: ["creality_print", "orca", "fusion"] },
    creality_ender3_v3ke:  { nichos: ["utilidades", "stl", "geek", "pet"],               softwares: ["creality_print", "orca"] },
    elegoo_centauri_carbon:{ nichos: ["engenharia", "prototipagem", "geek", "utilidades"], softwares: ["orca", "fusion", "claude"] },
    elegoo_mars5_ultra:    { nichos: ["miniaturas", "prototipagem", "geek"],             softwares: ["chitubox", "blender", "meshy", "luma"] },
  };
  impressoras.forEach((p) => {
    const r = reco[p.id] || {};
    p.nichos = r.nichos || [];
    p.softwares = r.softwares || [];
  });

  Planner.data = { nichos, estrategias, softwares, canais, impressoras };
})();
