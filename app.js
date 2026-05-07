const calibrateButton = document.getElementById("calibrateButton");
const resetButton = document.getElementById("resetButton");
const pauseButton = document.getElementById("pauseButton");
const startButton = document.getElementById("startButton");
const startOverlay = document.getElementById("startOverlay");
const responseOverlay = document.getElementById("responseOverlay");
const settingsButton = document.getElementById("settingsButton");
const closeSettingsButton = document.getElementById("closeSettingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const runStatus = document.getElementById("runStatus");
const stage = document.getElementById("stage");
const centerStimulus = document.getElementById("centerStimulus");
const noiseMask = document.getElementById("noiseMask");
const directionPreview = document.getElementById("directionPreview");
const sectorOverlay = document.getElementById("sectorOverlay");
const sectorHighlight = document.getElementById("sectorHighlight");
const promptText = document.getElementById("promptText");
const choiceRow = document.getElementById("choiceRow");
const feedbackText = document.getElementById("feedbackText");
const levelTitle = document.getElementById("levelTitle");
const durationStat = document.getElementById("durationStat");
const accuracyStat = document.getElementById("accuracyStat");
const trialStat = document.getElementById("trialStat");
const refreshStat = document.getElementById("refreshStat");
const levelSelect = document.getElementById("levelSelect");
const responseStyleSelect = document.getElementById("responseStyleSelect");
const stimulusAreaSelect = document.getElementById("stimulusAreaSelect");
const directionCountInput = document.getElementById("directionCountInput");
const choiceCountInput = document.getElementById("choiceCountInput");
const autoProgressInput = document.getElementById("autoProgressInput");
const trialsToCheckInput = document.getElementById("trialsToCheckInput");
const rangeSlider = document.getElementById("rangeSlider");
const targetAccuracyInput = document.getElementById("targetAccuracyInput");
const regressAccuracyInput = document.getElementById("regressAccuracyInput");
const startDurationInput = document.getElementById("startDurationInput");
const minDurationInput = document.getElementById("minDurationInput");
const maxDurationInput = document.getElementById("maxDurationInput");
const fixationInput = document.getElementById("fixationInput");
const maskInput = document.getElementById("maskInput");
const symbolMaskInput = document.getElementById("symbolMaskInput");
const maskDensityInput = document.getElementById("maskDensityInput");
const correctDelayInput = document.getElementById("correctDelayInput");
const missDelayInput = document.getElementById("missDelayInput");
const targetSymbolInput = document.getElementById("targetSymbolInput");
const distractorSymbolInput = document.getElementById("distractorSymbolInput");
const blurLettersInput = document.getElementById("blurLettersInput");
const letterBlurInput = document.getElementById("letterBlurInput");
const hotkeysInput = document.getElementById("hotkeysInput");
const calmFieldInput = document.getElementById("calmFieldInput");
const distractorInput = document.getElementById("distractorInput");
const peripheralTargetInput = document.getElementById("peripheralTargetInput");
const resetSettingsButton = document.getElementById("resetSettingsButton");
const timerButton = document.getElementById("timerButton");
const timerReadout = document.getElementById("timerReadout");
const timerPanel = document.getElementById("timerPanel");
const timerMinutesInput = document.getElementById("timerMinutesInput");
const timerSetButton = document.getElementById("timerSetButton");
const timerClearButton = document.getElementById("timerClearButton");
const timerCloseButton = document.getElementById("timerCloseButton");
const timerStatusText = document.getElementById("timerStatusText");
const mobileWarning = document.getElementById("mobileWarning");
const mobileWarningContinue = document.getElementById("mobileWarningContinue");

const levelNames = ["Mode · Identification", "Mode · Divided Attention", "Mode · Selective Attention"];
const emojiGroups = [
  ["\uD83D\uDE0E", "\uD83D\uDE0F", "\uD83D\uDE44", "\uD83D\uDE10"],
  ["\uD83D\uDE0A", "\uD83D\uDE0C", "\uD83E\uDD17", "\uD83D\uDE0B"],
  ["\uD83D\uDE14", "\uD83D\uDE43", "\uD83D\uDE15", "\uD83E\uDD2D"],
  ["\uD83D\uDC3B", "\uD83D\uDC3C", "\uD83D\uDC28", "\uD83E\uDD8A"],
  ["\uD83D\uDC31", "\uD83D\uDC36", "\uD83D\uDC30", "\uD83D\uDC37"],
  ["\uD83E\uDD81", "\uD83D\uDC2F", "\uD83D\uDC38", "\uD83D\uDC35"]
];
const emojiPool = emojiGroups.flat();
const FLASH_DURATION_KEY = "ufov_current_flash_ms";
const SETTINGS_KEY = "ufov_settings";
const TIMER_MINUTES_KEY = "ufov_timer_minutes";
const TIMER_STATE_KEY = "ufov_timer_state";
const MOBILE_WARNING_SESSION_KEY = "ufov_mobile_warning_seen";

let state = createInitialState();
let pendingTimer = null;
let peripheralElements = [];
let decoyElements = [];
let sectorElements = [];
let selectedSectorElements = [];
let responseLock = true;
let sessionToken = 0;
let countdown = createCountdownState();
let countdownTimer = null;
let hoverDirection = null;

function createInitialState() {
  const settings = getSettings();
  return {
    running: false,
    paused: false,
    level: settings.level,
    trial: 0,
    levelTrial: 0,
    duration: loadSavedFlashDuration(settings),
    frameMs: 16.67,
    hardwareMinDuration: 16.67,
    correct: 0,
    total: 0,
    streak: 0,
    recent: [],
    levelRecent: [],
    progressBlock: [],
    current: null,
    response: { center: null, peripherals: [] },
    awaitingPeripheral: false
  };
}

function createCountdownState() {
  return {
    enabled: false,
    totalMs: 0,
    remainingMs: 0,
    lastTick: null
  };
}

function getSettings() {
  const minimum = readNumber(minDurationInput, 16, 4, 100);
  const maximum = Math.max(readNumber(maxDurationInput, 500, 50, 1500), minimum);
  const directionCount = readNumber(directionCountInput, 8, 4, 16);
  const targetLimit = Math.min(8, directionCount);
  return {
    level: readNumber(levelSelect, 3, 1, 3),
    responseStyle: responseStyleSelect ? responseStyleSelect.value : "twoStep",
    stimulusArea: stimulusAreaSelect ? stimulusAreaSelect.value : "circle",
    directionCount,
    choiceCount: readNumber(choiceCountInput, 10, 2, 10),
    autoProgress: autoProgressInput.checked,
    trialsToCheck: readNumber(trialsToCheckInput, 4, 1, 40),
    targetAccuracy: readNumber(targetAccuracyInput, 75, 50, 98) / 100,
    regressAccuracy: readNumber(regressAccuracyInput, 50, 10, 80) / 100,
    startDuration: clamp(readNumber(startDurationInput, 500, 16, 1000), minimum, maximum),
    minDuration: minimum,
    maxDuration: maximum,
    fixationMs: readNumber(fixationInput, 800, 0, 1500),
    maskMs: readNumber(maskInput, 90, 0, 500),
    symbolMask: symbolMaskInput ? symbolMaskInput.checked : false,
    maskDensity: readNumber(maskDensityInput, 140, 20, 400),
    correctDelayMs: readNumber(correctDelayInput, 650, 0, 2000),
    missDelayMs: readNumber(missDelayInput, 1000, 0, 3000),
    peripheralRange: readNumber(rangeSlider, 78, 36, 98),
    peripheralTargets: readNumber(peripheralTargetInput, 1, 1, targetLimit),
    distractors: readNumber(distractorInput, 18, 0, 47),
    targetSymbol: readSymbol(targetSymbolInput, "✕"),
    distractorSymbol: readSymbol(distractorSymbolInput, "Y"),
    blurLetters: blurLettersInput ? blurLettersInput.checked : false,
    letterBlur: readNumber(letterBlurInput, 2.5, 0, 12),
    hotkeys: hotkeysInput ? hotkeysInput.checked : true,
    targets: emojiPool
  };
}

function readSymbol(input, fallback) {
  if (!input) return fallback;
  const value = String(input.value || "").trim();
  return value.length ? value.slice(0, 4) : fallback;
}

function readNumber(input, fallback, min, max) {
  if (!input) return fallback;
  const value = Number(input.value);
  if (!Number.isFinite(value)) return fallback;
  return clamp(value, min, max);
}

function randomItem(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function shuffle(items) {
  return items.slice().sort(() => Math.random() - 0.5);
}

function loadSavedFlashDuration(settings) {
  try {
    const raw = localStorage.getItem(FLASH_DURATION_KEY);
    if (raw === null) return settings.startDuration;
    const saved = Number(raw);
    if (!Number.isFinite(saved) || saved <= 0) return settings.startDuration;
    return clamp(saved, Math.max(settings.minDuration, 4), settings.maxDuration);
  } catch (_) {
    return settings.startDuration;
  }
}

function saveFlashDuration() {
  try {
    localStorage.setItem(FLASH_DURATION_KEY, String(Math.round(state.duration)));
  } catch (_) {}
}

function wait(ms) {
  return new Promise((resolve) => {
    pendingTimer = window.setTimeout(resolve, ms);
  });
}

function nextFrame() {
  return new Promise((resolve) => requestAnimationFrame(resolve));
}

function getDirections() {
  const count = getSettings().directionCount;
  const eightLabels = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];
  const eightNames = ["East", "North-East", "North", "North-West", "West", "South-West", "South", "South-East"];
  const fourLabels = ["E", "N", "W", "S"];
  const fourNames = ["East", "North", "West", "South"];
  const labels = count === 8 ? eightLabels : count === 4 ? fourLabels : null;
  const names = count === 8 ? eightNames : count === 4 ? fourNames : null;
  return Array.from({ length: count }, (_, index) => {
    const angle = (360 / count) * index;
    return {
      index,
      label: labels ? labels[index] : String(index + 1),
      name: names ? names[index] : `Sector ${index + 1}`,
      angle
    };
  });
}

function getSectorWidth() {
  return 360 / getSettings().directionCount;
}

function getDirectionHotkey(direction) {
  const number = direction.index + 1;
  if (number >= 1 && number <= 9) return String(number);
  if (number === 10) return "0";
  return String(number);
}

function getKeyboardDirectionHotkey(direction) {
  const number = direction.index + 1;
  if (number >= 1 && number <= 9) return String(number);
  if (number === 10) return "0";
  return "";
}

function miniPositionFromDirection(angle, radiusPercent) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: `${50 + Math.cos(radians) * radiusPercent}%`,
    y: `${50 - Math.sin(radians) * radiusPercent}%`
  };
}

