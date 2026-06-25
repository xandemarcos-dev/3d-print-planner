# 3D Print Business Planner 2026

Painel estratégico interativo para planejar um negócio lucrativo de impressão 3D usando uma
**Bambu Lab A1 Combo AMS**. Organize, compare, priorize e selecione nichos, estratégias,
softwares e canais de marketing — e gere um plano estratégico completo.

## Como usar

Abra `index.html` no navegador (duplo clique) ou sirva a pasta com qualquer servidor estático:

```bash
# opção simples com Python
python -m http.server 8000
# depois acesse http://localhost:8000
```

Não há build nem dependências externas. Tudo funciona offline.

## Funcionalidades

- **Dashboard** — KPIs e score geral do projeto (0–100), atualizado ao vivo.
- **Calculadora de Investimento** — investimento total, ponto de equilíbrio, ROI e tempo de retorno.
- **Nichos** — 8 mercados com potencial, dificuldade, velocidade de retorno, escalabilidade e riscos.
- **Estratégias** — 15 táticas selecionáveis com impacto, facilidade, velocidade e risco.
- **Softwares** — tabela comparativa (Blender, Fusion 360, Bambu Studio, OrcaSlicer, IAs…).
- **Marketing** — ativa canais (Shopee, Mercado Livre, Instagram, TikTok, YouTube).
- **Roadmap** — 5 fases geradas dinamicamente pelas suas escolhas.
- **Matriz de Decisão** — gráfico lucro × dificuldade (Canvas) com as estratégias plotadas.
- **Print Farm** — simula 1 a 10 impressoras: produção, faturamento, lucro e expansão.
- **IA Consultora** — análise heurística com recomendações.
- **Relatório Final** — plano estratégico completo, com opção de imprimir/salvar PDF.

## Tecnologias

HTML5 · CSS3 (tema escuro, design tokens) · JavaScript vanilla (ES6) · Canvas · LocalStorage.

## Estrutura

```
index.html
css/style.css
js/
  data.js      store.js     score.js
  ui.js        charts.js    app.js
  modules/     (um arquivo por módulo)
```

Os dados (escala 1–5) ficam em `js/data.js` e podem ser ajustados conforme sua pesquisa.
O estado é salvo automaticamente em `localStorage['printPlanner2026']`.
