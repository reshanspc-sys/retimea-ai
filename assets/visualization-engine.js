/* RETIMEA AI — Shared Visualization Engine
 * Safe, reusable chart and diagram renderer for all workspace tools.
 * Uses Chart.js and Mermaid when those libraries are available.
 */
(function (global) {
  "use strict";

  let sequence = 0;
  const chartTypes = new Set(["bar", "line", "pie", "doughnut"]);

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function validChart(visual) {
    const data = visual && visual.data;
    if (!data || !Array.isArray(data.labels) || !Array.isArray(data.datasets)) return false;
    if (!data.labels.length || data.labels.length > 50 || !data.datasets.length || data.datasets.length > 5) return false;
    return data.datasets.every(dataset =>
      dataset &&
      Array.isArray(dataset.data) &&
      dataset.data.length === data.labels.length &&
      dataset.data.every(value => typeof value === "number" && Number.isFinite(value))
    );
  }

  function renderChart(card, visual, title) {
    if (!global.Chart) {
      card.appendChild(makeElement("p", "visual-fallback", "Chart library is unavailable. Please refresh and try again."));
      return;
    }
    if (!validChart(visual)) {
      card.appendChild(makeElement("p", "visual-fallback", "The chart data was incomplete or invalid, so it could not be displayed."));
      return;
    }

    const wrap = makeElement("div", "visual-chart-wrap");
    const canvas = makeElement("canvas", "visual-chart");
    canvas.setAttribute("role", "img");
    canvas.setAttribute("aria-label", title + " chart");
    wrap.appendChild(canvas);
    card.appendChild(wrap);

    const labels = visual.data.labels.map(value => String(value).slice(0, 100));
    const datasets = visual.data.datasets.map(dataset => ({
      label: String(dataset.label || "Data").slice(0, 100),
      data: dataset.data.slice(),
      borderWidth: 2,
      tension: 0.3
    }));
    const light = document.body.dataset.theme === "light";
    const tick = light ? "#53657b" : "#a8bbce";
    const grid = light ? "rgba(45,67,94,.12)" : "rgba(141,165,189,.18)";

    try {
      new global.Chart(canvas, {
        type: visual.type,
        data: { labels, datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: tick } }
          },
          scales: chartTypes.has(visual.type) && !["pie", "doughnut"].includes(visual.type)
            ? {
                x: { ticks: { color: tick }, grid: { color: grid } },
                y: { ticks: { color: tick }, grid: { color: grid }, beginAtZero: true }
              }
            : {}
        }
      });
    } catch (error) {
      console.error("RETIMEA visualization chart error:", error);
      wrap.replaceChildren(makeElement("p", "visual-fallback", "This chart could not be displayed."));
    }
  }

  async function renderDiagram(card, visual) {
    const diagram = makeElement("div", "visual-diagram", "Rendering diagram…");
    card.appendChild(diagram);

    if (!global.mermaid) {
      diagram.textContent = "Diagram library is unavailable. Please refresh and try again.";
      return;
    }

    const id = "retimea-visual-" + (++sequence);
    try {
      global.mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: document.body.dataset.theme === "light" ? "default" : "dark"
      });
      const result = await global.mermaid.render(id, visual.code);
      diagram.innerHTML = result.svg;
    } catch (error) {
      console.error("RETIMEA visualization diagram error:", error);
      diagram.textContent = "This diagram could not be displayed.";
    }
  }

  async function render(container, visuals, options) {
    if (!container || !Array.isArray(visuals)) return [];
    const settings = options || {};
    const limit = Math.min(Number(settings.limit) || 5, 5);
    const rendered = [];

    for (const visual of visuals.slice(0, limit)) {
      if (!visual || typeof visual !== "object") continue;
      const isChart = chartTypes.has(visual.type);
      const isDiagram = visual.type === "mermaid" &&
        typeof visual.code === "string" &&
        visual.code.trim().length > 0 &&
        visual.code.length <= 5000;
      if (!isChart && !isDiagram) continue;

      const card = makeElement("section", "visual-card");
      const title = String(visual.title || "AI Visualization").slice(0, 150);
      card.appendChild(makeElement("div", "visual-title", title));
      if (visual.description) {
        card.appendChild(makeElement("div", "visual-description", String(visual.description).slice(0, 500)));
      }

      if (isChart) renderChart(card, visual, title);
      else await renderDiagram(card, visual);

      container.appendChild(card);
      rendered.push(card);
    }
    return rendered;
  }

  global.RetimeaVisualization = Object.freeze({ render });
})(window);