function svgPointFromDirection(centerX, centerY, radius, angle) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: centerX + Math.cos(radians) * radius,
    y: centerY - Math.sin(radians) * radius
  };
}

function describeSectorPath(angle, width, radius) {
  const start = angle - width / 2;
  const end = angle + width / 2;
  const startPoint = svgPointFromDirection(50, 50, radius, start);
  const endPoint = svgPointFromDirection(50, 50, radius, end);
  const largeArc = width > 180 ? 1 : 0;

  return [
    `M 50 50`,
    `L ${startPoint.x.toFixed(3)} ${startPoint.y.toFixed(3)}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${endPoint.x.toFixed(3)} ${endPoint.y.toFixed(3)}`,
    `Z`
  ].join(" ");
}

function createMiniSectorSvg(directions) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("mini-sector-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const radius = getSettings().stimulusArea === "full" ? 86 : 43.5;

  directions.forEach((direction) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("mini-sector-path");
    path.setAttribute("d", describeSectorPath(direction.angle, getSectorWidth(), radius));
    svg.appendChild(path);
  });

  return svg;
}

function directionKey(direction) {
  return `${direction.index}:${direction.label}`;
}

function directionSetKey(directions) {
  return directions.map(directionKey).sort().join(",");
}

function getRequiredPeripheralCount() {
  const settings = getSettings();
  return Math.min(settings.peripheralTargets, getDirections().length);
}

async function calibrateDisplay() {
  const token = sessionToken;
  feedbackText.className = "";
  feedbackText.textContent = "Calibrating refresh timing...";
  const samples = [];
  let last = await nextFrame();
  for (let i = 0; i < 80; i += 1) {
    if (token !== sessionToken) return;
    const now = await nextFrame();
    const delta = now - last;
    if (delta > 0 && delta < 40) samples.push(delta);
    last = now;
  }
  samples.sort((a, b) => a - b);
  const trimmed = samples.slice(8, -8);
  const average = trimmed.reduce((sum, value) => sum + value, 0) / trimmed.length || 16.67;
  state.frameMs = average;
  state.hardwareMinDuration = clamp(average, 4, 16.67);
  state.duration = clamp(state.duration, getEffectiveMinDuration(), getSettings().maxDuration);
  saveFlashDuration();
  feedbackText.textContent = `Display calibrated: ${Math.round(1000 / average)}Hz`;
  updateStats();
}

function startSession() {
  window.clearTimeout(pendingTimer);
  clearStage();
  sessionToken += 1;
  const token = sessionToken;
  state = createInitialState();
  state.running = true;
  countdown.lastTick = null;
  updateTimerUi();
  startOverlay.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  updateLayout();
  updateStats();
  calibrateDisplay().then(() => scheduleTrial(220, token));
}

function resetSession() {
  window.clearTimeout(pendingTimer);
  clearStage();
  sessionToken += 1;
  state = createInitialState();
  clearCountdown(false);
  startOverlay.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  responseOverlay.classList.remove("visible", "feedback-mode", "peripheral-chooser");
  promptText.className = "";
  promptText.textContent = "Press start.";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  updateLayout();
  updateStats();
}

function togglePause() {
  state.paused = !state.paused;
  if (state.paused) {
    window.clearTimeout(pendingTimer);
    clearStage();
    promptText.textContent = "Paused";
  } else {
    countdown.lastTick = null;
    scheduleTrial(120, sessionToken);
  }
  updateStats();
  updateTimerUi();
}

function scheduleTrial(delay, token) {
  pendingTimer = window.setTimeout(() => runTrial(token), delay);
}

function getSavedTimerMinutes() {
  try {
    const saved = Number(localStorage.getItem(TIMER_MINUTES_KEY));
    if (Number.isFinite(saved) && saved >= 1 && saved <= 240) return saved;
  } catch (_) {}
  return 15;
}

function saveTimerMinutes(minutes) {
  try {
    localStorage.setItem(TIMER_MINUTES_KEY, String(minutes));
  } catch (_) {}
}

function loadSavedCountdown() {
  try {
    const raw = localStorage.getItem(TIMER_STATE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    const totalMs = Number(saved.totalMs);
    const remainingMs = Number(saved.remainingMs);

    if (!Number.isFinite(totalMs) || !Number.isFinite(remainingMs)) return null;
    if (totalMs <= 0 || remainingMs <= 0) return null;

    return {
      enabled: saved.enabled !== false,
      totalMs: clamp(totalMs, 60 * 1000, 240 * 60 * 1000),
      remainingMs: clamp(remainingMs, 1, 240 * 60 * 1000),
      lastTick: null
    };
  } catch (_) {
    return null;
  }
}

function saveCountdownState() {
  try {
    if (!countdown.totalMs || countdown.remainingMs <= 0) {
      localStorage.removeItem(TIMER_STATE_KEY);
      return;
    }

    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
      enabled: countdown.enabled,
      totalMs: Math.round(countdown.totalMs),
      remainingMs: Math.round(countdown.remainingMs),
      savedAt: Date.now()
    }));
  } catch (_) {}
}

