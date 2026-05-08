window.UFOVProgress = (() => {
  const STORAGE_KEY = "ufov_progress_checks";
  const MAX_RECORDS = 300;

  let modal = null;
  let activeTab = "recent";
  let chartTooltip = null;
  let chartHoverPoints = [];

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
      action: record.action,
      settings: record.settings || null
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
                  <th>Mode</th>
                  <th>Settings</th>
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
            <div class="chart-card">
              <div class="chart-wrap">
                <canvas id="progressCanvas" width="1200" height="470"></canvas>
                <div class="chart-tooltip hidden" id="chartTooltip" role="status" aria-live="polite"></div>
              </div>
              <div class="chart-meta">
                <div class="chart-passive-dates" id="chartPassiveDates"></div>
                <div class="chart-legend">
                  <span><i class="legend-line flash"></i> Difficulty from flash</span>
                  <span><i class="legend-line accuracy"></i> Accuracy</span>
                  <span><i class="legend-line target"></i> Target / regress lines</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="progress-footer">
          <button type="button" class="progress-clear">Clear history</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    chartTooltip = modal.querySelector("#chartTooltip");

    const chartCanvas = modal.querySelector("#progressCanvas");
    if (chartCanvas) {
      chartCanvas.addEventListener("pointermove", handleChartHover);
      chartCanvas.addEventListener("pointerleave", hideChartTooltip);
    }

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

    hideChartTooltip();
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
          <td>${escapeHtml(row.modeName || `Mode ${row.mode}`)}</td>
          <td>${escapeHtml(formatSettings(row))}</td>
          <td>${row.correctCount}/${row.trials}</td>
          <td>${Math.round(row.flashBefore) === Math.round(row.flashAfter) ? `${Math.round(row.flashAfter)}ms` : `${Math.round(row.flashBefore)}ms → ${Math.round(row.flashAfter)}ms`}</td>
          <td><span class="badge-score ${scoreClass(row.accuracy)}">${Math.round(row.accuracy)}%</span></td>
          <td><span class="badge-score ${scoreClass(row.centerAccuracy)}">${Math.round(row.centerAccuracy)}%</span></td>
          <td><span class="badge-score ${scoreClass(row.peripheralAccuracy)}">${formatPeripheral(row)}</span></td>
          <td><span class="progress-action ${actionClass}">${actionLabel}</span></td>
        </tr>
      `;
    }).join("");
  }

  function sizeChartCanvas(canvas) {
    const wrap = canvas.closest(".chart-wrap");
    const availableWidth = wrap ? wrap.clientWidth : 1120;
    const availableHeight = wrap ? wrap.clientHeight : 360;
    const width = clamp(Math.round(availableWidth - 20), 720, 1180);
    const height = clamp(Math.round(availableHeight - 12), 300, 520);

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  }

  function renderChart(history) {
    const canvas = document.getElementById("progressCanvas");
    const summary = document.getElementById("chartSummary");
    const passiveDates = document.getElementById("chartPassiveDates");
    if (!canvas) return;

    sizeChartCanvas(canvas);
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const chartState = getChartData(history);
    const data = chartState.rows;
    chartHoverPoints = [];

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    if (summary) {
      summary.innerHTML = renderSummary(data, chartState.scope, chartState.current);
    }

    if (passiveDates) {
      passiveDates.innerHTML = data.length ? renderChartDateRange(data) : "";
    }

    if (data.length < 2) {
      drawCenteredText(ctx, "Complete at least 2 matching progress checks to show a chart.", width, height);
      return;
    }

    const padding = {
      left: 72,
      right: 44,
      top: 50,
      bottom: 34
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    drawGrid(ctx, padding, chartWidth, chartHeight);
    drawPercentAxisLabels(ctx, padding, chartWidth, chartHeight);
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.targetAccuracy, "#fbbf24", "target");
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.regressAccuracy, "#fb7185", "regress");

    const difficultyPoints = data.map((row, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const normalized = difficultyScore(row, chartState.current) / 100;
      const y = padding.top + chartHeight - normalized * chartHeight;
      return {
        x,
        y,
        row,
        index,
        metric: "Difficulty",
        value: difficultyScore(row, chartState.current)
      };
    });

    const accuracyPoints = data.map((row, index) => {
      const x = padding.left + (index / (data.length - 1)) * chartWidth;
      const value = Number(row.accuracy) || 0;
      const normalized = clamp(value / 100, 0, 1);
      const y = padding.top + chartHeight - normalized * chartHeight;
      return { x, y, row, index, metric: "Accuracy", value };
    });

    drawLine(ctx, difficultyPoints, "#8b5cf6", 4);
    drawLine(ctx, accuracyPoints, "#22c55e", 4);
    drawDots(ctx, difficultyPoints, "#8b5cf6");
    drawDots(ctx, accuracyPoints, "#22c55e");
    chartHoverPoints = [...difficultyPoints, ...accuracyPoints];

    ctx.fillStyle = "#d6d3d1";
    ctx.font = "800 17px Inter, system-ui, sans-serif";
    ctx.fillText("Higher is better: faster flash difficulty and accuracy", padding.left, 30);
  }

  function handleChartHover(event) {
    if (!chartTooltip || !chartHoverPoints.length) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    const nearest = chartHoverPoints.reduce((best, point) => {
      const distance = Math.hypot(point.x - x, point.y - y);
      return distance < best.distance ? { point, distance } : best;
    }, { point: null, distance: Infinity });

    if (!nearest.point || nearest.distance > 22) {
      hideChartTooltip();
      return;
    }

    chartTooltip.innerHTML = renderChartTooltip(nearest.point);
    chartTooltip.classList.remove("hidden");

    const wrap = canvas.closest(".chart-wrap");
    const wrapRect = wrap.getBoundingClientRect();
    let left = event.clientX - wrapRect.left + 14;
    let top = event.clientY - wrapRect.top + 14;

    const maxLeft = wrap.clientWidth - chartTooltip.offsetWidth - 10;
    const maxTop = wrap.clientHeight - chartTooltip.offsetHeight - 10;

    if (left > maxLeft) {
      left = event.clientX - wrapRect.left - chartTooltip.offsetWidth - 14;
    }

    if (top > maxTop) {
      top = event.clientY - wrapRect.top - chartTooltip.offsetHeight - 14;
    }

    chartTooltip.style.left = `${clamp(left, 10, Math.max(10, maxLeft))}px`;
    chartTooltip.style.top = `${clamp(top, 10, Math.max(10, maxTop))}px`;
  }

  function hideChartTooltip() {
    if (chartTooltip) chartTooltip.classList.add("hidden");
  }

  function renderChartTooltip(point) {
    const row = point.row;
    const flashText = Math.round(row.flashBefore) === Math.round(row.flashAfter)
      ? `${Math.round(row.flashAfter)}ms`
      : `${Math.round(row.flashBefore)}ms → ${Math.round(row.flashAfter)}ms`;

    return `
      <strong>${escapeHtml(point.metric)} · ${Math.round(point.value)}%</strong>
      <span>${escapeHtml(formatAbsoluteDate(row.date))}</span>
      <span>${escapeHtml(row.modeName || `Mode ${row.mode}`)}</span>
      <span>Flash: ${escapeHtml(flashText)} · Trials: ${row.correctCount}/${row.trials}</span>
      <span>Accuracy: ${Math.round(row.accuracy)}% · Center: ${Math.round(row.centerAccuracy)}% · Peripheral: ${escapeHtml(formatPeripheral(row))}</span>
      <span>${escapeHtml(formatSettings(row))}</span>
      <span>Change: ${escapeHtml(getActionLabel(row.action))}</span>
    `;
  }

  function renderChartDateRange(data) {
    const first = data[0];
    const latest = data[data.length - 1];

    return `
      <span>Showing <strong>${data.length}</strong> checks from <strong>${escapeHtml(formatChartDate(first.date))}</strong> to <strong>${escapeHtml(formatChartDate(latest.date))}</strong>.</span>
      <span>Hover any dot for exact date, settings, flash, and scores.</span>
    `;
  }

  function formatAbsoluteDate(timestamp) {
    return new Date(timestamp).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatChartDate(timestamp) {
    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric"
    });
  }

  function getChartData(history) {
    const current = readCurrentSettings();
    const exact = history.filter((row) => recordMatchesCurrent(row, current));

    if (exact.length >= 2) {
      return {
        rows: exact.slice(-80),
        scope: "current settings",
        current
      };
    }

    const sameMode = history.filter((row) => Number(row.mode) === current.mode);

    return {
      rows: sameMode.slice(-80),
      scope: exact.length === 1 ? "same mode, waiting for one more exact check" : "same mode",
      current
    };
  }

  function readCurrentSettings() {
    const numberValue = (id, fallback) => {
      const input = document.getElementById(id);
      const value = Number(input ? input.value : fallback);
      return Number.isFinite(value) ? value : fallback;
    };

    const textValue = (id, fallback) => {
      const input = document.getElementById(id);
      return input ? input.value : fallback;
    };

    const levelSelect = document.getElementById("levelSelect");
    const mode = numberValue("levelSelect", 3);

    return {
      mode,
      modeName: levelSelect && levelSelect.selectedOptions && levelSelect.selectedOptions[0]
        ? levelSelect.selectedOptions[0].textContent
        : `Mode ${mode}`,
      responseStyle: textValue("responseStyleSelect", "twoStep"),
      stimulusArea: textValue("stimulusAreaSelect", "circle"),
      directionCount: numberValue("directionCountInput", 8),
      peripheralTargets: numberValue("peripheralTargetInput", 1),
      distractors: numberValue("distractorInput", 14),
      trialsToCheck: numberValue("trialsToCheckInput", 4),
      targetAccuracy: numberValue("targetAccuracyInput", 75),
      regressAccuracy: numberValue("regressAccuracyInput", 50),
      minDuration: numberValue("minDurationInput", 16),
      maxDuration: numberValue("maxDurationInput", 500)
    };
  }

  function recordMatchesCurrent(row, current) {
    if (!row.settings) return false;

    const settings = row.settings;
    const sameDistractors = current.mode === 3
      ? Number(settings.distractors) === current.distractors
      : true;

    return Number(row.mode) === current.mode
      && settings.responseStyle === current.responseStyle
      && settings.stimulusArea === current.stimulusArea
      && Number(settings.directionCount) === current.directionCount
      && Number(settings.peripheralTargets) === current.peripheralTargets
      && sameDistractors;
  }

  function difficultyScore(row, current) {
    const settings = row.settings || current;
    const min = Number(settings.minDuration) || current.minDuration || 16;
    const max = Math.max(Number(settings.maxDuration) || current.maxDuration || 500, min + 1);
    const flash = Number(row.flashAfter) || max;

    return clamp(((max - flash) / (max - min)) * 100, 0, 100);
  }

  function renderSummary(data, scope, current) {
    if (!data.length) {
      return `
        <div><strong>Checks</strong><span>0</span></div>
        <div><strong>Scope</strong><span>${escapeHtml(scope)}</span></div>
        <div><strong>Latest flash</strong><span>—</span></div>
        <div><strong>Trend</strong><span>—</span></div>
      `;
    }

    const latest = data[data.length - 1];
    const first = data[0];
    const difficultyDelta = difficultyScore(latest, current) - difficultyScore(first, current);

    const trend =
      difficultyDelta > 3 ? "Harder" :
      difficultyDelta < -3 ? "Easier" :
      "Stable";

    return `
      <div><strong>Checks</strong><span>${data.length}</span></div>
      <div><strong>Scope</strong><span>${escapeHtml(scope)}</span></div>
      <div><strong>Latest</strong><span>${Math.round(latest.flashAfter)}ms · ${Math.round(latest.accuracy)}%</span></div>
      <div><strong>Trend</strong><span>${trend}</span></div>
    `;
  }

  function formatSettings(row) {
    const settings = row.settings;

    if (!settings) {
      return "older record";
    }

    const parts = [
      settings.responseStyle === "combined" ? "combined" : "two step",
      settings.stimulusArea === "full" ? "full field" : "circle",
      `${settings.directionCount} dirs`,
      `${settings.peripheralTargets} target${Number(settings.peripheralTargets) === 1 ? "" : "s"}`
    ];

    if (Number(row.mode) === 3) {
      parts.push(`${settings.distractors} distractors`);
    }

    return parts.join(" · ");
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

  function drawPercentAxisLabels(ctx, padding, chartWidth, chartHeight) {
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#a8a29e";
    ctx.textAlign = "right";

    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartHeight / 4) * i;
      const value = 100 - 25 * i;
      ctx.fillText(`${value}%`, padding.left - 14, y + 5);
    }

    ctx.textAlign = "left";
  }

  function drawDateAxisLabels(ctx, padding, chartWidth, chartHeight, data) {
  }

  function drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, value, color, label) {
    const normalized = clamp(Number(value) / 100, 0, 1);
    const y = padding.top + chartHeight - normalized * chartHeight;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(padding.left + chartWidth, y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = "800 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${label} ${Math.round(value)}%`, padding.left + chartWidth - 8, y - 8);
    ctx.textAlign = "left";
    ctx.restore();
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
      const previous = points[i - 1];
      const current = points[i];
      const midX = (previous.x + current.x) / 2;

      ctx.bezierCurveTo(midX, previous.y, midX, current.y, current.x, current.y);
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
    ctx.font = "800 18px Inter, system-ui, sans-serif";
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
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
