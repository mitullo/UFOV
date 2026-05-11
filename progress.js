window.UFOVProgress = (() => {
  const STORAGE_KEY = "ufov_progress_checks";
  const SESSION_STORAGE_KEY = "ufov_progress_sessions";
  const MAX_RECORDS = 300;
  const MAX_SESSIONS = 80;
  const CHART_BUCKET_MS = 8 * 60 * 60 * 1000;

  let modal = null;
  let activeTab = "recent";
  let chartTooltip = null;
  let activeChartTooltipKey = "";
  let chartHoverPoints = [];
  let chartRenderFrame = null;
  let chartResizeObserver = null;
  let expandedSessions = new Set();
  let chartAnimProgress = 1;
  let chartAnimFrame = null;

  const CHART_Y_MIN = -8;
  const CHART_Y_MAX = 105;

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

  function loadSessions() {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveSessions(sessions) {
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions.slice(-MAX_SESSIONS)));
    } catch (_) {}
  }

  function recordSession(session) {
    if (!session || !Array.isArray(session.trials) || !session.trials.length) return;

    const sessions = loadSessions();
    const id = session.id || (window.crypto && window.crypto.randomUUID
      ? window.crypto.randomUUID()
      : String(Date.now() + Math.random()));

    sessions.push({
      ...session,
      id,
      type: "session",
      date: session.endDate || Date.now()
    });

    saveSessions(sessions);
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
            <div class="activity-graph" id="activityGraph"></div>
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

      const chartWrap = chartCanvas.closest(".chart-wrap");
      if (chartWrap && "ResizeObserver" in window) {
        chartResizeObserver = new ResizeObserver(() => {
          if (activeTab === "chart" && modal && !modal.classList.contains("hidden")) {
            queueChartRender(loadHistory());
          }
        });
        chartResizeObserver.observe(chartWrap);
      }
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
    modal.classList.remove("hidden", "closing");
    void modal.offsetHeight;
    syncActiveTabUi();
    if (activeTab === "chart") {
      chartAnimProgress = 0;
      startChartAnimation();
    }
    render();
  }

  function close() {
    if (!modal || modal.classList.contains("hidden")) return;
    if (chartRenderFrame !== null) {
      cancelAnimationFrame(chartRenderFrame);
      chartRenderFrame = null;
    }
    if (chartAnimFrame) {
      cancelAnimationFrame(chartAnimFrame);
      chartAnimFrame = null;
    }
    chartAnimProgress = 1;
    hideChartTooltip();
    modal.classList.add("closing");
    window.setTimeout(() => {
      if (!modal || !modal.classList.contains("closing")) return;
      modal.classList.add("hidden");
      modal.classList.remove("closing");
    }, 180);
  }

  let clearConfirmTimer = null;

  function clearHistory() {
    const btn = modal ? modal.querySelector(".progress-clear") : null;
    if (!btn || btn.dataset.confirming !== "true") {
      if (btn) {
        btn.dataset.confirming = "true";
        btn.textContent = "Are you sure?";
      }
      clearTimeout(clearConfirmTimer);
      clearConfirmTimer = setTimeout(() => {
        if (btn) {
          btn.dataset.confirming = "";
          btn.textContent = "Clear history";
        }
      }, 3000);
      return;
    }

    clearTimeout(clearConfirmTimer);
    clearConfirmTimer = null;
    btn.dataset.confirming = "";
    btn.textContent = "Clear history";

    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (_) {}
    expandedSessions = new Set();
    render();
  }

  function setTab(tab) {
    activeTab = tab;

    if (tab === "chart") {
      chartAnimProgress = 0;
      startChartAnimation();
    }

    syncActiveTabUi();
    render();
  }

  function startChartAnimation() {
    if (chartAnimFrame) cancelAnimationFrame(chartAnimFrame);
    const duration = 420;
    const startTime = performance.now();
    const history = loadHistory();
    const sessions = loadSessions();

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      chartAnimProgress = 1 - Math.pow(1 - t, 3);

      renderChartCanvasOnly(history);

      if (t < 1) {
        chartAnimFrame = requestAnimationFrame(tick);
      } else {
        chartAnimFrame = null;
        renderChart(history, sessions);
      }
    }

    chartAnimFrame = requestAnimationFrame(tick);
  }

  function syncActiveTabUi() {
    if (!modal) return;

    modal.querySelectorAll(".progress-tab").forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === activeTab);
    });

    modal.querySelectorAll(".progress-panel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.panel !== activeTab);
    });
  }

  function render() {
    const history = loadHistory();
    const sessions = loadSessions();

    hideChartTooltip();
    renderTable(history, sessions);

    if (activeTab === "chart") {
      queueChartRender(history);
    }
  }

  function queueChartRender(history) {
    if (chartRenderFrame !== null) {
      cancelAnimationFrame(chartRenderFrame);
      chartRenderFrame = null;
    }

    const sessions = loadSessions();

    chartRenderFrame = requestAnimationFrame(() => {
      chartRenderFrame = requestAnimationFrame(() => {
        chartRenderFrame = null;
        renderChart(history, sessions);
      });
    });
  }

  function renderTable(history, sessions = []) {
    const body = document.getElementById("progressTableBody");
    if (!body) return;

    const items = [
      ...history.map((row) => ({ ...row, type: "check", date: row.date || 0 })),
      ...sessions.map((session) => ({ ...session, type: "session", date: session.endDate || session.date || 0 }))
    ]
      .sort((a, b) => Number(b.date || 0) - Number(a.date || 0))
      .slice(0, 120);

    if (!items.length) {
      body.innerHTML = `
        <tr>
          <td colspan="9" class="empty-progress">No progress checks or completed sessions yet.</td>
        </tr>
      `;
      return;
    }

    body.innerHTML = items.map((item) => {
      if (item.type === "session") return renderSessionRow(item);
      return renderCheckRow(item);
    }).join("");

    body.querySelectorAll(".progress-session-row").forEach((row) => {
      const toggle = () => {
        const sessionId = row.dataset.sessionId;
        if (!sessionId) return;
        if (expandedSessions.has(sessionId)) expandedSessions.delete(sessionId);
        else expandedSessions.add(sessionId);
        render();
      };

      row.addEventListener("click", toggle);
      row.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        toggle();
      });
    });
  }

  function renderCheckRow(row) {
    const actionLabel = getActionLabel(row.action);
    const actionClass = getActionClass(row.action);

    return `
      <tr class="progress-check-row">
        <td>${formatRelativeDate(row.date)}</td>
        <td>${escapeHtml(row.modeName || `Mode ${row.mode}`)}</td>
        <td>${escapeHtml(formatSettings(row))}</td>
        <td>${row.correctCount}/${row.trials}</td>
        <td>${formatFlashChange(row.flashBefore, row.flashAfter)}</td>
        <td><span class="badge-score ${scoreClass(row.accuracy)}">${Math.round(row.accuracy)}%</span></td>
        <td><span class="badge-score ${scoreClass(row.centerAccuracy)}">${Math.round(row.centerAccuracy)}%</span></td>
        <td><span class="badge-score ${scoreClass(row.peripheralAccuracy)}">${formatPeripheral(row)}</span></td>
        <td><span class="progress-action ${actionClass}">${actionLabel}</span></td>
      </tr>
    `;
  }

  function renderSessionRow(session) {
    const expanded = expandedSessions.has(session.id);
    const goal = formatSessionGoal(session);
    const settings = formatSettings(session);
    const total = Number(session.total || (session.trials ? session.trials.length : 0));
    const correctCount = Number(session.correctCount || 0);
    const duration = formatDuration(session.durationMs || ((session.endDate || session.date || 0) - (session.startDate || session.date || 0)));
    const details = expanded ? renderSessionDetails(session) : "";

    return `
      <tr class="progress-session-row ${expanded ? "expanded" : ""}" data-session-id="${escapeHtml(session.id)}" tabindex="0" role="button" aria-expanded="${expanded ? "true" : "false"}">
        <td><span class="session-caret">${expanded ? "▾" : "▸"}</span>${formatRelativeDate(session.date)}</td>
        <td><span class="session-pill">Session</span> ${escapeHtml(session.modeName || `Mode ${session.mode}`)}</td>
        <td><strong>${escapeHtml(goal)}</strong><span class="session-subline">${escapeHtml(settings)}</span></td>
        <td>${correctCount}/${total}</td>
        <td>${formatFlashChange(session.flashBefore, session.flashAfter)}</td>
        <td><span class="badge-score ${scoreClass(session.accuracy)}">${Math.round(session.accuracy || 0)}%</span></td>
        <td><span class="badge-score ${scoreClass(session.centerAccuracy)}">${Math.round(session.centerAccuracy || 0)}%</span></td>
        <td><span class="badge-score ${scoreClass(session.peripheralAccuracy)}">${formatPeripheral(session)}</span></td>
        <td><span class="progress-action session-complete">Done · ${escapeHtml(duration)}</span></td>
      </tr>
      ${details}
    `;
  }

  function renderSessionDetails(session) {
    const trials = Array.isArray(session.trials) ? session.trials : [];

    return `
      <tr class="progress-session-details">
        <td colspan="9">
          <div class="session-detail-card">
            <div class="session-detail-head">
              <strong>${escapeHtml(formatSessionGoal(session))}</strong>
              <span>${trials.length} trial${trials.length === 1 ? "" : "s"} · ${escapeHtml(formatAbsoluteDate(session.startDate || session.date))}</span>
            </div>
            <div class="session-trial-list">
              ${trials.map(renderSessionTrial).join("")}
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  function renderSessionTrial(trial) {
    const center = trial.centerCorrect ? "good" : "bad";
    const peripheral = trial.peripheralCorrect ? "good" : "bad";
    const result = trial.correct ? "good" : "bad";
    const location = Array.isArray(trial.expectedDirections) && trial.expectedDirections.length
      ? trial.expectedDirections.map((direction) => direction.label || direction.name || "?").join("+")
      : "—";

    return `
      <div class="session-trial-row">
        <span class="trial-index">#${Number(trial.index || 0)}</span>
        <span>${Math.round(trial.flash || 0)}ms</span>
        <span><i class="mini-result ${center}"></i>Center</span>
        <span><i class="mini-result ${peripheral}"></i>Peripheral ${escapeHtml(location)}</span>
        <strong class="trial-result ${result}">${trial.correct ? "Correct" : "Miss"}</strong>
      </div>
    `;
  }

  function formatFlashChange(before, after) {
    const start = Math.round(Number(before) || 0);
    const end = Math.round(Number(after) || start);
    return start === end ? `${end}ms` : `${start}ms → ${end}ms`;
  }

  function formatSessionGoal(session) {
    const goal = session.goal || {};
    if (goal.type === "time") return `Timer · ${formatDuration(goal.targetMs || 0)}`;
    if (goal.type === "correctTrials") return `Correct trials · ${goal.target || session.total || 0}`;
    if (goal.type === "allTrials") return `All trials · ${goal.target || session.total || 0}`;
    return "Completed session";
  }

  function formatDuration(ms) {
    const totalSeconds = Math.max(0, Math.round(Number(ms || 0) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  function sizeChartCanvas(canvas) {
    const wrap = canvas.closest(".chart-wrap");
    const rect = wrap ? wrap.getBoundingClientRect() : null;
    const availableWidth = rect && rect.width ? rect.width : (wrap ? wrap.clientWidth : 1120);
    const availableHeight = rect && rect.height ? rect.height : (wrap ? wrap.clientHeight : 430);
    const cssWidth = clamp(Math.round(availableWidth - 14), 720, 1380);
    const cssHeight = clamp(Math.round(availableHeight - 18), 320, 540);
    const pixelRatio = clamp(window.devicePixelRatio || 1, 1, 2);
    const pixelWidth = Math.round(cssWidth * pixelRatio);
    const pixelHeight = Math.round(cssHeight * pixelRatio);

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.dataset.chartWidth = String(cssWidth);
    canvas.dataset.chartHeight = String(cssHeight);
    canvas.dataset.chartPixelRatio = String(pixelRatio);
  }

  function percentToChartY(value, padding, chartHeight) {
    const safeValue = clamp(Number(value), CHART_Y_MIN, CHART_Y_MAX);
    const normalized = (safeValue - CHART_Y_MIN) / (CHART_Y_MAX - CHART_Y_MIN);
    return padding.top + chartHeight - normalized * chartHeight;
  }

  function renderChartCanvasOnly(history) {
    const canvas = document.getElementById("progressCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const pixelRatio = Number(canvas.dataset.chartPixelRatio) || 1;
    const width = Number(canvas.dataset.chartWidth) || Math.round(canvas.width / pixelRatio);
    const height = Number(canvas.dataset.chartHeight) || Math.round(canvas.height / pixelRatio);
    const chartState = getChartData(history);
    const data = chartState.rows;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    if (!data.length) {
      drawCenteredText(ctx, "Complete a matching progress check to show a chart.", width, height);
      return;
    }

    const padding = {
      left: 72,
      right: 48,
      top: 46,
      bottom: 76
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const chartX = (index) => data.length === 1
      ? padding.left + chartWidth / 2
      : padding.left + (index / (data.length - 1)) * chartWidth;

    drawGrid(ctx, padding, chartWidth, chartHeight);
    drawPercentAxisLabels(ctx, padding, chartWidth, chartHeight);
    drawDateAxisLabels(ctx, padding, chartWidth, chartHeight, data);
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.targetAccuracy, "#fbbf24", "target");
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.regressAccuracy, "#fb7185", "regress");

    const difficultyPoints = data.map((row, index) => {
      const x = chartX(index);
      const value = difficultyScore(row, chartState.current);
      const y = percentToChartY(value, padding, chartHeight);
      return { x, y, row, index, metric: "Difficulty", value };
    });

    const accuracyPoints = data.map((row, index) => {
      const x = chartX(index);
      const value = Number(row.accuracy) || 0;
      const y = percentToChartY(value, padding, chartHeight);
      return { x, y, row, index, metric: "Accuracy", value };
    });

    const bottomY = padding.top + chartHeight;
    const animDiffPoints = difficultyPoints.map((p) => ({
      ...p,
      y: bottomY + (p.y - bottomY) * chartAnimProgress
    }));
    const animAccPoints = accuracyPoints.map((p) => ({
      ...p,
      y: bottomY + (p.y - bottomY) * chartAnimProgress
    }));

    drawLine(ctx, animDiffPoints, "#8b5cf6", 3);
    drawLine(ctx, animAccPoints, "#22c55e", 3);
    drawDots(ctx, animDiffPoints, "#8b5cf6", 4.5);
    drawDots(ctx, animAccPoints, "#22c55e", 4.5);
  }

  function renderChart(history, sessions) {
    const canvas = document.getElementById("progressCanvas");
    const passiveDates = document.getElementById("chartPassiveDates");
    if (!canvas) return;

    sizeChartCanvas(canvas);
    const ctx = canvas.getContext("2d");
    const pixelRatio = Number(canvas.dataset.chartPixelRatio) || 1;
    const width = Number(canvas.dataset.chartWidth) || Math.round(canvas.width / pixelRatio);
    const height = Number(canvas.dataset.chartHeight) || Math.round(canvas.height / pixelRatio);
    const chartState = getChartData(history);
    const data = chartState.rows;
    chartHoverPoints = [];

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingEnabled = false;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    const graph = document.getElementById("activityGraph");
    if (graph) {
      const activityHtml = renderActivityGraph(history, sessions);
      if (graph._ufovActivityHtml !== activityHtml) {
        graph.innerHTML = activityHtml;
        graph._ufovActivityHtml = activityHtml;
      }
    }

    if (passiveDates) {
      passiveDates.innerHTML = data.length ? renderChartDateRange(data) : "";
    }

    if (!data.length) {
      drawCenteredText(ctx, "Complete a matching progress check to show a chart.", width, height);
      return;
    }

    const padding = {
      left: 72,
      right: 48,
      top: 46,
      bottom: 76
    };

    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const chartX = (index) => data.length === 1
      ? padding.left + chartWidth / 2
      : padding.left + (index / (data.length - 1)) * chartWidth;

    drawGrid(ctx, padding, chartWidth, chartHeight);
    drawPercentAxisLabels(ctx, padding, chartWidth, chartHeight);
    drawDateAxisLabels(ctx, padding, chartWidth, chartHeight, data);
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.targetAccuracy, "#fbbf24", "target");
    drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, chartState.current.regressAccuracy, "#fb7185", "regress");

    const difficultyPoints = data.map((row, index) => {
      const x = chartX(index);
      const value = difficultyScore(row, chartState.current);
      const y = percentToChartY(value, padding, chartHeight);

      return {
        x,
        y,
        row,
        index,
        metric: "Difficulty",
        value
      };
    });

    const accuracyPoints = data.map((row, index) => {
      const x = chartX(index);
      const value = Number(row.accuracy) || 0;
      const y = percentToChartY(value, padding, chartHeight);

      return { x, y, row, index, metric: "Accuracy", value };
    });

    const bottomY = padding.top + chartHeight;
    const animDiffPoints = difficultyPoints.map((p) => ({
      ...p,
      y: bottomY + (p.y - bottomY) * chartAnimProgress
    }));
    const animAccPoints = accuracyPoints.map((p) => ({
      ...p,
      y: bottomY + (p.y - bottomY) * chartAnimProgress
    }));

    drawLine(ctx, animDiffPoints, "#8b5cf6", 3);
    drawLine(ctx, animAccPoints, "#22c55e", 3);
    drawDots(ctx, animDiffPoints, "#8b5cf6", 4.5);
    drawDots(ctx, animAccPoints, "#22c55e", 4.5);
    chartHoverPoints = [...difficultyPoints, ...accuracyPoints];
  }

  function handleChartHover(event) {
    if (!chartTooltip || !chartHoverPoints.length) return;

    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const scaleX = (Number(canvas.dataset.chartWidth) || rect.width) / rect.width;
    const scaleY = (Number(canvas.dataset.chartHeight) || rect.height) / rect.height;
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

    const tooltipKey = `${nearest.point.metric}:${nearest.point.index}:${nearest.point.row.date || ""}`;
    if (activeChartTooltipKey !== tooltipKey) {
      chartTooltip.innerHTML = renderChartTooltip(nearest.point);
      activeChartTooltipKey = tooltipKey;
    }
    chartTooltip.classList.remove("hidden");

    const wrap = canvas.closest(".chart-wrap");
    if (!wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const canvasLeft = canvasRect.left - wrapRect.left;
    const canvasTop = canvasRect.top - wrapRect.top;
    const pointCssX = nearest.point.x / scaleX;
    const pointCssY = nearest.point.y / scaleY;
    let left = canvasLeft + pointCssX + 14;
    let top = canvasTop + pointCssY + 14;

    const maxLeft = wrap.clientWidth - chartTooltip.offsetWidth - 10;
    const maxTop = wrap.clientHeight - chartTooltip.offsetHeight - 10;

    if (left > maxLeft) {
      left = canvasLeft + pointCssX - chartTooltip.offsetWidth - 14;
    }

    if (top > maxTop) {
      top = canvasTop + pointCssY - chartTooltip.offsetHeight - 14;
    }

    chartTooltip.style.left = `${clamp(Math.round(left), 10, Math.max(10, maxLeft))}px`;
    chartTooltip.style.top = `${clamp(Math.round(top), 10, Math.max(10, maxTop))}px`;
  }

  function hideChartTooltip() {
    activeChartTooltipKey = "";
    if (chartTooltip) chartTooltip.classList.add("hidden");
  }

  function renderChartTooltip(point) {
    const row = point.row;
    const flashText = formatChartFlashText(row);
    const bucketLine = row.isChartBucket
      ? `<span>Point: ${row.bucketCount} check${row.bucketCount === 1 ? "" : "s"} · ${escapeHtml(formatChartBucketRange(row))}</span>`
      : `<span>${escapeHtml(formatAbsoluteDate(row.date))}</span>`;

    const trialsLine = `Trials: ${row.correctCount}/${row.trials}`;
    const accuracyLine = `Accuracy: ${Math.round(row.accuracy)}% · Center: ${Math.round(row.centerAccuracy)}% · Peripheral: ${escapeHtml(formatPeripheral(row))}`;
    const flashLine = `Flash: ${escapeHtml(flashText)}`;
    const settingsLine = `Settings: ${escapeHtml(formatSettings(row))}`;
    const changeLine = `Change: ${escapeHtml(getActionLabel(row.action))}`;

    return `
      <strong>${escapeHtml(point.metric)} · ${Math.round(point.value)}%</strong>
      ${bucketLine}
      <span>${escapeHtml(row.modeName || `Mode ${row.mode}`)}</span>
      <span>${trialsLine}</span>
      <span>${flashLine}</span>
      <span>${accuracyLine}</span>
      <span>${settingsLine}</span>
      <span>${changeLine}</span>
    `;
  }

  function formatChartFlashText(row) {
    if (row.isChartBucket) {
      const average = Math.round(Number(row.flashAfter) || 0);
      const min = Math.round(Number(row.flashMin) || average);
      const max = Math.round(Number(row.flashMax) || average);
      return min === max ? `${average}ms avg` : `${average}ms avg · ${min}-${max}ms`;
    }

    return formatFlashChange(row.flashBefore, row.flashAfter);
  }

  function formatChartBucketRange(row) {
    const start = row.bucketStart || row.date;
    const end = row.bucketEnd || row.date;
    return `${formatAbsoluteDate(start)} - ${formatAbsoluteDate(end)}`;
  }

  function renderChartDateRange(data) {
    const first = data[0];
    const latest = data[data.length - 1];
    const sourceCount = data.reduce((sum, row) => sum + Number(row.bucketCount || 1), 0);

    return `
      <span>Showing <strong>${data.length}</strong> point${data.length === 1 ? "" : "s"} from <strong>${escapeHtml(formatChartDate(first.date))}</strong> to <strong>${escapeHtml(formatChartDate(latest.date))}</strong>.</span>
      <span>Grouped from <strong>${sourceCount}</strong> check${sourceCount === 1 ? "" : "s"}. Hover a dot for details.</span>
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

    if (exact.length >= 1) {
      return {
        rows: aggregateChartRows(exact, current).slice(-80),
        scope: "current settings",
        current
      };
    }

    const sameMode = history.filter((row) => Number(row.mode) === current.mode);

    return {
      rows: aggregateChartRows(sameMode, current).slice(-80),
      scope: "same mode",
      current
    };
  }

  function aggregateChartRows(rows, current) {
    const sorted = rows
      .filter((row) => Number.isFinite(Number(row.date)))
      .sort((a, b) => Number(a.date || 0) - Number(b.date || 0));

    const buckets = new Map();

    sorted.forEach((row) => {
      const date = Number(row.date || 0);
      const bucketId = getLocalChartBucketId(date);
      if (!buckets.has(bucketId)) buckets.set(bucketId, []);
      buckets.get(bucketId).push(row);
    });

    return Array.from(buckets.entries()).map(([bucketId, bucketRows]) => {
      const first = bucketRows[0];
      const latest = bucketRows[bucketRows.length - 1];
      const totalTrials = sumNumbers(bucketRows, "trials");
      const correctCount = sumNumbers(bucketRows, "correctCount");
      const wrongCount = sumNumbers(bucketRows, "wrongCount");
      const flashValues = bucketRows.map((row) => Number(row.flashAfter)).filter(Number.isFinite);
      const averageFlash = averageNumbers(flashValues, Number(latest.flashAfter) || Number(first.flashAfter) || 0);
      const weighted = (key) => weightedAverage(bucketRows, key, "trials");

      return {
        ...latest,
        id: `chart-bucket-${bucketId}`,
        isChartBucket: true,
        bucketCount: bucketRows.length,
        bucketStart: Number(first.date || 0),
        bucketEnd: Number(latest.date || 0),
        date: Number(latest.date || 0),
        mode: latest.mode,
        modeName: latest.modeName || first.modeName,
        settings: latest.settings || first.settings || current,
        trials: totalTrials || bucketRows.length,
        correctCount,
        wrongCount: wrongCount || Math.max(0, (totalTrials || bucketRows.length) - correctCount),
        accuracy: totalTrials > 0 ? (correctCount / totalTrials) * 100 : weighted("accuracy"),
        centerAccuracy: weighted("centerAccuracy"),
        peripheralAccuracy: weighted("peripheralAccuracy"),
        flashBefore: Number(first.flashBefore) || Number(first.flashAfter) || averageFlash,
        flashAfter: averageFlash,
        flashMin: flashValues.length ? Math.min(...flashValues) : averageFlash,
        flashMax: flashValues.length ? Math.max(...flashValues) : averageFlash,
        action: latest.action
      };
    });
  }

  function getLocalChartBucketId(timestamp) {
    const offsetMs = new Date(timestamp).getTimezoneOffset() * 60 * 1000;
    return Math.floor((timestamp - offsetMs) / CHART_BUCKET_MS);
  }

  function sumNumbers(rows, key) {
    return rows.reduce((sum, row) => {
      const value = Number(row[key]);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);
  }

  function averageNumbers(values, fallback = 0) {
    const safe = values.filter(Number.isFinite);
    if (!safe.length) return fallback;
    return safe.reduce((sum, value) => sum + value, 0) / safe.length;
  }

  function weightedAverage(rows, valueKey, weightKey) {
    let weightedSum = 0;
    let totalWeight = 0;

    rows.forEach((row) => {
      const value = Number(row[valueKey]);
      const weight = Math.max(1, Number(row[weightKey]) || 1);
      if (!Number.isFinite(value)) return;
      weightedSum += value * weight;
      totalWeight += weight;
    });

    return totalWeight > 0 ? weightedSum / totalWeight : 0;
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

  function renderActivityGraph(history, sessions) {
    const now = new Date();
    const totalDays = 365;
    const cellSize = 10;
    const cellGap = 2;
    const labelWidth = 30;
    const weekCount = Math.ceil(totalDays / 7);

    const dayCounts = {};
    const allRecords = [
      ...history.map((r) => ({ date: r.date || 0, trials: r.trials || 1 })),
      ...(sessions || []).map((s) => ({ date: s.date || 0, trials: (s.trials || []).length || 1 }))
    ];

    allRecords.forEach((r) => {
      const d = new Date(r.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dayCounts[key] = (dayCounts[key] || 0) + r.trials;
    });

    const maxCount = Math.max(1, ...Object.values(dayCounts));
    const levels = [0, 1, 15, 30, 45];

    function getLevel(count) {
      if (!count) return 0;
      const pct = (count / maxCount) * 100;
      if (pct < 15) return 1;
      if (pct < 30) return 2;
      if (pct < 45) return 3;
      return 4;
    }

    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - (totalDays - 1));
    const startDayOfWeek = startDate.getDay();
    const offsetDays = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    startDate.setDate(startDate.getDate() - offsetDays);

    const monthLabels = [];
    let lastMonth = -1;

    const cells = [];
    for (let week = 0; week < weekCount + 1; week++) {
      for (let day = 0; day < 7; day++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + week * 7 + day);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const count = dayCounts[key] || 0;
        const level = getLevel(count);
        const isFuture = d > now;

        if (!isFuture && d.getMonth() !== lastMonth && day === 0) {
          lastMonth = d.getMonth();
          monthLabels.push({ week, label: d.toLocaleString("en", { month: "short" }) });
        }

        if (!isFuture) {
          const dateLabel = d.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
          });
          const title = count
            ? `${dateLabel} · ${count} trial${count === 1 ? "" : "s"}`
            : `${dateLabel} · no activity`;
          cells.push(`
            <rect class="activity-cell level-${level}" x="${labelWidth + week * (cellSize + cellGap)}" y="${day * (cellSize + cellGap)}" width="${cellSize}" height="${cellSize}" rx="2" data-count="${count}" data-date="${escapeHtml(dateLabel)}" aria-label="${escapeHtml(title)}">
              <title>${escapeHtml(title)}</title>
            </rect>
          `);
        }
      }
    }

    const monthLabelEls = monthLabels.map((m) =>
      `<text x="${labelWidth + m.week * (cellSize + cellGap)}" y="-4" class="activity-month">${m.label}</text>`
    ).join("");

    const dayLabels = ["Mon", "", "Wed", "", "Fri", "", ""].map((label, i) =>
      label ? `<text x="${labelWidth - 5}" y="${i * (cellSize + cellGap) + cellSize * 0.75}" class="activity-day-label" text-anchor="end">${label}</text>` : ""
    ).join("");

    const svgWidth = labelWidth + (weekCount + 1) * (cellSize + cellGap);
    const svgHeight = 7 * (cellSize + cellGap) - cellGap;

    return `
      <div class="activity-graph-wrap">
        <svg class="activity-svg" viewBox="0 0 ${svgWidth} ${svgHeight + 16}" preserveAspectRatio="xMinYMin meet">
          <g transform="translate(0, 16)">
            ${dayLabels}
            ${monthLabelEls}
            ${cells.join("")}
          </g>
        </svg>
        <div class="activity-legend">
          <span class="activity-legend-label">Less</span>
          ${[0,1,2,3,4].map((l) => `<span class="activity-cell level-${l} activity-legend-cell"></span>`).join("")}
          <span class="activity-legend-label">More</span>
        </div>
      </div>
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

  function crispStrokePosition(value) {
    return Math.round(value) + 0.5;
  }

  function drawGrid(ctx, padding, chartWidth, chartHeight) {
    ctx.lineWidth = 1;

    [100, 75, 50, 25, 0].forEach((value) => {
      const y = crispStrokePosition(percentToChartY(value, padding, chartHeight));

      ctx.strokeStyle = value === 0 ? "rgba(255,255,255,0.28)" : "rgba(255,255,255,0.08)";
      ctx.beginPath();
      ctx.moveTo(crispStrokePosition(padding.left), y);
      ctx.lineTo(crispStrokePosition(padding.left + chartWidth), y);
      ctx.stroke();
    });

    const left = crispStrokePosition(padding.left);
    const right = crispStrokePosition(padding.left + chartWidth);
    const top = crispStrokePosition(padding.top);
    const bottom = crispStrokePosition(padding.top + chartHeight);

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, top);
    ctx.stroke();
  }

  function drawPercentAxisLabels(ctx, padding, chartWidth, chartHeight) {
    ctx.font = "700 13px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#a8a29e";
    ctx.textAlign = "right";

    [100, 75, 50, 25, 0].forEach((value) => {
      const y = Math.round(percentToChartY(value, padding, chartHeight));
      ctx.fillText(`${value}%`, Math.round(padding.left - 14), y + 5);
    });

    ctx.textAlign = "left";
  }

  function drawDateAxisLabels(ctx, padding, chartWidth, chartHeight, data) {
    if (!Array.isArray(data) || !data.length) return;

    const bottom = padding.top + chartHeight;
    const sameDayRange = data.length > 1 && data.every((row) => isSameCalendarDay(row.date, data[0].date));
    const labelIndexes = getDateAxisLabelIndexes(data.length, chartWidth);

    ctx.save();
    ctx.font = "800 11px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#8f8f8f";
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;

    labelIndexes.forEach((index) => {
      const row = data[index];
      const x = data.length === 1
        ? padding.left + chartWidth / 2
        : padding.left + (index / (data.length - 1)) * chartWidth;
      const tickX = crispStrokePosition(x);
      const y = crispStrokePosition(bottom);

      ctx.beginPath();
      ctx.moveTo(tickX, y);
      ctx.lineTo(tickX, y + 7);
      ctx.stroke();

      if (index === 0) ctx.textAlign = "left";
      else if (index === data.length - 1) ctx.textAlign = "right";
      else ctx.textAlign = "center";

      ctx.fillText(formatChartAxisDate(row, sameDayRange), Math.round(x), Math.round(bottom + 24));
    });

    ctx.restore();
  }

  function getDateAxisLabelIndexes(length, chartWidth) {
    if (length <= 0) return [];

    const maxLabels = Math.max(2, Math.min(8, Math.floor(chartWidth / 96)));
    if (length <= maxLabels) {
      return Array.from({ length }, (_, index) => index);
    }

    const indexes = new Set([0, length - 1]);
    for (let i = 1; i < maxLabels - 1; i += 1) {
      indexes.add(Math.round((i / (maxLabels - 1)) * (length - 1)));
    }

    return Array.from(indexes).sort((a, b) => a - b);
  }

  function isSameCalendarDay(a, b) {
    const first = new Date(a);
    const second = new Date(b);

    return first.getFullYear() === second.getFullYear()
      && first.getMonth() === second.getMonth()
      && first.getDate() === second.getDate();
  }

  function formatChartAxisDate(row, includeTime) {
    const timestamp = row && row.date ? row.date : Date.now();
    const date = new Date(timestamp);
    const dateText = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

    if (!includeTime) return dateText;

    const timeText = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });

    return `${dateText} ${timeText}`;
  }

  function drawHorizontalMarker(ctx, padding, chartWidth, chartHeight, value, color, label) {
    const y = crispStrokePosition(percentToChartY(value, padding, chartHeight));

    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.72;
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);

    ctx.beginPath();
    ctx.moveTo(crispStrokePosition(padding.left), y);
    ctx.lineTo(crispStrokePosition(padding.left + chartWidth), y);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.font = "800 12px Inter, system-ui, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`${label} ${Math.round(value)}%`, Math.round(padding.left + chartWidth - 8), Math.round(y - 8));
    ctx.textAlign = "left";
    ctx.restore();
  }

  function drawLine(ctx, points, color, width) {
    if (points.length < 2) return;

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

  function drawDots(ctx, points, color, radius = 4.5) {
    ctx.fillStyle = color;

    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
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
    if (Number(row.mode) === 1) return "—";
    return `${Math.round(Number(row.peripheralAccuracy) || 0)}%`;
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
    recordSession,
    open,
    close
  };
})();