function initializeTimerControls() {
  if (timerMinutesInput) timerMinutesInput.value = String(getSavedTimerMinutes());
  const savedCountdown = loadSavedCountdown();
  if (savedCountdown) {
    countdown = savedCountdown;
    ensureCountdownTimer();
  }
  if (timerButton) timerButton.addEventListener("click", openTimerPanel);
  if (timerCloseButton) timerCloseButton.addEventListener("click", closeTimerPanel);
  if (timerSetButton) timerSetButton.addEventListener("click", setCountdownFromInput);
  if (timerClearButton) timerClearButton.addEventListener("click", () => clearCountdown(true));
  if (timerPanel) {
    timerPanel.addEventListener("click", (event) => {
      if (event.target === timerPanel) closeTimerPanel();
    });
  }
  updateTimerUi();
}

function openTimerPanel() {
  if (!timerPanel) return;
  timerPanel.classList.remove("hidden");
  updateTimerUi();
  if (timerMinutesInput) timerMinutesInput.select();
}

function closeTimerPanel() {
  if (timerPanel) timerPanel.classList.add("hidden");
}

function setCountdownFromInput() {
  const minutes = Math.round(readNumber(timerMinutesInput, getSavedTimerMinutes(), 1, 240));
  saveTimerMinutes(minutes);
  countdown = {
    enabled: true,
    totalMs: minutes * 60 * 1000,
    remainingMs: minutes * 60 * 1000,
    lastTick: null
  };
  saveCountdownState();
  ensureCountdownTimer();
  updateTimerUi();
  closeTimerPanel();
}

function clearCountdown(closePanel) {
  countdown = createCountdownState();
  try {
    localStorage.removeItem(TIMER_STATE_KEY);
  } catch (_) {}
  stopCountdownTimer();
  updateTimerUi();
  if (closePanel) closeTimerPanel();
}

function ensureCountdownTimer() {
  if (countdownTimer !== null) return;
  countdownTimer = window.setInterval(tickCountdown, 250);
}

function stopCountdownTimer() {
  if (countdownTimer !== null) {
    window.clearInterval(countdownTimer);
    countdownTimer = null;
  }
  countdown.lastTick = null;
}

function tickCountdown() {
  if (!countdown.enabled) {
    stopCountdownTimer();
    updateTimerUi();
    return;
  }

  if (!state.running || state.paused) {
    countdown.lastTick = null;
    saveCountdownState();
    updateTimerUi();
    return;
  }

  const now = performance.now();
  if (countdown.lastTick === null) {
    countdown.lastTick = now;
    updateTimerUi();
    return;
  }

  countdown.remainingMs -= now - countdown.lastTick;
  countdown.lastTick = now;

  if (countdown.remainingMs <= 0) {
    expireCountdown();
    return;
  }

  saveCountdownState();
  updateTimerUi();
}

function expireCountdown() {
  countdown.enabled = false;
  countdown.remainingMs = 0;
  saveCountdownState();
  stopCountdownTimer();
  window.clearTimeout(pendingTimer);
  sessionToken += 1;
  state.paused = true;
  clearStage();
  responseOverlay.classList.remove("combined-mode", "peripheral-chooser");
  responseOverlay.classList.add("visible", "feedback-mode");
  promptText.className = "feedback-title correct";
  promptText.textContent = "Timer done";
  feedbackText.className = "success";
  feedbackText.textContent = "Session paused. Take a break or press Resume to continue.";
  pauseButton.classList.remove("hidden");
  updateTimerUi();
  updateStats();
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function updateTimerUi() {
  const hasTimer = countdown.totalMs > 0 || countdown.remainingMs > 0;
  const active = countdown.enabled && countdown.remainingMs > 0;
  if (timerReadout) {
    timerReadout.textContent = hasTimer ? formatCountdown(countdown.remainingMs) : "";
    timerReadout.classList.toggle("hidden", !hasTimer);
    timerReadout.classList.toggle("paused", active && (!state.running || state.paused));
  }
  if (timerButton) timerButton.classList.toggle("active", hasTimer);
  if (timerStatusText) {
    if (!hasTimer) timerStatusText.textContent = "No timer set.";
    else if (!active) timerStatusText.textContent = "Timer finished.";
    else if (!state.running) timerStatusText.textContent = `Ready: ${formatCountdown(countdown.remainingMs)}. Starts when you press Start.`;
    else if (state.paused) timerStatusText.textContent = `Paused with app: ${formatCountdown(countdown.remainingMs)} left.`;
    else timerStatusText.textContent = `Running: ${formatCountdown(countdown.remainingMs)} left.`;
  }
}

async function runTrial(token) {
  if (!state.running || state.paused || token !== sessionToken) return;
  const settings = getSettings();
  responseLock = true;
  clearStage();
  updateLayout();
  state.trial += 1;
  state.levelTrial += 1;
  state.response = { center: null, peripherals: [] };
  state.awaitingPeripheral = false;
  state.current = createTrial();
  feedbackText.className = "";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible", "feedback-mode", "peripheral-chooser");
  promptText.textContent = "Focus on the +";
  updateStats();
  await wait(Math.max(settings.fixationMs, 0));
  if (!state.running || state.paused || token !== sessionToken) return;
  showStimuli(state.current);
  await holdStimulusForFrames(state.duration);
  if (!state.running || state.paused || token !== sessionToken) return;
  hideStimuli();
  showMask();
  await wait(settings.maskMs);
  if (!state.running || state.paused || token !== sessionToken) return;
  hideMask();
  presentResponseControls();
}

function createTrial() {
  const group = randomItem(emojiGroups);
  const center = randomItem(group);
  const decoys = group.filter((emoji) => emoji !== center);
  const decoy = randomItem(decoys);
  const allDirections = getDirections();
  const targetCount = getRequiredPeripheralCount();
  const usedDirections = [];
  for (let i = 0; i < targetCount; i += 1) {
    const available = allDirections.filter((direction) => !usedDirections.some((used) => used.index === direction.index));
    const direction = randomItem(available.length ? available : allDirections);
    usedDirections.push(direction);
  }
  return { center, decoy, direction: usedDirections[0], directions: usedDirections };
}

async function holdStimulusForFrames(duration) {
  const started = performance.now();
  let elapsed = 0;
  while (elapsed < duration) {
    await nextFrame();
    elapsed = performance.now() - started;
  }
}

function showStimuli(trial) {
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.add("hidden");
  centerStimulus.textContent = trial.center;
  centerStimulus.classList.add("visible");
  if (state.level >= 2) {
    const targetDirs = trial.directions || [trial.direction];
    targetDirs.forEach(createPeripheralTarget);
  }
  if (state.level === 3) createDistractors(trial.directions || [trial.direction]);
}

function hideStimuli() {
  centerStimulus.classList.remove("visible");
  peripheralElements.forEach((element) => element.classList.remove("visible"));
  decoyElements.forEach((element) => element.classList.remove("visible"));
}

function showMask() {
  noiseMask.innerHTML = "";
  if (getSettings().symbolMask) buildSymbolMask();
  noiseMask.classList.add("visible");
}

function hideMask() {
  noiseMask.classList.remove("visible");
  noiseMask.innerHTML = "";
}

function buildSymbolMask() {
  const settings = getSettings();
  const count = settings.maskDensity;
  const symbols = [settings.targetSymbol, settings.distractorSymbol];
  for (let i = 0; i < count; i += 1) {
    const symbol = document.createElement("span");
    symbol.className = "mask-symbol";
    symbol.textContent = randomItem(symbols);
    symbol.style.left = `${Math.random() * 100}%`;
    symbol.style.top = `${Math.random() * 100}%`;
    symbol.style.fontSize = `${14 + Math.random() * 22}px`;
    symbol.style.opacity = `${0.24 + Math.random() * 0.58}`;
    symbol.style.transform = `translate(-50%, -50%) rotate(${Math.random() * 360}deg)`;
    noiseMask.appendChild(symbol);
  }
}

function clearStage() {
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.remove("hidden");
  centerStimulus.classList.remove("visible");
  hideMask();
  hideDirectionPreview();
  stage.classList.remove("selecting-location");
  removeSectors();
  removeSelectedSectorMarks();
  peripheralElements.forEach((element) => element.remove());
  decoyElements.forEach((element) => element.remove());
  peripheralElements = [];
  decoyElements = [];
  responseLock = true;
}

function createPeripheralTarget(direction) {
  const element = document.createElement("div");
  element.className = "peripheral-target visible";
  element.textContent = getSettings().targetSymbol;
  const jitter = getSettings().stimulusArea === "full" ? 0.22 + Math.random() * 0.78 : 0.3 + Math.random() * 0.7;
  const position = positionFromDirection(direction.angle, getSettings().peripheralRange * jitter);
  element.style.left = position.x;
  element.style.top = position.y;
  stage.appendChild(element);
  peripheralElements.push(element);
}

function createDistractors(targetDirections) {
  const settings = getSettings();
  const directions = getDirections();
  if (settings.distractors <= 0) return;
  const placed = [];
  const targetKeys = new Set(targetDirections.map(directionKey));
  targetDirections.forEach((direction) => {
    const jitter = settings.stimulusArea === "full" ? 0.22 + Math.random() * 0.78 : 0.3 + Math.random() * 0.7;
    placed.push({ angle: direction.angle, radius: settings.peripheralRange * jitter });
  });
  const nonTargetDirs = directions.filter((direction) => !targetKeys.has(directionKey(direction)));
  const perDirCount = Math.min(nonTargetDirs.length, settings.distractors);
  for (let i = 0; i < perDirCount; i += 1) {
    const jitter = settings.stimulusArea === "full" ? 0.22 + Math.random() * 0.78 : 0.7 + Math.random() * 0.3;
    const direction = nonTargetDirs[i];
    const radius = settings.peripheralRange * jitter;
    placed.push({ angle: direction.angle, radius });
    addDecoy(direction.angle, radius);
  }
  for (let i = perDirCount; i < settings.distractors; i += 1) {
    let angle = 0;
    let radius = 0;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      angle = Math.random() * 360;
      radius = 12 + Math.random() * (settings.peripheralRange - 12);
      const tooClose = placed.some((point) => {
        const angleDistance = Math.min(Math.abs(angle - point.angle), 360 - Math.abs(angle - point.angle));
        const radiusDistance = Math.abs(radius - point.radius);
        return angleDistance < 20 && radiusDistance < 10;
      });
      if (!tooClose) break;
    }
    placed.push({ angle, radius });
    addDecoy(angle, radius);
  }
}

