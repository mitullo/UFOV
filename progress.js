window.UFOVProgress = (() => {
  const STORAGE_KEY = "ufov_progress_checks";
  const MAX_RECORDS = 300;

  let modal = null;
  let activeTab = "recent";

  function loadHistory() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-MAX_RECORDS)));
    } catch (_) {}
  }

  function recordCheck(record) {
    const history = loadHistory();

    history.push({
      id: window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now() + Math.random()),
      date: Date.now(),
      game: "UFOV",
      mode: record.mode,
      modeName: record.modeName,
      trials: record.trials,
      flashBefore: record.flashBefore,
      flashAfter: record.flashAfter,
      accuracy: record.accuracy,
      centerAccuracy: record.centerAccuracy,
      peripheralAccuracy: record.peripheralAccuracy,
      correctCount: record.correctCount,
      wrongCount: record.wrongCount,
      action: record.action
    });

    saveHistory(history);
  }

  function createModal() {
    if (modal) return modal;

    modal = document.createElement("section");
    modal.className = "progress-modal hidden";
    modal.innerHTML = `
      <div class="progress-window">
        <div class="progress-header">
          <div class="progress-tabs">
            <button type="button" class="progress-tab active" data-tab="recent">Recent Checks</button>
            <button type="button" class="progress-tab" data-tab="chart">Progress Chart</button>
          </div>
          <button type="button" class="progress-close">Close</button>
        </div>

        <div class="progress-body">
          <div class="progress-panel" data-panel="recent">
            <table class="progress-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Game</th>
                  <th>Mode</th>
                  <th>Trials</th>
                  <th>Flash</th>
                  <th>Accuracy</th>
                  <th>Center</th>
                  <th>Peripheral</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody id="progressTableBody"></tbody>
            </table>
          </div>

          <div class="progress-panel hidden" data-panel="chart">
            <div class="chart-summary" id="chartSummary"></div>
            <div class="chart-wrap">
              <canvas id="progressCanvas" width="1280" height="560"></canvas>
            </div>
            <div class="chart-legend">
              <span><i class="legend-line flash"></i> Flash difficulty</span>
              <span><i class="legend-line accuracy"></i> Check accuracy</span>
            </div>
          </div>
        </div>

        <div class="progress-footer">
          <button type="button" class="progress-clear">Clear history</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".progress-close").addEventListener("click", close);
    modal.querySelector(".progress-clear").addEventListener("click", clearHistory);

    modal.querySelectorAll(".progress-tab").forEach((button) => {
      button.addEventListener("click", () => setTab(button.dataset.tab));
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });

    return modal;
  }

  function open() {
    createModal();
    modal.classList.remove("hidden");
    render();
  }

  function close() {
    if (!modal) return;
    modal.classList.add("hidden");
  }

  function clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    render();
  }

  function setTab(tab) {
    activeTab = tab;

    modal.querySelectorAll(".progress-tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tab);
    });

    modal.querySelectorAll(".progress-panel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.panel !== tab);
    });

    render();
  }

  function render() {
    const history = loadHistory();

    renderTable(history);

    if (activeTab === "chart") {
      requestAnimationFrame(() => renderChart(history));
    }
  }

  function renderTable(history) {
    const body = document.getElementById("progressTableBody");
    if (!body) return;

    const rows = history.slice(-80).reverse();

    if (!rows.length) {
      body.innerHTML = `
        <tr>
          <td colspan="9" class="empty-progress">No progress checks yet.</td>
        </tr>
      `;
      return;
    }

    body.innerHTML = rows.map((row) => {
      const actionLabel = getActionLabel(row.action);
      const actionClass = getActionClass(row.action);

      return `
        <tr>
          <td>${formatRelativeDate(row.date)}</td>
          <td>${row.game}</td>
          <td>${escapeHtml(row.modeName || `Mode ${row.mode}`)}</td>
          <td>${row.correctCount}/${row.trials}</td>
          <td>${Math.round(row.flashBefore)}ms → ${Math.round(row.flashAfter)}ms</td>
          <td><span class="badge-score ${scoreClass(row.accuracy)}">${Math.round(row.accuracy)}%</span></td>
          <td><span class="badge-score ${scoreClass(row.centerAccuracy)}">${Math.round(row.centerAccuracy)}%</span></td>
          <td><span class="badge-score ${scoreClass(row.peripheralAccuracy)}">${formatPeripheral(row)}</span></td>
          <td><span class="progress-action ${actionClass}">${actionLabel}</span></td>
        </tr>
      `;
    }).join("");
  }

  function renderChart(history) {
    const canvas = document.getElementById("progressCanvas");
    const summary = document.getElementById("chartSummary");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    const data = history.slice(-80);

    if (summary) {
      summary.innerHTML = renderSummary(data);
    }

    if (data.length < 2) {
      drawCenteredText(ctx, "Complete at least 2 progress checks to show a chart.", width, height);
      return;
    }

    const padding = {
      left: 105,
      right: 105,
      top: 58,
      bottom: 78
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const flashValues = data.map(d => Number(d.flashAfter) || 0);
    const minFlash = Math.max(0, Math.min(...flashValues) - 20);
    const maxFlash = Math.max(...flashValues) + 20;

    drawGrid(ctx, padding, chartWidth, chartHeight);
    drawAxisLabels(ctx, padding, chartWidth, chartHeight, minFlash, maxFlash);

    const flashPoints = data.map((row, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const normalized = (row.flashAfter - minFlash) / Math.max(1, maxFlash - minFlash);
      const y = padding.top + chartHeight - normalized * chartHeight;
      return { x, y };
    });

    const accuracyPoints = data.map((row, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const normalized = (Number(row.accuracy) || 0) / 100;
      const y = padding.top + chartHeight - normalized * chartHeight;
      return { x, y };
    });

    drawLine(ctx, flashPoints, "#8b5cf6", 4);
    drawLine(ctx, accuracyPoints, "#22c55e", 4);
    drawDots(ctx, flashPoints, "#8b5cf6");
    drawDots(ctx, accuracyPoints, "#22c55e");

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "800 18px Inter, system-ui, sans-serif";
    ctx.fillText("Flash ms", padding.left, 30);

    ctx.textAlign = "right";
    ctx.fillText("Accuracy %", width - padding.right, 30);
    ctx.textAlign = "left";

    ctx.fillStyle = "#8f8f8f";
    ctx.font = "700 15px Inter, system-ui, sans-serif";
    ctx.fillText("Older checks", padding.left, height - 28);

    ctx.textAlign = "right";
    ctx.fillText("Newer checks", width - padding.right, height - 28);
    ctx.textAlign = "left";
  }

  function renderSummary(data) {
    if (!data.length) {
      return `
        <div><strong>Checks</strong><span>0</span></div>
        <div><strong>Latest flash</strong><span>—</span></div>
        <div><strong>Latest accuracy</strong><span>—</span></div>
        <div><strong>Trend</strong><span>—</span></div>
      `;
    }

    const latest = data[data.length - 1];
    const first = data[0];

    const flashDelta = latest.flashAfter - first.flashAfter;
    const trend =
      flashDelta < 0 ? "Getting harder" :
      flashDelta > 0 ? "Getting easier" :
      "Stable";

    return `
      <div><strong>Checks</strong><span>${data.length}</span></div>
      <div><strong>Latest flash</strong><span>${Math.round(latest.flashAfter)}ms</span></div>
      <div><strong>Latest accuracy</strong><span>${Math.round(latest.accuracy)}%</span></div>
      <div><strong>Trend</strong><span>${trend}</span></div>
    `;
  }

  function drawGrid(ctx, padding, chartWidth, chartHeight) {
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartWidth, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
    ctx.lineTo(padding.left + chartWidth, padding.top);
    ctx.stroke();
  }

  function drawAxisLabels(ctx, padding, chartWidth, chartHeight, minFlash, maxFlash) {
    ctx.font = "700 15px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#a8a29e";

    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartHeight / 4) * i;

      const flashValue = maxFlash - ((maxFlash - minFlash) / 4) * i;
      ctx.textAlign = "right";
      ctx.fillText(`${Math.round(flashValue)}ms`, padding.left - 14, y + 5);

      const accuracyValue = 100 - 25 * i;
      ctx.textAlign = "left";
      ctx.fillText(`${accuracyValue}%`, padding.left + chartWidth + 14, y + 5);
    }

    ctx.textAlign = "left";
  }

  function drawLine(ctx, points, color, width) {
    if (!points.length) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
    ctx.restore();
  }

  function drawDots(ctx, points, color) {
    ctx.fillStyle = color;

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawCenteredText(ctx, text, width, height) {
    ctx.fillStyle = "#a8a29e";
    ctx.font = "800 22px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, width / 2, height / 2);
    ctx.textAlign = "left";
  }

  function scoreClass(score) {
    if (score >= 80) return "good";
    if (score >= 50) return "warn";
    return "bad";
  }

  function getActionLabel(action) {
    if (action === "harder") return "Harder";
    if (action === "easier") return "Easier";
    return "No change";
  }

  function getActionClass(action) {
    if (action === "harder") return "harder";
    if (action === "easier") return "easier";
    return "stay";
  }

  function formatPeripheral(row) {
    if (row.mode === 1) return "—";
    return `${Math.round(row.peripheralAccuracy)}%`;
  }

  function formatRelativeDate(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById("progressButton");
    if (button) {
      button.addEventListener("click", open);
    }
  });

  return {
    recordCheck,
    open,
    close
  };
})();