function addDecoy(angle, radius) {
  const element = document.createElement("div");
  element.className = "decoy visible";
  element.textContent = getSettings().distractorSymbol;
  const position = positionFromDirection(angle, radius);
  element.style.left = position.x;
  element.style.top = position.y;
  stage.appendChild(element);
  decoyElements.push(element);
}

function radiusPxFromRange(rangePercent) {
  const rect = stage.getBoundingClientRect();
  const settings = getSettings();
  if (settings.stimulusArea === "full") {
    return (Math.hypot(rect.width, rect.height) / 2) * (rangePercent / 100);
  }
  const minSide = Math.min(rect.width, rect.height);
  return (minSide / 2) * (rangePercent / 100);
}

function positionFromDirection(angle, radiusPercent) {
  const rect = stage.getBoundingClientRect();
  const radians = (angle * Math.PI) / 180;
  const radiusPx = radiusPxFromRange(radiusPercent);
  const margin = Math.max(34, Math.min(rect.width, rect.height) * 0.035);
  const x = rect.width / 2 + Math.cos(radians) * radiusPx;
  const y = rect.height / 2 - Math.sin(radians) * radiusPx;
  return {
    x: `${clamp(x, margin, rect.width - margin)}px`,
    y: `${clamp(y, margin, rect.height - margin)}px` 
  };
}

function presentResponseControls() {
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.add("hidden");
  if (state.level >= 2 && getSettings().responseStyle === "combined") {
    presentCombinedChoices();
    return;
  }
  responseOverlay.classList.remove("combined-mode");
  choiceRow.classList.remove("combined");
  responseLock = false;
  responseOverlay.classList.add("visible");
  responseOverlay.classList.remove("feedback-mode", "peripheral-chooser");
  promptText.className = "";
  promptText.textContent = "Which emoji was in the center?";
  choiceRow.innerHTML = "";
  const choices = shuffle([state.current.center, state.current.decoy]);
  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-button emoji-choice";
    button.type = "button";
    button.textContent = choice;
    button.dataset.hotkey = String(index + 1);
    button.title = `Hotkey ${index + 1}`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitCenter(choice);
    });
    const hint = document.createElement("span");
    hint.className = "hotkey-hint";
    hint.textContent = String(index + 1);
    button.appendChild(hint);
    choiceRow.appendChild(button);
  });
}

function presentCombinedChoices() {
  responseLock = false;
  responseOverlay.classList.add("visible");
  responseOverlay.classList.remove("peripheral-chooser");
  responseOverlay.classList.add("combined-mode");
  choiceRow.classList.add("combined");
  promptText.className = "";
  promptText.textContent = "Pick the emoji and location.";
  feedbackText.textContent = "Use number keys for fast reps.";
  choiceRow.innerHTML = "";
  const choices = buildCombinedChoices();
  const groups = new Map();

  choices.forEach((choice, index) => {
    const primaryDirection = getCombinedChoicePrimaryDirection(choice);
    const slot = getCombinedChoiceGridSlot(primaryDirection);
    const groupKey = `${slot.row}:${slot.column}`;
    let group = groups.get(groupKey);

    if (!group) {
      group = document.createElement("div");
      group.className = "combined-direction-group";
      group.style.gridRow = String(slot.row);
      group.style.gridColumn = String(slot.column);
      group.dataset.stackSize = "0";
      groups.set(groupKey, group);
      choiceRow.appendChild(group);
    }

    const button = document.createElement("button");
    button.className = "combined-choice";
    button.type = "button";
    const hotkey = index === 9 ? "0" : String(index + 1);
    button.dataset.hotkey = hotkey;
    button.dataset.direction = primaryDirection.label;
    button.title = `Hotkey ${hotkey}`;
    renderCombinedChoice(button, choice, hotkey);
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitCombinedChoice(choice);
    });
    group.appendChild(button);
    group.dataset.stackSize = String(Math.min(10, group.children.length));
  });
}

function buildCombinedChoices() {
  const settings = getSettings();
  const count = Math.min(settings.choiceCount, 10);
  const correctDirections = state.current.directions || [state.current.direction];
  const targetCount = getRequiredPeripheralCount();
  const choices = [];
  const seen = new Set();
  const addChoice = (center, directions) => {
    const key = `${center}|${directionSetKey(directions)}`;
    if (seen.has(key)) return;
    seen.add(key);
    choices.push({ center, directions });
  };
  addChoice(state.current.center, correctDirections);
  const correctChoice = choices[0];
  addChoice(state.current.decoy, correctDirections);

  const distractorDirectionSets = getSpatialDistractorDirectionSets(targetCount, correctDirections);
  let alternateCenter = 0;
  while (choices.length < count && distractorDirectionSets.length) {
    const center = alternateCenter % 2 === 0 ? state.current.center : state.current.decoy;
    addChoice(center, distractorDirectionSets.shift());
    alternateCenter += 1;
  }

  while (choices.length < count) {
    const center = Math.random() < 0.55 ? randomItem([state.current.center, state.current.decoy]) : randomItem(emojiPool);
    addChoice(center, randomDirectionSet(targetCount, Math.random() < 0.35 ? correctDirections : []));
  }

  return sortCombinedChoicesSpatially([correctChoice, ...choices.filter((choice) => choice !== correctChoice)].slice(0, count));
}

function getSpatialDistractorDirectionSets(count, correctDirections) {
  const correctKey = directionSetKey(correctDirections);
  const directions = getDirections();
  const seen = new Set([correctKey]);

  if (count <= 1) {
    return shuffle(directions)
      .map((direction) => [direction])
      .filter((set) => directionSetKey(set) !== correctKey);
  }

  const sets = [];
  for (let attempt = 0; attempt < 160 && sets.length < directions.length * 2; attempt += 1) {
    const set = shuffle(directions).slice(0, count);
    const key = directionSetKey(set);
    if (seen.has(key)) continue;
    seen.add(key);
    sets.push(set);
  }
  return sets;
}

function getCombinedChoicePrimaryDirection(choice) {
  return choice.directions && choice.directions[0] ? choice.directions[0] : getDirections()[0];
}

function getCombinedChoiceGridSlot(direction) {
  const radians = (direction.angle * Math.PI) / 180;
  return {
    column: clamp(Math.round(2 + Math.cos(radians)), 1, 3),
    row: clamp(Math.round(2 - Math.sin(radians)), 1, 3)
  };
}

function sortCombinedChoicesSpatially(choices) {
  return choices.slice().sort((a, b) => {
    const directionA = getCombinedChoicePrimaryDirection(a);
    const directionB = getCombinedChoicePrimaryDirection(b);
    const slotA = getCombinedChoiceGridSlot(directionA);
    const slotB = getCombinedChoiceGridSlot(directionB);

    if (slotA.row !== slotB.row) return slotA.row - slotB.row;
    if (slotA.column !== slotB.column) return slotA.column - slotB.column;
    if (directionA.index !== directionB.index) return directionA.index - directionB.index;
    return (a.center || "").localeCompare(b.center || "");
  });
}

function randomDirectionSet(count, avoid = []) {
  const avoidKey = directionSetKey(avoid);
  const directions = getDirections();
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const picked = shuffle(directions).slice(0, count);
    if (!avoid.length || directionSetKey(picked) !== avoidKey) return picked;
  }
  return shuffle(directions).slice(0, count);
}

function renderCombinedChoice(button, choice, hotkey) {
  const stageMini = document.createElement("span");
  stageMini.className = `mini-stage ${getSettings().stimulusArea === "full" ? "full-field" : ""}`;
  choice.directions.forEach((direction) => {
    const sector = document.createElement("span");
    sector.className = "mini-sector";
    sector.style.setProperty("--sector-width", `${getSectorWidth()}deg`);
    sector.style.setProperty("--sector-offset", `${-getSectorWidth() / 2}deg`);
    sector.style.transform = `translate(-50%, -50%) rotate(${90 - direction.angle}deg)`;
    stageMini.appendChild(sector);
  });
  const center = document.createElement("span");
  center.className = "mini-center";
  center.textContent = choice.center;
  stageMini.appendChild(center);
  const label = document.createElement("span");
  label.className = "combined-label";
  label.innerHTML = `<span>${choice.directions.map((direction) => direction.label).join("+")}</span><span class="hotkey-hint">${hotkey}</span>`;
  button.appendChild(stageMini);
  button.appendChild(label);
}

function submitCombinedChoice(choice) {
  if (responseLock) return;
  state.response.center = choice.center;
  state.response.peripherals = choice.directions;
  finishTrial();
}

function submitCenter(choice) {
  if (responseLock) return;
  state.response.center = choice;
  if (state.level === 1) finishTrial();
  else presentPeripheralChooser();
}

function presentPeripheralChooser() {
  state.awaitingPeripheral = true;
  state.response.peripherals = [];
  responseLock = true;
  responseOverlay.classList.remove("combined-mode");
  choiceRow.classList.remove("combined");
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible");
  responseOverlay.classList.add("peripheral-chooser");
  stage.classList.add("selecting-location");
  const count = getRequiredPeripheralCount();
  promptText.textContent = count === 1 ? `Where was the ${getSettings().targetSymbol}?` : `Select all ${count} targets.`;
  promptText.className = "";
  feedbackText.textContent = count === 1 ? "Click a slice or use direction hotkeys." : `0/${count} selected`;
  responseOverlay.classList.add("visible");
  createSectors();
  window.setTimeout(() => {
    if (state.running && !state.paused && state.awaitingPeripheral && state.current) {
      responseLock = false;
    }
  }, 0);
}

function updateLayout() {
  const settings = getSettings();
  const rangePercent = settings.peripheralRange;
  const radiusPx = radiusPxFromRange(rangePercent);
  const sectorWidth = getSectorWidth();
  stage.style.setProperty("--peripheral-diameter", `${settings.stimulusArea === "full" ? Math.hypot(stage.clientWidth, stage.clientHeight) * 2 : radiusPx * 2}px`);
  stage.style.setProperty("--sector-width", `${sectorWidth}deg`);
  stage.style.setProperty("--sector-offset", `${-sectorWidth / 2}deg`);
  stage.style.setProperty("--letter-blur", `${settings.letterBlur}px`);
  stage.classList.toggle("full-field", settings.stimulusArea === "full");
  stage.classList.toggle("letter-blur", settings.blurLetters);
  const lines = sectorOverlay.querySelectorAll(".spoke-line");
  lines.forEach((line) => {
    line.style.width = `${settings.stimulusArea === "full" ? Math.hypot(stage.clientWidth, stage.clientHeight) : radiusPx}px`;
  });

  const chips = sectorOverlay.querySelectorAll(".direction-hotkey-chip");
  const labelRadius = settings.stimulusArea === "full" ? 38 : Math.min(92, settings.peripheralRange * 0.74);

  chips.forEach((chip) => {
    const direction = getDirections()[Number(chip.dataset.directionIndex)];
    if (!direction) return;

    const position = positionFromDirection(direction.angle, labelRadius);
    chip.style.left = position.x;
    chip.style.top = position.y;
  });
}

function createSectors() {
  removeSectors();

  const settings = getSettings();
  const rangePercent = settings.peripheralRange;
  const radiusPx = radiusPxFromRange(rangePercent);
  const lineWidth = settings.stimulusArea === "full" ? Math.hypot(stage.clientWidth, stage.clientHeight) : radiusPx;
  const sectorWidth = getSectorWidth();
  const labelRadius = settings.stimulusArea === "full" ? 38 : Math.min(92, settings.peripheralRange * 0.74);

  stage.style.setProperty("--sector-width", `${sectorWidth}deg`);
  stage.style.setProperty("--sector-offset", `${-sectorWidth / 2}deg`);

  getDirections().forEach((direction) => {
    const line = document.createElement("div");
    line.className = "spoke-line";
    line.style.width = `${lineWidth}px`;
    line.style.transform = `rotate(${-direction.angle - sectorWidth / 2}deg)`;
    sectorOverlay.appendChild(line);
    sectorElements.push(line);

    const chip = document.createElement("button");
    chip.className = "direction-hotkey-chip";
    chip.type = "button";
    chip.dataset.directionIndex = String(direction.index);

    const shownNumber = getDirectionHotkey(direction);
    const keyboardHotkey = getKeyboardDirectionHotkey(direction);

    chip.innerHTML = `<strong>${shownNumber}</strong><span>${direction.label}</span>`;
    chip.title = keyboardHotkey ? `${direction.name} · hotkey ${keyboardHotkey}` : direction.name;
    chip.setAttribute("aria-label", chip.title);

    const position = positionFromDirection(direction.angle, labelRadius);
    chip.style.left = position.x;
    chip.style.top = position.y;

    chip.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitPeripheralDirection(direction);
    });

    sectorOverlay.appendChild(chip);
    sectorElements.push(chip);
  });

  sectorOverlay.classList.add("visible");
}

function removeSectors() {
  sectorElements.forEach((element) => element.remove());
  sectorElements = [];
  sectorOverlay.classList.remove("visible");
}

function nearestDirection(clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = centerY - clientY;
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;
  return getDirections().reduce((best, direction) => {
    const distance = Math.min(Math.abs(angleDeg - direction.angle), 360 - Math.abs(angleDeg - direction.angle));
    return distance < best.distance ? { direction, distance } : best;
  }, { direction: getDirections()[0], distance: Infinity }).direction;
}

function canUseLocation(clientX, clientY) {
  const rect = stage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < 20) return false;
  if (getSettings().stimulusArea === "full") return true;
  return distance <= radiusPxFromRange(getSettings().peripheralRange) + 10;
}

function updateHoverDirection(event) {
  if (responseLock || state.level === 1 || !state.current || !state.awaitingPeripheral) return;
  if (!canUseLocation(event.clientX, event.clientY)) {
    hideDirectionPreview();
    return;
  }
  hoverDirection = nearestDirection(event.clientX, event.clientY);
  setDirectionPreview(hoverDirection);
}

function submitPeripheral(event) {
  if (responseLock || state.level === 1 || !state.current) return;
  if (!state.awaitingPeripheral) return;
  if (event.target.closest("button, input, select")) return;
  if (!canUseLocation(event.clientX, event.clientY)) return;
  submitPeripheralDirection(nearestDirection(event.clientX, event.clientY));
}

function submitPeripheralDirection(direction) {
  if (responseLock || state.level === 1 || !state.current || !state.awaitingPeripheral) return;
  const count = getRequiredPeripheralCount();
  const existingIndex = state.response.peripherals.findIndex((item) => item.index === direction.index);
  if (existingIndex >= 0) {
    state.response.peripherals.splice(existingIndex, 1);
  } else if (state.response.peripherals.length < count) {
    state.response.peripherals.push(direction);
  }
  updateSelectedSectorMarks();
  const selected = state.response.peripherals.length;
  feedbackText.className = "";
  feedbackText.textContent = count === 1 ? `Location selected: ${direction.name}` : `${selected}/${count} selected`;
  if (selected >= count) finishTrial();
}

function updateSelectedSectorMarks() {
  removeSelectedSectorMarks();
  state.response.peripherals.forEach(createSelectedSectorMark);
}

function createSelectedSectorMark(direction) {
  const mark = document.createElement("div");
  mark.className = "selected-sector";
  mark.style.setProperty("--sector-width", `${getSectorWidth()}deg`);
  mark.style.setProperty("--sector-offset", `${-getSectorWidth() / 2}deg`);
  mark.style.transform = `translate(-50%, -50%) rotate(${90 - direction.angle}deg)`;
  sectorOverlay.appendChild(mark);
  selectedSectorElements.push(mark);
}

function removeSelectedSectorMarks() {
  selectedSectorElements.forEach((element) => element.remove());
  selectedSectorElements = [];
}

function finishTrial() {
  responseLock = true;
  hideDirectionPreview();
  stage.classList.remove("selecting-location");
  responseOverlay.classList.remove("visible", "peripheral-chooser");
  state.awaitingPeripheral = false;
  removeSectors();
  removeSelectedSectorMarks();
  const centerCorrect = state.response.center === state.current.center;
  const peripheralCorrect = state.level === 1 || isPeripheralResponseCorrect();
  const correct = centerCorrect && peripheralCorrect;
  state.total += 1;
  state.correct += correct ? 1 : 0;
  state.streak = correct ? state.streak + 1 : 0;
  state.recent.push(correct);
  state.levelRecent.push(correct);
  state.progressBlock.push({ correct, centerCorrect, peripheralCorrect });
  if (state.recent.length > 20) state.recent.shift();
  while (state.levelRecent.length > getSettings().trialsToCheck) state.levelRecent.shift();
  showFeedback(correct, centerCorrect, peripheralCorrect);
  choiceRow.innerHTML = "";
  const progressResult = applyProgressionIfNeeded();
  if (progressResult && window.UFOVProgress) window.UFOVProgress.recordCheck(progressResult);
  updateStats();
  const feedbackDelay = correct ? getSettings().correctDelayMs : getSettings().missDelayMs;
  scheduleTrial(feedbackDelay, sessionToken);
}

function isPeripheralResponseCorrect() {
  const expected = state.current.directions || [state.current.direction];
  const selected = state.response.peripherals || [];
  if (selected.length !== expected.length) return false;
  return directionSetKey(selected) === directionSetKey(expected);
}

function showFeedback(correct, centerCorrect, peripheralCorrect) {
  responseOverlay.classList.remove("combined-mode");
  choiceRow.classList.remove("combined");
  responseOverlay.classList.add("visible", "feedback-mode");
  promptText.innerHTML = correct ? "Correct" : "Incorrect";
  promptText.className = correct ? "feedback-title correct" : "feedback-title incorrect";
  feedbackText.className = "";
  feedbackText.innerHTML = state.level === 1
    ? `Center: <em class="${centerCorrect ? "good" : "bad"}">${centerCorrect ? "correct" : "wrong"}</em><br>Next trial starting...` 
    : `Center: <em class="${centerCorrect ? "good" : "bad"}">${centerCorrect ? "correct" : "wrong"}</em><br>Peripheral: <em class="${peripheralCorrect ? "good" : "bad"}">${peripheralCorrect ? "correct" : "wrong"}</em><br>Next trial starting...`;
}

function resetProgressWindow() {
  state.levelRecent = [];
  state.levelTrial = 0;
  state.progressBlock = [];
  state.streak = 0;
}

function getEffectiveMinDuration() {
  return Math.max(getSettings().minDuration, state.hardwareMinDuration);
}

function applyProgressionIfNeeded() {
  const settings = getSettings();
  if (!settings.autoProgress) return null;
  const trialsToCheck = settings.trialsToCheck;
  while (state.levelRecent.length > trialsToCheck) state.levelRecent.shift();
  while (state.progressBlock.length > trialsToCheck) state.progressBlock.shift();
  if (state.levelRecent.length < trialsToCheck) return null;
  if (state.progressBlock.length < trialsToCheck) return null;
  const correctCount = state.levelRecent.filter(Boolean).length;
  const wrongCount = trialsToCheck - correctCount;
  const requiredCorrect = Math.ceil(settings.targetAccuracy * trialsToCheck);
  const requiredWrong = Math.floor((1 - settings.regressAccuracy) * trialsToCheck) + 1;
  const minimum = getEffectiveMinDuration();
  const maximum = settings.maxDuration;
  const frameStep = Math.max(state.frameMs, state.duration * 0.08);
  const flashBefore = Math.round(state.duration);
  let action = "stay";
  if (correctCount >= requiredCorrect) {
    const newDuration = clamp(state.duration - frameStep, minimum, maximum);
    if (Math.round(newDuration) < flashBefore) {
      state.duration = newDuration;
      action = "harder";
      feedbackText.className = "success";
      feedbackText.textContent = `Harder: ${Math.round(state.duration)}ms`;
    } else {
      feedbackText.className = "";
      feedbackText.textContent = `No change: ${flashBefore}ms (at limit)`;
    }
  } else if (wrongCount >= requiredWrong) {
    const newDuration = clamp(state.duration + frameStep, minimum, maximum);
    if (Math.round(newDuration) > flashBefore) {
      state.duration = newDuration;
      action = "easier";
      feedbackText.className = "fail";
      feedbackText.textContent = `Easier: ${Math.round(state.duration)}ms`;
    } else {
      feedbackText.className = "";
      feedbackText.textContent = `No change: ${flashBefore}ms (at limit)`;
    }
  } else {
    feedbackText.className = "";
    feedbackText.textContent = `No change: ${correctCount}/${trialsToCheck} correct`;
  }
  const centerCorrectCount = state.progressBlock.filter((item) => item.centerCorrect).length;
  const peripheralCorrectCount = state.progressBlock.filter((item) => item.peripheralCorrect).length;
  saveFlashDuration();
  const result = {
    mode: state.level,
    modeName: levelNames[state.level - 1],
    trials: trialsToCheck,
    flashBefore,
    flashAfter: Math.round(state.duration),
    accuracy: (correctCount / trialsToCheck) * 100,
    centerAccuracy: (centerCorrectCount / trialsToCheck) * 100,
    peripheralAccuracy: state.level === 1 ? 100 : (peripheralCorrectCount / trialsToCheck) * 100,
    correctCount,
    wrongCount,
    action,
    settings: {
      mode: state.level,
      responseStyle: settings.responseStyle,
      stimulusArea: settings.stimulusArea,
      directionCount: settings.directionCount,
      peripheralTargets: settings.peripheralTargets,
      distractors: settings.distractors,
      trialsToCheck: settings.trialsToCheck,
      targetAccuracy: Math.round(settings.targetAccuracy * 100),
      regressAccuracy: Math.round(settings.regressAccuracy * 100),
      minDuration: Math.round(settings.minDuration),
      maxDuration: Math.round(settings.maxDuration)
    }
  };
  resetProgressWindow();
  return result;
}

function updateStats() {
  if (levelTitle) levelTitle.textContent = levelNames[state.level - 1];
  durationStat.textContent = `${Math.round(state.duration)}ms`;
  trialStat.textContent = String(state.trial);
  accuracyStat.textContent = state.total ? `${Math.round((state.correct / state.total) * 100)}%` : "0%";
  refreshStat.textContent = state.frameMs ? `${Math.round(1000 / state.frameMs)}Hz` : "--Hz";
  if (runStatus) {
    runStatus.textContent = !state.running ? "Idle" : state.paused ? "Paused" : "Running";
    runStatus.classList.toggle("paused", state.paused);
  }
  pauseButton.textContent = state.paused ? "Resume" : "Pause";
}

function setDirectionPreview(direction) {
  const rangePercent = getSettings().stimulusArea === "full" ? 38 : getSettings().peripheralRange * 0.55;
  const position = positionFromDirection(direction.angle, rangePercent);
  directionPreview.textContent = `${getDirectionHotkey(direction)} · ${direction.name}`;
  directionPreview.style.left = position.x;
  directionPreview.style.top = position.y;
  directionPreview.classList.add("visible");
  sectorHighlight.style.setProperty("--sector-width", `${getSectorWidth()}deg`);
  sectorHighlight.style.setProperty("--sector-offset", `${-getSectorWidth() / 2}deg`);
  sectorHighlight.style.transform = `translate(-50%, -50%) rotate(${90 - direction.angle}deg)`;
  sectorHighlight.classList.add("active");
}

function hideDirectionPreview() {
  hoverDirection = null;
  directionPreview.classList.remove("visible");
  sectorHighlight.classList.remove("active");
  if (!responseOverlay.classList.contains("feedback-mode")) promptText.className = "";
}

function handleChoiceHotkey(key) {
  if (!getSettings().hotkeys) return false;
  if (responseLock) return false;
  const hotkey = key === "0" ? "0" : String(Number(key));
  if (hotkey === "0") {
    const button = choiceRow.querySelector('[data-hotkey="0"]');
    if (!button) return false;
    button.click();
    return true;
  }
  const number = Number(key);
  if (!Number.isInteger(number) || number < 1) return false;
  const button = choiceRow.querySelector(`[data-hotkey="${number}"]`);
  if (!button) return false;
  button.click();
  return true;
}

function directionFromKeyboard(event) {
  const directions = getDirections();
  const angleMap = {
    ArrowRight: 0,
    KeyD: 0,
    Numpad6: 0,
    KeyE: 45,
    Numpad9: 45,
    ArrowUp: 90,
    KeyW: 90,
    Numpad8: 90,
    KeyQ: 135,
    Numpad7: 135,
    ArrowLeft: 180,
    KeyA: 180,
    Numpad4: 180,
    KeyZ: 225,
    Numpad1: 225,
    ArrowDown: 270,
    KeyS: 270,
    Numpad2: 270,
    KeyC: 315,
    Numpad3: 315
  };
  if (event.code in angleMap) {
    const targetAngle = angleMap[event.code];
    return directions.reduce((best, direction) => {
      const distance = Math.min(Math.abs(targetAngle - direction.angle), 360 - Math.abs(targetAngle - direction.angle));
      return distance < best.distance ? { direction, distance } : best;
    }, { direction: directions[0], distance: Infinity }).direction;
  }
  if (event.key === "0" && directions.length >= 10) return directions[9];

  const numeric = Number(event.key);
  if (Number.isInteger(numeric) && numeric >= 1 && numeric <= Math.min(9, directions.length)) {
    return directions[numeric - 1];
  }

  return null;
}

function handleKeyboard(event) {
  const formTarget = event.target && event.target.closest && event.target.closest("input, select, textarea");
  if (formTarget) {
    if (event.key === "Escape") {
      settingsPanel.classList.remove("open");
      closeTimerPanel();
    }
    return;
  }
  if (event.key === " ") {
    event.preventDefault();
    if (state.running) togglePause();
    return;
  }
  if (event.key === "Escape") {
    settingsPanel.classList.remove("open");
    closeTimerPanel();
    return;
  }
  if (!getSettings().hotkeys) return;
  if (handleChoiceHotkey(event.key)) {
    event.preventDefault();
    return;
  }
  if (!state.awaitingPeripheral || responseLock) return;
  const direction = directionFromKeyboard(event);
  if (!direction) return;
  event.preventDefault();
  submitPeripheralDirection(direction);
}

function saveSettings() {
  const data = {};
  allSettingInputs.forEach((input) => {
    data[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
  } catch (_) {}
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    allSettingInputs.forEach((input) => {
      if (input.id in data) {
        if (input.type === "checkbox") input.checked = data[input.id];
        else input.value = data[input.id];
      }
    });
  } catch (_) {}
}

function applySettingExplainers() {
  const explainers = {
    levelSelect: "Choose which task is trained: center only, center plus location, or center plus location with distractors.",
    responseStyleSelect: "Two step keeps the old flow. Combined choices lets you answer emoji and direction in one click or number key.",
    stimulusAreaSelect: "Circle keeps targets in the ring. Full screen lets targets and distractors appear across the whole stage.",
    directionCountInput: "Controls how many direction slices are used for location choices.",
    choiceCountInput: "Controls how many combined answer cards appear when Combined choices is enabled.",
    autoProgressInput: "Automatically makes flash duration harder or easier based on recent accuracy.",
    trialsToCheckInput: "Number of recent trials used before changing difficulty.",
    targetAccuracyInput: "Accuracy needed to make the flash faster.",
    regressAccuracyInput: "Accuracy floor that makes the flash slower when performance drops.",
    startDurationInput: "Flash duration used at the start or after resetting saved duration.",
    minDurationInput: "Fastest flash duration the app can use.",
    maxDurationInput: "Slowest flash duration the app can use.",
    fixationInput: "How long the center fixation cross appears before stimuli flash.",
    maskInput: "How long the post-flash mask stays visible.",
    symbolMaskInput: "Fills the mask with the current target and distractor symbols to create real visual noise.",
    maskDensityInput: "How many symbols are placed into the mask noise screen.",
    correctDelayInput: "Delay after a correct response before the next trial.",
    missDelayInput: "Delay after a miss before the next trial.",
    targetSymbolInput: "The target symbol the player must find, for example X, V, P, or ✕.",
    distractorSymbolInput: "The non-target symbol used as noise, for example Y, U, or Q.",
    blurLettersInput: "Blurs target and distractor symbols to make letter discrimination harder.",
    letterBlurInput: "Strength of the symbol blur in pixels.",
    hotkeysInput: "Enables number-key choices and keyboard direction selection.",
    calmFieldInput: "A low-saturation cyan background.",
    peripheralTargetInput: "Number of peripheral targets that must be selected. If this is above 1, all targets must be selected correctly.",
    distractorInput: "Number of non-target symbols shown in selective attention mode.",
    rangeSlider: "How far from the center the peripheral stimuli can appear in circle mode."
  };
  Object.entries(explainers).forEach(([id, text]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.title = text;
    const label = input.closest("label");
    if (label) label.title = text;
  });
}

function applyInputSteps() {
  const steps = {
    startDurationInput: "10",
    minDurationInput: "10",
    maxDurationInput: "10",
    fixationInput: "50",
    maskInput: "10",
    correctDelayInput: "50",
    missDelayInput: "50",
    maskDensityInput: "10",
    targetAccuracyInput: "5",
    regressAccuracyInput: "5"
  };
  Object.entries(steps).forEach(([id, step]) => {
    const input = document.getElementById(id);
    if (input) input.step = step;
  });
}

const allSettingInputs = [
  levelSelect,
  responseStyleSelect,
  stimulusAreaSelect,
  directionCountInput,
  choiceCountInput,
  autoProgressInput,
  trialsToCheckInput,
  targetAccuracyInput,
  regressAccuracyInput,
  startDurationInput,
  minDurationInput,
  maxDurationInput,
  fixationInput,
  maskInput,
  symbolMaskInput,
  maskDensityInput,
  correctDelayInput,
  missDelayInput,
  targetSymbolInput,
  distractorSymbolInput,
  blurLettersInput,
  letterBlurInput,
  hotkeysInput,
  calmFieldInput,
  peripheralTargetInput,
  rangeSlider,
  distractorInput
].filter(Boolean);

startButton.addEventListener("click", startSession);
settingsButton.addEventListener("click", () => settingsPanel.classList.add("open"));
closeSettingsButton.addEventListener("click", () => settingsPanel.classList.remove("open"));
document.addEventListener("click", (event) => {
  if (!settingsPanel.classList.contains("open")) return;
  if (settingsPanel.contains(event.target)) return;
  if (settingsButton.contains(event.target)) return;
  settingsPanel.classList.remove("open");
});
calibrateButton.addEventListener("click", calibrateDisplay);
resetButton.addEventListener("click", resetSession);
pauseButton.addEventListener("click", togglePause);
stage.addEventListener("click", submitPeripheral);
stage.addEventListener("mousemove", updateHoverDirection);
stage.addEventListener("mouseleave", hideDirectionPreview);
levelSelect.addEventListener("change", () => {
  window.clearTimeout(pendingTimer);
  sessionToken += 1;
  state.level = readNumber(levelSelect, 1, 1, 3);
  state.levelTrial = 0;
  state.levelRecent = [];
  clearStage();
  updateStats();
  scheduleTrial(140, sessionToken);
});
[startDurationInput, minDurationInput, maxDurationInput].forEach((input) => {
  input.addEventListener("change", () => {
    const settings = getSettings();
    if (input === startDurationInput) state.duration = settings.startDuration;
    else state.duration = clamp(state.duration, getEffectiveMinDuration(), settings.maxDuration);
    saveFlashDuration();
    updateStats();
  });
});
window.addEventListener("keydown", handleKeyboard);
allSettingInputs.forEach((input) => {
  input.addEventListener("change", () => {
    saveSettings();
    updateLayout();
    applyCalmField();
  });
});
[levelSelect, autoProgressInput, trialsToCheckInput, targetAccuracyInput, regressAccuracyInput, directionCountInput, peripheralTargetInput].filter(Boolean).forEach((input) => {
  input.addEventListener("change", () => {
    resetProgressWindow();
    updateStats();
  });
});
rangeSlider.addEventListener("input", () => {
  saveSettings();
  updateLayout();
});
window.addEventListener("resize", updateLayout);
resetSettingsButton.addEventListener("click", () => {
  try { localStorage.removeItem(SETTINGS_KEY); } catch (_) {}
  try { localStorage.removeItem(FLASH_DURATION_KEY); } catch (_) {}
  const defaults = {
    levelSelect: "3",
    responseStyleSelect: "twoStep",
    stimulusAreaSelect: "circle",
    directionCountInput: "8",
    choiceCountInput: "10",
    autoProgressInput: true,
    trialsToCheckInput: "4",
    targetAccuracyInput: "75",
    regressAccuracyInput: "50",
    startDurationInput: "500",
    minDurationInput: "16",
    maxDurationInput: "500",
    fixationInput: "800",
    maskInput: "90",
    symbolMaskInput: true,
    maskDensityInput: "140",
    correctDelayInput: "650",
    missDelayInput: "1000",
    targetSymbolInput: "✕",
    distractorSymbolInput: "Y",
    blurLettersInput: false,
    letterBlurInput: "2.5",
    hotkeysInput: true,
    calmFieldInput: false,
    rangeSlider: "78",
    peripheralTargetInput: "1",
    distractorInput: "18"
  };
  allSettingInputs.forEach((input) => {
    if (input.id in defaults) {
      if (input.type === "checkbox") input.checked = defaults[input.id];
      else input.value = defaults[input.id];
    }
  });
  state.level = 3;
  state.levelTrial = 0;
  state.levelRecent = [];
  state.progressBlock = [];
  state.duration = Number(defaults.startDurationInput);
  saveFlashDuration();
  updateLayout();
  updateStats();
  saveSettings();
});

function updateChoiceCountVisibility() {
  const label = document.getElementById("choiceCountLabel");
  if (!label) return;
  const isCombined = responseStyleSelect && responseStyleSelect.value === "combined";
  label.classList.toggle("hidden", !isCombined);
}

function initializeMobileWarning() {
  if (!mobileWarning || !mobileWarningContinue) return;
  const isSmallOrTouch = window.matchMedia("(pointer: coarse), (max-width: 760px)").matches;
  if (!isSmallOrTouch) return;

  let alreadyShown = false;
  try {
    alreadyShown = sessionStorage.getItem(MOBILE_WARNING_SESSION_KEY) === "1";
  } catch (_) {}
  if (alreadyShown) return;

  mobileWarning.classList.add("visible");
  mobileWarningContinue.addEventListener("click", dismissMobileWarning);
  mobileWarning.addEventListener("click", (event) => {
    if (event.target === mobileWarning) dismissMobileWarning();
  });
}

function dismissMobileWarning() {
  if (mobileWarning) mobileWarning.classList.remove("visible");
  try {
    sessionStorage.setItem(MOBILE_WARNING_SESSION_KEY, "1");
  } catch (_) {}
}

function applyCalmField() {
  const enabled = calmFieldInput ? calmFieldInput.checked : false;
  document.body.classList.toggle("calm-field", enabled);
}

applyInputSteps();
applySettingExplainers();
loadSettings();
updateLayout();
applyCalmField();
initializeTimerControls();
initializeMobileWarning();
updateStats();
updateChoiceCountVisibility();

responseStyleSelect.addEventListener("change", updateChoiceCountVisibility);
