const calibrateButton = document.getElementById("calibrateButton");
const resetButton = document.getElementById("resetButton");
const pauseButton = document.getElementById("pauseButton");
const skipButton = document.getElementById("skipButton");
const openHotkeyPanelButton = document.getElementById("openHotkeyPanelButton");
const hotkeyPanel = document.getElementById("hotkeyPanel");
const hotkeySections = document.getElementById("hotkeySections");
const hotkeyHelp = document.getElementById("hotkeyHelp");
const hotkeyCloseButton = document.getElementById("hotkeyCloseButton");
const hotkeyDoneButton = document.getElementById("hotkeyDoneButton");
const hotkeyResetButton = document.getElementById("hotkeyResetButton");
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
const autoProgressInput = document.getElementById("autoProgressInput");
const trialsToCheckInput = document.getElementById("trialsToCheckInput");
const rangeSlider = document.getElementById("rangeSlider");
const rangeSliderValue = document.getElementById("rangeSliderValue");
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
const centerHotkeysInput = document.getElementById("centerHotkeysInput");
const splitKeyboardEmojiHotkeysInput = document.getElementById("splitKeyboardEmojiHotkeysInput");
const splitKeyboardClockwiseHotkeyInput = document.getElementById("splitKeyboardClockwiseHotkeyInput");
const splitKeyboardCounterClockwiseHotkeyInput = document.getElementById("splitKeyboardCounterClockwiseHotkeyInput");
const directionHotkeysInput = document.getElementById("directionHotkeysInput");
const pauseHotkeyInput = document.getElementById("pauseHotkeyInput");
const skipHotkeyInput = document.getElementById("skipHotkeyInput");
const holdWheelCancelHotkeyInput = document.getElementById("holdWheelCancelHotkeyInput");
const splitKeyboardDirectionHotkeysInput = document.getElementById("splitKeyboardDirectionHotkeysInput");
const calmFieldInput = document.getElementById("calmFieldInput");
const distractorInput = document.getElementById("distractorInput");
const peripheralTargetInput = document.getElementById("peripheralTargetInput");
const resetSettingsButton = document.getElementById("resetSettingsButton");
const timerButton = document.getElementById("timerButton");
const timerReadout = document.getElementById("timerReadout");
const timerPanel = document.getElementById("timerPanel");
const timerGoalModeSelect = document.getElementById("timerGoalModeSelect");
const timerMinutesInput = document.getElementById("timerMinutesInput");
const timerTrialsInput = document.getElementById("timerTrialsInput");
const timerMinutesField = document.getElementById("timerMinutesField");
const timerTrialsField = document.getElementById("timerTrialsField");
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
const TIMER_GOAL_MODE_KEY = "ufov_timer_goal_mode";
const TIMER_TRIAL_TARGET_KEY = "ufov_timer_trial_target";
const TRIAL_GOAL_STATE_KEY = "ufov_trial_goal_state";
const MOBILE_WARNING_SESSION_KEY = "ufov_mobile_warning_seen";
const DEFAULT_CENTER_CHOICE_HOTKEYS = ["A", "D"];
const DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS = ["ArrowLeft", "ArrowRight"];
const DEFAULT_SPLIT_KEYBOARD_CLOCKWISE_HOTKEY = "R";
const DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY = "F";
const DEFAULT_HOLD_WHEEL_CANCEL_HOTKEY = "X";
const DEFAULT_SPLIT_KEYBOARD_DIRECTION_HOTKEYS = "E=D; NE=E; N=W; NW=Q; W=A; SW=Z; S=S; SE=C";
const DEFAULT_DIRECTION_HOTKEYS = "E=D; NE=E; N=W; NW=Q; W=A; SW=Z; S=S; SE=C";
const DEFAULT_PAUSE_HOTKEY = "Space";
const DEFAULT_SKIP_HOTKEY = "Backspace";
const MIN_FLASH_DURATION_MS = 16;
const DIRECTION_HOTKEY_LABELS = ["E", "NE", "N", "NW", "W", "SW", "S", "SE"];
const FLASH_ADVANCE_MULTIPLIER = 0.8;
const FLASH_REGRESS_MULTIPLIER = 1 / FLASH_ADVANCE_MULTIPLIER;

let state = createInitialState();
let pendingTimer = null;
let peripheralElements = [];
let decoyElements = [];
let sectorElements = [];
let selectedSectorElements = [];
let occupiedStimulusPoints = [];
let responseLock = true;
let sessionToken = 0;
let countdown = createCountdownState();
let trialGoal = createTrialGoalState();
let activeSession = null;
let countdownTimer = null;
let hoverDirection = null;
let activeHotkeyCapture = null;
let splitKeyboardResponse = createSplitKeyboardResponseState();
let activeSplitKeyboardRefine = null;
let holdWheelResponse = createHoldWheelResponseState();

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
    hardwareMinDuration: MIN_FLASH_DURATION_MS,
    correct: 0,
    total: 0,
    streak: 0,
    recent: [],
    levelRecent: [],
    progressBlock: [],
    current: null,
    response: { center: null, peripherals: [] },
    skippable: false,
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

function createTrialGoalState() {
  return {
    enabled: false,
    mode: "allTrials",
    target: 0,
    completed: 0
  };
}

function createSplitKeyboardResponseState() {
  return {
    active: false,
    centerChoices: [],
    selectedCenter: null,
    selectedCenterIndex: -1,
    selectedDirections: [],
    requiredDirections: 0
  };
}

function createHoldWheelResponseState() {
  return {
    active: false,
    centerChoices: [],
    selectedCenter: null,
    selectedDirections: [],
    requiredDirections: 0,
    pointerId: null,
    sourceButton: null,
    wheelElement: null,
    wheelCenter: { x: 0, y: 0 },
    hoverDirection: null
  };
}

function getSettings() {
  const minimum = readNumber(minDurationInput, MIN_FLASH_DURATION_MS, MIN_FLASH_DURATION_MS, 100);
  const maximum = Math.max(readNumber(maxDurationInput, 500, 50, 1500), minimum);
  const directionCount = readNumber(directionCountInput, 8, 4, 16);
  const targetLimit = Math.min(8, directionCount);
  return {
    level: readNumber(levelSelect, 3, 1, 3),
    responseStyle: responseStyleSelect ? responseStyleSelect.value : "twoStep",
    stimulusArea: stimulusAreaSelect ? stimulusAreaSelect.value : "circle",
    directionCount,
    autoProgress: autoProgressInput.checked,
    trialsToCheck: readNumber(trialsToCheckInput, 4, 1, 40),
    targetAccuracy: readNumber(targetAccuracyInput, 75, 50, 98) / 100,
    regressAccuracy: readNumber(regressAccuracyInput, 50, 10, 80) / 100,
    startDuration: clamp(readNumber(startDurationInput, 500, MIN_FLASH_DURATION_MS, 1000), minimum, maximum),
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
    centerChoiceHotkeys: parseHotkeyList(centerHotkeysInput, DEFAULT_CENTER_CHOICE_HOTKEYS),
    splitKeyboardEmojiHotkeys: parseHotkeyList(splitKeyboardEmojiHotkeysInput, DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS),
    splitKeyboardClockwiseHotkey: readHotkey(splitKeyboardClockwiseHotkeyInput, DEFAULT_SPLIT_KEYBOARD_CLOCKWISE_HOTKEY),
    splitKeyboardCounterClockwiseHotkey: readHotkey(splitKeyboardCounterClockwiseHotkeyInput, DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY),
    holdWheelCancelHotkey: readHotkey(holdWheelCancelHotkeyInput, DEFAULT_HOLD_WHEEL_CANCEL_HOTKEY),
    splitKeyboardDirectionHotkeyMap: parseDirectionHotkeyMap(splitKeyboardDirectionHotkeysInput ? splitKeyboardDirectionHotkeysInput.value : DEFAULT_SPLIT_KEYBOARD_DIRECTION_HOTKEYS),
    directionHotkeyMap: parseDirectionHotkeyMap(directionHotkeysInput ? directionHotkeysInput.value : DEFAULT_DIRECTION_HOTKEYS),
    pauseHotkey: readHotkey(pauseHotkeyInput, DEFAULT_PAUSE_HOTKEY),
    skipHotkey: readHotkey(skipHotkeyInput, DEFAULT_SKIP_HOTKEY),
    calmField: calmFieldInput ? calmFieldInput.checked : false,
    targets: emojiPool
  };
}

function readSymbol(input, fallback) {
  if (!input) return fallback;
  const value = String(input.value || "").trim();
  return value.length ? value.slice(0, 4) : fallback;
}

function readHotkey(input, fallback) {
  if (!input) return normalizeHotkeyToken(fallback);
  const value = String(input.value || "").trim();
  return normalizeHotkeyToken(value || fallback);
}

function parseHotkeyList(input, fallback) {
  const raw = input ? String(input.value || "") : "";
  const parsed = raw
    .split(/[,;|]/)
    .map(normalizeHotkeyToken)
    .filter(Boolean);
  return parsed.length ? parsed : fallback.map(normalizeHotkeyToken);
}

function parseDirectionHotkeyMap(raw) {
  const source = String(raw || DEFAULT_DIRECTION_HOTKEYS);
  const map = {};

  source.split(";").forEach((entry) => {
    const [rawLabel, rawKeys] = entry.split("=");
    if (!rawLabel || !rawKeys) return;
    const label = rawLabel.trim().toUpperCase();
    const keys = rawKeys
      .split(/[,+/|]/)
      .map(normalizeHotkeyToken)
      .filter(Boolean);
    if (label && keys.length) map[label] = keys;
  });

  return Object.keys(map).length ? map : parseDirectionHotkeyMap(DEFAULT_DIRECTION_HOTKEYS);
}

function normalizeHotkeyToken(value) {
  const token = String(value || "").trim();
  if (!token) return "";
  const lower = token.toLowerCase().replace(/\s+/g, "");
  const aliases = {
    space: " ",
    spacebar: " ",
    esc: "escape",
    escape: "escape",
    enter: "enter",
    return: "enter",
    backspace: "backspace",
    del: "delete",
    delete: "delete",
    up: "arrowup",
    down: "arrowdown",
    left: "arrowleft",
    right: "arrowright"
  };
  if (aliases[lower]) return aliases[lower];
  return token.length === 1 ? token.toLowerCase() : lower;
}

function displayHotkey(hotkey) {
  const token = normalizeHotkeyToken(hotkey);
  const names = {
    " ": "Space",
    arrowup: "\u2191",
    arrowright: "\u2192",
    arrowdown: "\u2193",
    arrowleft: "\u2190",
    escape: "Esc",
    backspace: "Bksp",
    delete: "Del"
  };
  if (names[token]) return names[token];
  if (/^numpad\d$/i.test(token)) return `Num ${token.slice(-1)}`;
  if (/^key[a-z]$/i.test(token)) return token.slice(-1).toUpperCase();
  return token.length === 1 ? token.toUpperCase() : token;
}

function serializeHotkeyToken(hotkey) {
  const token = normalizeHotkeyToken(hotkey);
  const names = {
    " ": "Space",
    arrowup: "ArrowUp",
    arrowright: "ArrowRight",
    arrowdown: "ArrowDown",
    arrowleft: "ArrowLeft",
    escape: "Escape",
    enter: "Enter",
    backspace: "Backspace",
    delete: "Delete"
  };
  if (names[token]) return names[token];
  if (/^numpad\d$/i.test(token)) return `Numpad${token.slice(-1)}`;
  if (/^key[a-z]$/i.test(token)) return token.slice(-1).toUpperCase();
  return token.length === 1 ? token.toUpperCase() : token;
}

function escapeHtmlForTemplate(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function hotkeyFromEvent(event) {
  if (/^Numpad\d$/i.test(event.code)) return event.code;
  if (event.key === " ") return "Space";
  return event.key || event.code;
}

function eventHotkeyVariants(event) {
  const variants = new Set([normalizeHotkeyToken(event.key), normalizeHotkeyToken(event.code)]);
  const numpadDigit = /^Numpad(\d)$/i.exec(event.code);
  if (numpadDigit) variants.add(numpadDigit[1]);
  return variants;
}

function eventMatchesHotkey(event, hotkey) {
  return eventHotkeyVariants(event).has(normalizeHotkeyToken(hotkey));
}

function findHotkeyIndex(event, hotkeys) {
  const variants = eventHotkeyVariants(event);
  return hotkeys.findIndex((hotkey) => variants.has(normalizeHotkeyToken(hotkey)));
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
    return clamp(saved, Math.max(settings.minDuration, MIN_FLASH_DURATION_MS), settings.maxDuration);
  } catch (_) {
    return settings.startDuration;
  }
}

function loadSavedTrialGoal() {
  try {
    const raw = localStorage.getItem(TRIAL_GOAL_STATE_KEY);
    if (!raw) return null;

    const saved = JSON.parse(raw);
    const mode = ["allTrials", "correctTrials"].includes(saved.mode) ? saved.mode : "allTrials";
    const target = Math.round(clamp(Number(saved.target), 1, 999));
    const completed = Math.round(clamp(Number(saved.completed), 0, target));

    if (!Number.isFinite(target) || target <= 0) return null;

    return {
      enabled: saved.enabled !== false && completed < target,
      mode,
      target,
      completed
    };
  } catch (_) {
    return null;
  }
}

function saveFlashDuration() {
  try {
    localStorage.setItem(FLASH_DURATION_KEY, String(Math.round(state.duration)));
  } catch (_) {}
}

function saveTrialGoalState() {
  try {
    if (!trialGoal.target || trialGoal.target <= 0) {
      localStorage.removeItem(TRIAL_GOAL_STATE_KEY);
      return;
    }

    localStorage.setItem(TRIAL_GOAL_STATE_KEY, JSON.stringify({
      enabled: trialGoal.enabled,
      mode: trialGoal.mode,
      target: Math.round(trialGoal.target),
      completed: Math.round(trialGoal.completed),
      savedAt: Date.now()
    }));
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
  return displayHotkey(getDirectionHotkeys(direction)[0] || String(direction.index + 1));
}

function getKeyboardDirectionHotkey(direction) {
  return getDirectionHotkeys(direction).map(displayHotkey).join(", ");
}

function getDirectionHotkeys(direction) {
  const settings = getSettings();
  const labelKeys = settings.directionHotkeyMap[String(direction.label || "").toUpperCase()];
  if (labelKeys && labelKeys.length) return labelKeys;

  const number = direction.index + 1;
  const numericLabelKeys = settings.directionHotkeyMap[String(number)];
  if (numericLabelKeys && numericLabelKeys.length) return numericLabelKeys;
  if (number >= 1 && number <= 9) return [String(number)];
  if (number === 10) return ["0"];
  return [];
}

function getSplitKeyboardDirectionHotkeys(direction) {
  const settings = getSettings();
  const labelKeys = settings.splitKeyboardDirectionHotkeyMap[String(direction.label || "").toUpperCase()];
  if (labelKeys && labelKeys.length) return labelKeys;

  const number = direction.index + 1;
  const numericLabelKeys = settings.splitKeyboardDirectionHotkeyMap[String(number)];
  if (numericLabelKeys && numericLabelKeys.length) return numericLabelKeys;
  if (number >= 1 && number <= 9) return [String(number)];
  if (number === 10) return ["0"];
  return [];
}

function getSplitKeyboardDirectionHotkey(direction) {
  return displayHotkey(getSplitKeyboardDirectionHotkeys(direction)[0] || String(direction.index + 1));
}

function splitKeyboardDirectionFromConfiguredHotkey(event) {
  return getDirections().find((direction) => {
    return getSplitKeyboardDirectionHotkeys(direction).some((hotkey) => eventMatchesHotkey(event, hotkey));
  }) || null;
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

function directionFromConfiguredHotkey(event) {
  return getDirections().find((direction) => {
    return getDirectionHotkeys(direction).some((hotkey) => eventMatchesHotkey(event, hotkey));
  }) || null;
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
state.hardwareMinDuration = Math.max(MIN_FLASH_DURATION_MS, Math.min(average, 16.67));
state.duration = clamp(state.duration, getEffectiveMinDuration(), getSettings().maxDuration);
saveFlashDuration();
feedbackText.textContent = `Display calibrated: ${Math.round(1000 / average)}Hz`;
updateStats();
}

function startSession() {
window.clearTimeout(pendingTimer);
clearStage();
sessionToken += 1;
state.running = true;
state.paused = false;
const token = sessionToken;
state = createInitialState();
activeSession = null;
state.running = true;
ensureActiveSession();
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
  clearSessionGoal(false);
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
    state.skippable = false;
    setTrialCursorHidden(false);
    clearStage();
    promptText.textContent = "Paused";
  } else {
    countdown.lastTick = null;
    state.skippable = false;
    setTrialCursorHidden(true);
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

function getSavedTimerGoalMode() {
  try {
    const saved = localStorage.getItem(TIMER_GOAL_MODE_KEY);
    if (["time", "allTrials", "correctTrials"].includes(saved)) return saved;
  } catch (_) {}
  return "time";
}

function saveTimerGoalMode(mode) {
  try {
    localStorage.setItem(TIMER_GOAL_MODE_KEY, mode);
  } catch (_) {}
}

function getSavedTrialTarget() {
  try {
    const saved = Number(localStorage.getItem(TIMER_TRIAL_TARGET_KEY));
    if (Number.isFinite(saved) && saved >= 1 && saved <= 999) return saved;
  } catch (_) {}
  return 50;
}

function saveTrialTarget(target) {
  try {
    localStorage.setItem(TIMER_TRIAL_TARGET_KEY, String(target));
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
  if (timerGoalModeSelect) timerGoalModeSelect.value = getSavedTimerGoalMode();
  if (timerMinutesInput) timerMinutesInput.value = String(getSavedTimerMinutes());
  if (timerTrialsInput) timerTrialsInput.value = String(getSavedTrialTarget());

  const savedCountdown = loadSavedCountdown();
  const savedTrialGoal = loadSavedTrialGoal();

  if (savedTrialGoal) {
    trialGoal = savedTrialGoal;
    if (timerGoalModeSelect) timerGoalModeSelect.value = savedTrialGoal.mode;
  } else if (savedCountdown) {
    countdown = savedCountdown;
    if (timerGoalModeSelect) timerGoalModeSelect.value = "time";
    ensureCountdownTimer();
  }

  if (timerButton) timerButton.addEventListener("click", toggleTimerPanel);
  if (timerGoalModeSelect) timerGoalModeSelect.addEventListener("change", () => {
    saveTimerGoalMode(timerGoalModeSelect.value);
    updateTimerGoalFields();
  });
  if (timerCloseButton) timerCloseButton.addEventListener("click", closeTimerPanel);
  if (timerSetButton) timerSetButton.addEventListener("click", setSessionGoalFromInput);
  if (timerClearButton) timerClearButton.addEventListener("click", () => clearSessionGoal(true));
  document.addEventListener("pointerdown", (event) => {
    if (!timerPanel || timerPanel.classList.contains("hidden")) return;
    if (timerPanel.contains(event.target)) return;
    if (timerButton && timerButton.contains(event.target)) return;
    closeTimerPanel();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeTimerPanel();
  });

  updateTimerGoalFields();
  updateTimerUi();
}

function toggleTimerPanel() {
  if (!timerPanel) return;
  if (timerPanel.classList.contains("hidden")) openTimerPanel();
  else closeTimerPanel();
}

function openTimerPanel() {
  if (!timerPanel) return;
  timerPanel.classList.remove("hidden", "closing");
  updateTimerGoalFields();
  updateTimerUi();
  timerPanel.classList.add("open");
  if (timerGoalModeSelect && timerGoalModeSelect.value === "time" && timerMinutesInput) timerMinutesInput.select();
  if (timerGoalModeSelect && timerGoalModeSelect.value !== "time" && timerTrialsInput) timerTrialsInput.select();
}

function closeTimerPanel() {
  if (!timerPanel || timerPanel.classList.contains("hidden")) return;
  timerPanel.classList.add("closing");
  timerPanel.classList.remove("open");
  window.setTimeout(() => {
    if (!timerPanel.classList.contains("open")) timerPanel.classList.add("hidden");
    timerPanel.classList.remove("closing");
  }, 170);
}

function updateTimerGoalFields() {
  const mode = timerGoalModeSelect ? timerGoalModeSelect.value : "time";
  if (timerMinutesField) timerMinutesField.classList.toggle("hidden", mode !== "time");
  if (timerTrialsField) timerTrialsField.classList.toggle("hidden", mode === "time");
  if (timerSetButton) timerSetButton.textContent = mode === "time" ? "Set timer" : "Set goal";
}

function setSessionGoalFromInput() {
  const mode = timerGoalModeSelect ? timerGoalModeSelect.value : "time";
  saveTimerGoalMode(mode);
  activeSession = null;

  if (mode === "time") {
    const minutes = Math.round(readNumber(timerMinutesInput, getSavedTimerMinutes(), 1, 240));
    saveTimerMinutes(minutes);
    trialGoal = createTrialGoalState();
    saveTrialGoalState();
    countdown = {
      enabled: true,
      totalMs: minutes * 60 * 1000,
      remainingMs: minutes * 60 * 1000,
      lastTick: null
    };
    saveCountdownState();
    ensureCountdownTimer();
  } else {
    const target = Math.round(readNumber(timerTrialsInput, getSavedTrialTarget(), 1, 999));
    saveTrialTarget(target);
    clearCountdown(false);
    trialGoal = {
      enabled: true,
      mode,
      target,
      completed: 0
    };
    saveTrialGoalState();
  }

  updateTimerUi();
  closeTimerPanel();
}

function clearSessionGoal(closePanel) {
  clearCountdown(false);
  trialGoal = createTrialGoalState();
  activeSession = null;
  saveTrialGoalState();
  updateTimerUi();
  if (closePanel) closeTimerPanel();
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
  completeActiveSession("time");
  pauseSessionAfterGoal("Timer done", "Session paused. Take a break or press Resume to continue.");
}

function completeTrialGoal() {
  trialGoal.enabled = false;
  trialGoal.completed = trialGoal.target;
  saveTrialGoalState();
  const label = trialGoal.mode === "correctTrials" ? "correct trials" : "trials";
  completeActiveSession(trialGoal.mode);
  pauseSessionAfterGoal("Trial goal done", `Completed ${trialGoal.target} ${label}. Take a break or press Resume to continue.`);
}

function pauseSessionAfterGoal(title, message) {
  window.clearTimeout(pendingTimer);
  sessionToken += 1;
  state.paused = true;
  state.skippable = false;
  clearStage();
  responseOverlay.classList.remove("peripheral-chooser");
  responseOverlay.classList.add("visible", "feedback-mode");
  promptText.className = "feedback-title correct";
  promptText.textContent = title;
  feedbackText.className = "success";
  feedbackText.textContent = message;
  pauseButton.classList.remove("hidden");
  updateTimerUi();
  updateStats();
}

function advanceTrialGoal(correct) {
  if (!trialGoal.target || trialGoal.target <= 0) return false;
  if (!trialGoal.enabled || trialGoal.completed >= trialGoal.target) return false;

  const shouldCount = trialGoal.mode === "allTrials" || (trialGoal.mode === "correctTrials" && correct);
  if (shouldCount) {
    trialGoal.completed = Math.min(trialGoal.target, trialGoal.completed + 1);
    saveTrialGoalState();
  }

  updateTimerUi();

  if (trialGoal.completed >= trialGoal.target) {
    completeTrialGoal();
    return true;
  }

  return false;
}

function getSessionGoalSnapshot() {
  if (countdown.totalMs > 0 || countdown.remainingMs > 0) {
    return {
      type: "time",
      targetMs: Math.round(countdown.totalMs || countdown.remainingMs || 0),
      remainingMs: Math.round(countdown.remainingMs || 0)
    };
  }

  if (trialGoal.target > 0) {
    return {
      type: trialGoal.mode,
      target: Math.round(trialGoal.target),
      completed: Math.round(trialGoal.completed)
    };
  }

  return null;
}

function getProgressSettingsSnapshot(settings = getSettings()) {
  return {
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
  };
}

function ensureActiveSession() {
  const goal = getSessionGoalSnapshot();
  if (!goal) return null;

  if (!activeSession) {
    const settings = getSettings();
    activeSession = {
      id: window.crypto && window.crypto.randomUUID
        ? window.crypto.randomUUID()
        : String(Date.now() + Math.random()),
      startDate: Date.now(),
      mode: state.level,
      modeName: levelNames[state.level - 1],
      goal,
      settings: getProgressSettingsSnapshot(settings),
      flashBefore: Math.round(state.duration),
      flashAfter: Math.round(state.duration),
      trials: []
    };
  } else {
    activeSession.goal = goal;
  }

  return activeSession;
}

function compactDirection(direction) {
  if (!direction) return null;
  return {
    index: direction.index,
    label: direction.label,
    name: direction.name
  };
}

function recordSessionTrial(correct, centerCorrect, peripheralCorrect) {
  const session = ensureActiveSession();
  if (!session || !state.current) return;

  const expectedDirections = (state.current.directions || [state.current.direction]).map(compactDirection).filter(Boolean);
  const responseDirections = (state.response.peripherals || []).map(compactDirection).filter(Boolean);

  session.trials.push({
    index: session.trials.length + 1,
    date: Date.now(),
    mode: state.level,
    flash: Math.round(state.duration),
    correct,
    centerCorrect,
    peripheralCorrect,
    expectedCenter: state.current.center,
    responseCenter: state.response.center,
    expectedDirections,
    responseDirections
  });
}

function completeActiveSession(reason) {
  if (!activeSession || !Array.isArray(activeSession.trials) || !activeSession.trials.length) return;

  const trials = activeSession.trials;
  const total = trials.length;
  const correctCount = trials.filter((trial) => trial.correct).length;
  const centerCorrectCount = trials.filter((trial) => trial.centerCorrect).length;
  const peripheralCorrectCount = trials.filter((trial) => trial.peripheralCorrect).length;
  const endDate = Date.now();

  const completed = {
    ...activeSession,
    reason,
    endDate,
    date: endDate,
    durationMs: Math.max(0, endDate - activeSession.startDate),
    flashAfter: Math.round(state.duration),
    total,
    correctCount,
    wrongCount: total - correctCount,
    accuracy: total ? (correctCount / total) * 100 : 0,
    centerAccuracy: total ? (centerCorrectCount / total) * 100 : 0,
    peripheralAccuracy: state.level === 1 ? 100 : (total ? (peripheralCorrectCount / total) * 100 : 0),
    goal: {
      ...(activeSession.goal || {}),
      completed: activeSession.goal && activeSession.goal.type === "time"
        ? Math.max(0, Math.round((activeSession.goal.targetMs || 0) - (countdown.remainingMs || 0)))
        : Math.round(trialGoal.completed || total)
    }
  };

  if (window.UFOVProgress && typeof window.UFOVProgress.recordSession === "function") {
    window.UFOVProgress.recordSession(completed);
  }

  activeSession = null;
}

function formatCountdown(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatTrialGoal(mode, completed, target) {
  const prefix = mode === "correctTrials" ? "✓" : "";
  return `${prefix}${Math.round(completed)}/${Math.round(target)}`;
}

function updateTimerUi() {
  const hasTimeGoal = countdown.totalMs > 0 || countdown.remainingMs > 0;
  const activeTimeGoal = countdown.enabled && countdown.remainingMs > 0;
  const hasTrialGoal = trialGoal.target > 0;
  const activeTrialGoal = trialGoal.enabled && trialGoal.completed < trialGoal.target;
  const hasGoal = hasTimeGoal || hasTrialGoal;

  if (timerReadout) {
    if (hasTrialGoal) timerReadout.textContent = formatTrialGoal(trialGoal.mode, trialGoal.completed, trialGoal.target);
    else timerReadout.textContent = hasTimeGoal ? formatCountdown(countdown.remainingMs) : "";
    timerReadout.classList.toggle("hidden", !hasGoal);
    timerReadout.classList.toggle("paused", (activeTimeGoal || activeTrialGoal) && (!state.running || state.paused));
  }

  if (timerButton) timerButton.classList.toggle("active", hasGoal);

  if (timerStatusText) {
    if (hasTrialGoal) {
      const label = trialGoal.mode === "correctTrials" ? "correct trials" : "trials";
      const progress = formatTrialGoal(trialGoal.mode, trialGoal.completed, trialGoal.target);
      if (!activeTrialGoal) timerStatusText.textContent = `Goal finished: ${progress} ${label}.`;
      else if (!state.running) timerStatusText.textContent = `Ready: ${progress} ${label}. Starts when you press Start.`;
      else if (state.paused) timerStatusText.textContent = `Paused with app: ${progress} ${label}.`;
      else timerStatusText.textContent = `Running: ${progress} ${label}.`;
      return;
    }

    if (!hasTimeGoal) timerStatusText.textContent = "No goal set.";
    else if (!activeTimeGoal) timerStatusText.textContent = "Timer finished.";
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
  state.skippable = true;
  setTrialCursorHidden(true);
  feedbackText.className = "";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible", "feedback-mode", "peripheral-chooser");
  promptText.textContent = "Focus on the +";
  updateStats();
  try {
    await wait(Math.max(settings.fixationMs, 0));
    if (!state.running || state.paused || token !== sessionToken) return;
    const flashed = await flashStimuli(state.current, state.duration, token);
    if (!flashed || !state.running || state.paused || token !== sessionToken) return;
    await wait(settings.maskMs);
    if (!state.running || state.paused || token !== sessionToken) return;
    hideMask();
    presentResponseControls();
  } finally {
    setTrialCursorHidden(false);
  }
}

function setTrialCursorHidden(hidden) {
  document.body.classList.toggle("trial-flash-active", hidden);
}

function skipCurrentTrial() {
  if (!state.running || state.paused || !state.current || !state.skippable) return false;

  const token = ++sessionToken;
  window.clearTimeout(pendingTimer);
  setTrialCursorHidden(false);
  state.skippable = false;
  state.awaitingPeripheral = false;
  state.current = null;
  state.response = { center: null, peripherals: [] };
  state.trial = Math.max(0, state.trial - 1);
  state.levelTrial = Math.max(0, state.levelTrial - 1);
  clearStage();
  responseOverlay.classList.remove("peripheral-chooser");
  responseOverlay.classList.add("visible", "feedback-mode");
  promptText.className = "feedback-title";
  promptText.textContent = "Skipped";
  feedbackText.className = "";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  updateStats();
  scheduleTrial(350, token);
  return true;
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

async function flashStimuli(trial, duration, token) {
  prepareStimuli(trial);

  // Commit hidden DOM/layout before any symbol is made visible.
  await nextFrame();
  if (!isActiveTrialToken(token)) return false;

  // Reveal — this IS frame 0 of the flash window.
  revealStimuli();

  const frames = frameCountForDuration(duration);
  for (let i = 0; i < frames; i += 1) {
    await nextFrame();
    if (!isActiveTrialToken(token)) return false;
  }

  // Hide stimuli AND show mask in the same paint — no gap for afterimage to linger.
  hideStimuli();
  showMask();
  return true;
}

function frameCountForDuration(duration) {
  const frameMs = Number.isFinite(state.frameMs) && state.frameMs > 0 ? state.frameMs : 16.67;
  return Math.max(1, Math.round(Number(duration || 0) / frameMs));
}

function isActiveTrialToken(token) {
  return state.running && !state.paused && token === sessionToken;
}

function prepareStimuli(trial) {
  const fixation = document.getElementById("fixation");
  const fragment = document.createDocumentFragment();
  if (fixation) fixation.classList.add("hidden");
  occupiedStimulusPoints = [];
  centerStimulus.textContent = trial.center;
  centerStimulus.classList.remove("visible");
  if (state.level >= 2) {
    const targetDirs = trial.directions || [trial.direction];
    targetDirs.forEach((direction) => createPeripheralTarget(direction, fragment));
  }
  if (state.level === 3) createDistractors(trial.directions || [trial.direction], fragment);
  if (fragment.childNodes.length) stage.appendChild(fragment);
  prepareMask();
}

function revealStimuli() {
  centerStimulus.classList.add("visible");
  peripheralElements.forEach((element) => element.classList.add("visible"));
  decoyElements.forEach((element) => element.classList.add("visible"));
}

function hideStimuli() {
  centerStimulus.classList.remove("visible");
  peripheralElements.forEach((element) => element.classList.remove("visible"));
  decoyElements.forEach((element) => element.classList.remove("visible"));
}

function prepareMask() {
  noiseMask.innerHTML = "";
  if (getSettings().symbolMask) buildSymbolMask();
}

function showMask() {
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
  cleanupHoldWheelGesture(true);
  stage.classList.remove("selecting-location");
  removeSectors();
  removeSelectedSectorMarks();
  peripheralElements.forEach((element) => element.remove());
  decoyElements.forEach((element) => element.remove());
  occupiedStimulusPoints = [];
  peripheralElements = [];
  decoyElements = [];
  resetSplitKeyboardResponse();
  resetHoldWheelResponse();
  responseLock = true;
}

function createPeripheralTarget(direction, fragment = stage) {
  const settings = getSettings();
  const element = document.createElement("div");
  element.className = "peripheral-target";
  element.textContent = settings.targetSymbol;
  const jitter = settings.stimulusArea === "full" ? 0.22 + Math.random() * 0.78 : 0.3 + Math.random() * 0.7;
  const radius = settings.peripheralRange * jitter;
  const position = positionFromDirection(direction.angle, radius);
  element.style.left = position.x;
  element.style.top = position.y;
  fragment.appendChild(element);
  peripheralElements.push(element);
  occupiedStimulusPoints.push({ angle: direction.angle, radius });
}

function createDistractors(targetDirections, fragment = stage) {
  const settings = getSettings();
  const directions = getDirections();
  if (settings.distractors <= 0) return;
  const placed = occupiedStimulusPoints.slice();
  const targetKeys = new Set(targetDirections.map(directionKey));
  const nonTargetDirs = directions.filter((direction) => !targetKeys.has(directionKey(direction)));
  const perDirCount = Math.min(nonTargetDirs.length, settings.distractors);
  for (let i = 0; i < perDirCount; i += 1) {
    const jitter = settings.stimulusArea === "full" ? 0.22 + Math.random() * 0.78 : 0.7 + Math.random() * 0.3;
    const direction = nonTargetDirs[i];
    const radius = settings.peripheralRange * jitter;
    placed.push({ angle: direction.angle, radius });
    addDecoy(direction.angle, radius, fragment);
  }
  for (let i = perDirCount; i < settings.distractors; i += 1) {
    let angle = 0;
    let radius = 0;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      angle = Math.random() * 360;
      radius = 12 + Math.random() * (settings.peripheralRange - 12);
      const tooClose = placed.some((point) => {
        return polarDistance(angle, radius, point.angle, point.radius) < 18;
      });
      if (!tooClose) break;
    }
    placed.push({ angle, radius });
    addDecoy(angle, radius, fragment);
  }
}

function polarDistance(angleA, radiusA, angleB, radiusB) {
  const radiansA = (angleA * Math.PI) / 180;
  const radiansB = (angleB * Math.PI) / 180;
  const xA = Math.cos(radiansA) * radiusA;
  const yA = Math.sin(radiansA) * radiusA;
  const xB = Math.cos(radiansB) * radiusB;
  const yB = Math.sin(radiansB) * radiusB;
  return Math.hypot(xA - xB, yA - yB);
}

function addDecoy(angle, radius, fragment = stage) {
  const element = document.createElement("div");
  element.className = "decoy";
  element.textContent = getSettings().distractorSymbol;
  const position = positionFromDirection(angle, radius);
  element.style.left = position.x;
  element.style.top = position.y;
  fragment.appendChild(element);
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
  setTrialCursorHidden(false);
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.add("hidden");
  const responseStyle = getSettings().responseStyle;
  if (responseStyle === "splitKeyboard") {
    presentSplitKeyboardResponse();
    return;
  }
  if (responseStyle === "holdWheel") {
    presentHoldWheelResponse();
    return;
  }
  responseOverlay.classList.remove("split-keyboard-mode", "hold-wheel-mode");
  choiceRow.classList.remove("split-keyboard", "hold-wheel");
  responseLock = false;
  responseOverlay.classList.add("visible");
  responseOverlay.classList.remove("feedback-mode", "peripheral-chooser");
  promptText.className = "";
  promptText.textContent = "Which emoji was in the center?";
  choiceRow.innerHTML = "";
  const choices = shuffle([state.current.center, state.current.decoy]);
  const hotkeys = getSettings().centerChoiceHotkeys;
  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice-button emoji-choice";
    button.type = "button";
    button.textContent = choice;
    const hotkey = hotkeys[index] || String(index + 1);
    button.dataset.hotkey = hotkey;
    button.dataset.hotkeyIndex = String(index);
    button.title = `Hotkey ${displayHotkey(hotkey)}`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitCenter(choice);
    });
    const hint = document.createElement("span");
    hint.className = "hotkey-hint";
    hint.textContent = displayHotkey(hotkey);
    button.appendChild(hint);
    choiceRow.appendChild(button);
  });
}

function presentSplitKeyboardResponse() {
  responseLock = false;
  splitKeyboardResponse = createSplitKeyboardResponseState();
  splitKeyboardResponse.active = true;
  splitKeyboardResponse.centerChoices = shuffle([state.current.center, state.current.decoy]);
  splitKeyboardResponse.requiredDirections = state.level >= 2 ? getRequiredPeripheralCount() : 0;

  responseOverlay.classList.add("visible", "split-keyboard-mode");
  responseOverlay.classList.remove("hold-wheel-mode", "peripheral-chooser", "feedback-mode");
  choiceRow.classList.remove("hold-wheel");
  choiceRow.classList.add("split-keyboard");
  promptText.className = "";
  promptText.textContent = state.level === 1 ? "Pick the center emoji." : "Arrow keys pick emoji, then tap direction.";
  feedbackText.textContent = getSplitKeyboardInstructionText();
  choiceRow.innerHTML = "";

  renderSplitKeyboardBoard();
}

function resetSplitKeyboardResponse() {
  splitKeyboardResponse = createSplitKeyboardResponseState();
  activeSplitKeyboardRefine = null;
  if (choiceRow) {
    choiceRow.classList.remove("split-keyboard", "split-keyboard-refine-clockwise", "split-keyboard-refine-counter");
    delete choiceRow.dataset.refine;
    delete choiceRow.dataset.centerIndex;
  }
  if (responseOverlay) responseOverlay.classList.remove("split-keyboard-mode");
}

function getSplitKeyboardInstructionText() {
  const settings = getSettings();
  const leftKey = displayHotkey(settings.splitKeyboardEmojiHotkeys[0] || DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS[0]);
  const rightKey = displayHotkey(settings.splitKeyboardEmojiHotkeys[1] || DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS[1]);
  if (state.level === 1) return `${leftKey}/${rightKey} = center emoji`;

  const targetCount = getRequiredPeripheralCount();
  const refineText = getDirections().length > 8
    ? ` · ${displayHotkey(settings.splitKeyboardCounterClockwiseHotkey)}/${displayHotkey(settings.splitKeyboardClockwiseHotkey)} refine` 
    : "";
  return `${leftKey}/${rightKey} pick emoji · ${getSplitKeyboardDirectionHotkeySummary()} choose direction${refineText}${targetCount > 1 ? ` · ${targetCount} targets` : ""}`;
}

function getSplitKeyboardDirectionHotkeySummary() {
  const directions = getDirections();
  const labels = directions
    .slice(0, directions.length <= 8 ? directions.length : 8)
    .map((direction) => getSplitKeyboardDirectionHotkeys(direction)[0] || String(direction.index + 1))
    .map(displayHotkey);
  if (directions.length > 8) return `${labels.join("/")} + refine or custom direction keys`;
  return labels.join("/");
}

function getSplitKeyboardRefineIconSvg(mode) {
  const clockwise = mode === "clockwise";
  const arc = clockwise
    ? "M 11.2 7.4 A 9.8 9.8 0 1 1 8.2 15.3"
    : "M 20.8 7.4 A 9.8 9.8 0 1 0 23.8 15.3";
  const arrow = clockwise
    ? "M 11.2 7.4 H 18.2 V 14.4"
    : "M 20.8 7.4 H 13.8 V 14.4";

  return `
    <svg class="split-keyboard-refine-icon" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path class="split-keyboard-refine-arc" d="${arc}" />
      <path class="split-keyboard-refine-arrow" d="${arrow}" />
    </svg>
  `;
}

function renderSplitKeyboardBoard() {
  choiceRow.innerHTML = "";
  const settings = getSettings();
  const board = document.createElement("div");
  board.className = "split-keyboard-board";

  const emojiRow = document.createElement("div");
  emojiRow.className = "split-keyboard-emoji-row";
  splitKeyboardResponse.centerChoices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "split-keyboard-emoji-choice";
    button.dataset.splitKeyboardCenterIndex = String(index);
    const hotkey = settings.splitKeyboardEmojiHotkeys[index] || DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS[index] || String(index + 1);
    button.dataset.hotkey = hotkey;
    button.title = `Hotkey ${displayHotkey(hotkey)}`;
    button.innerHTML = `<strong>${choice}</strong><span>${displayHotkey(hotkey)}</span>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitSplitKeyboardCenter(choice);
    });
    emojiRow.appendChild(button);
  });
  board.appendChild(emojiRow);

  if (state.level >= 2) {
    const directionMap = document.createElement("div");
    directionMap.className = "split-keyboard-direction-map";
    getSplitKeyboardDirectionSlots().forEach((slot) => {
      if (!slot) {
        const gap = document.createElement("div");
        gap.className = "split-keyboard-direction-gap";
        directionMap.appendChild(gap);
        return;
      }

      const direction = nearestDirectionByAngle(slot.angle);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "split-keyboard-direction-key";
      button.dataset.directionIndex = String(direction.index);
      const hotkeyLabel = getSplitKeyboardDirectionHotkeys(direction).map(displayHotkey).join(", ") || slot.key;
      button.innerHTML = `<strong>${escapeHtmlForTemplate(displayHotkey(getSplitKeyboardDirectionHotkeys(direction)[0] || slot.key))}</strong><span>${direction.label}</span>`;
      button.title = `${direction.name}${hotkeyLabel ? ` · ${hotkeyLabel}` : ""}`;
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        submitSplitKeyboardDirection(direction);
      });
      directionMap.appendChild(button);
    });
    board.appendChild(directionMap);

    if (getDirections().length > 8) {
      const refineRow = document.createElement("div");
      refineRow.className = "split-keyboard-refine-row";
      [
        { mode: "counterClockwise", hotkey: settings.splitKeyboardCounterClockwiseHotkey, label: "Counter-clockwise half-step" },
        { mode: "clockwise", hotkey: settings.splitKeyboardClockwiseHotkey, label: "Clockwise half-step" }
      ].forEach((option) => {
        const chip = document.createElement("div");
        chip.className = "split-keyboard-refine-chip";
        chip.dataset.refineMode = option.mode;
        chip.setAttribute("role", "img");
        chip.setAttribute("aria-label", `${displayHotkey(option.hotkey)} ${option.label}`);
        chip.title = `${displayHotkey(option.hotkey)} · ${option.label}`;
        chip.innerHTML = `${getSplitKeyboardRefineIconSvg(option.mode)}<span>${displayHotkey(option.hotkey)}</span>`;
        refineRow.appendChild(chip);
      });
      board.appendChild(refineRow);
    }
  }

  choiceRow.appendChild(board);
  updateSplitKeyboardVisualState();
}

function getSplitKeyboardDirectionSlots() {
  const cardinalSlots = [
    null, { key: "W", angle: 90 }, null,
    { key: "A", angle: 180 }, null, { key: "D", angle: 0 },
    null, { key: "X", angle: 270 }, null
  ];
  if (getDirections().length <= 4) return cardinalSlots;

  return [
    { key: "Q", angle: 135 }, { key: "W", angle: 90 }, { key: "E", angle: 45 },
    { key: "A", angle: 180 }, null, { key: "D", angle: 0 },
    { key: "Z", angle: 225 }, { key: "X", angle: 270 }, { key: "C", angle: 315 }
  ];
}

function nearestDirectionByAngle(angle) {
  const normalized = ((angle % 360) + 360) % 360;
  return getDirections().reduce((best, direction) => {
    const delta = Math.abs(direction.angle - normalized);
    const distance = Math.min(delta, 360 - delta);
    return distance < best.distance ? { direction, distance } : best;
  }, { direction: getDirections()[0], distance: Infinity }).direction;
}

function getSplitKeyboardKeyboardBaseAngle(event) {
  if (getDirections().length <= 4 && ["KeyQ", "KeyE", "KeyZ", "KeyC"].includes(event.code)) return null;

  const keyMap = {
    KeyD: 0,
    KeyE: 45,
    KeyW: 90,
    KeyQ: 135,
    KeyA: 180,
    KeyZ: 225,
    KeyX: 270,
    KeyC: 315
  };
  if (event.code in keyMap) return keyMap[event.code];
  return null;
}

function splitKeyboardDirectionFromKeyboard(event) {
  const configuredDirection = splitKeyboardDirectionFromConfiguredHotkey(event);
  if (configuredDirection) return configuredDirection;

  const baseAngle = getSplitKeyboardKeyboardBaseAngle(event);
  if (baseAngle === null) return null;

  let angle = baseAngle;
  const directions = getDirections();
  if (directions.length > 8 && activeSplitKeyboardRefine) {
    const step = 360 / directions.length;
    angle += activeSplitKeyboardRefine === "clockwise" ? -step : step;
  }

  return nearestDirectionByAngle(angle);
}

function submitSplitKeyboardCenter(choice) {
  if (!splitKeyboardResponse.active || responseLock) return;
  splitKeyboardResponse.selectedCenter = choice;
  splitKeyboardResponse.selectedCenterIndex = splitKeyboardResponse.centerChoices.indexOf(choice);
  state.response.center = choice;

  if (state.level === 1) {
    finishTrial();
    return;
  }

  promptText.textContent = "Tap the target direction.";
  const count = splitKeyboardResponse.requiredDirections;
  const chosen = splitKeyboardResponse.selectedDirections.length;
  feedbackText.textContent = count > 1 ? `${chosen}/${count} directions selected` : `Tap ${getSplitKeyboardDirectionHotkeySummary()}.`;
  updateSplitKeyboardVisualState();
}

function submitSplitKeyboardDirection(direction) {
  if (!splitKeyboardResponse.active || responseLock || state.level < 2) return;

  if (!splitKeyboardResponse.selectedCenter) {
    promptText.textContent = "Pick an emoji first.";
    feedbackText.textContent = getSplitKeyboardInstructionText();
    return;
  }

  const alreadySelected = splitKeyboardResponse.selectedDirections.some((selected) => selected.index === direction.index);
  if (!alreadySelected) splitKeyboardResponse.selectedDirections.push(direction);
  else if (splitKeyboardResponse.requiredDirections > 1) {
    splitKeyboardResponse.selectedDirections = splitKeyboardResponse.selectedDirections.filter((selected) => selected.index !== direction.index);
  }

  state.response.peripherals = splitKeyboardResponse.selectedDirections.slice(0, splitKeyboardResponse.requiredDirections);
  updateSplitKeyboardVisualState();

  const selectedCount = state.response.peripherals.length;
  if (selectedCount >= splitKeyboardResponse.requiredDirections) {
    finishTrial();
    return;
  }

  promptText.textContent = "Tap the next target direction.";
  feedbackText.textContent = `${selectedCount}/${splitKeyboardResponse.requiredDirections} directions selected`;
}

function updateSplitKeyboardVisualState() {
  if (!choiceRow) return;
  const settings = getSettings();
  if (splitKeyboardResponse.selectedCenterIndex >= 0) choiceRow.dataset.centerIndex = String(splitKeyboardResponse.selectedCenterIndex);
  else delete choiceRow.dataset.centerIndex;

  choiceRow.querySelectorAll(".split-keyboard-emoji-choice").forEach((button) => {
    const index = Number(button.dataset.splitKeyboardCenterIndex);
    button.classList.toggle("selected", index === splitKeyboardResponse.selectedCenterIndex);
  });

  const selectedDirectionIndexes = new Set(splitKeyboardResponse.selectedDirections.map((direction) => direction.index));
  choiceRow.querySelectorAll(".split-keyboard-direction-key").forEach((button) => {
    const directionIndex = Number(button.dataset.directionIndex);
    button.classList.toggle("selected", selectedDirectionIndexes.has(directionIndex));
  });

  choiceRow.classList.toggle("split-keyboard-refine-clockwise", activeSplitKeyboardRefine === "clockwise");
  choiceRow.classList.toggle("split-keyboard-refine-counter", activeSplitKeyboardRefine === "counterClockwise");

  choiceRow.querySelectorAll(".split-keyboard-refine-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.refineMode === activeSplitKeyboardRefine);
  });
  delete choiceRow.dataset.refine;
}

function setSplitKeyboardRefineFromKeyboard(event, isDown) {
  if (!splitKeyboardResponse.active || !getSettings().hotkeys) return false;
  const settings = getSettings();
  if (eventMatchesHotkey(event, settings.splitKeyboardClockwiseHotkey)) {
    activeSplitKeyboardRefine = isDown ? "clockwise" : (activeSplitKeyboardRefine === "clockwise" ? null : activeSplitKeyboardRefine);
    updateSplitKeyboardVisualState();
    return true;
  }
  if (eventMatchesHotkey(event, settings.splitKeyboardCounterClockwiseHotkey)) {
    activeSplitKeyboardRefine = isDown ? "counterClockwise" : (activeSplitKeyboardRefine === "counterClockwise" ? null : activeSplitKeyboardRefine);
    updateSplitKeyboardVisualState();
    return true;
  }
  return false;
}

function handleSplitKeyboardHotkey(event) {
  if (!splitKeyboardResponse.active || responseLock) return false;
  if (event.repeat && setSplitKeyboardRefineFromKeyboard(event, true)) return true;

  const settings = getSettings();
  const centerIndex = findHotkeyIndex(event, settings.splitKeyboardEmojiHotkeys);
  if (centerIndex >= 0 && splitKeyboardResponse.centerChoices[centerIndex]) {
    submitSplitKeyboardCenter(splitKeyboardResponse.centerChoices[centerIndex]);
    return true;
  }

  if (setSplitKeyboardRefineFromKeyboard(event, true)) return true;

  const direction = splitKeyboardDirectionFromKeyboard(event);
  if (direction) {
    submitSplitKeyboardDirection(direction);
    return true;
  }

  return false;
}

function isSplitKeyboardResponseActive() {
  return splitKeyboardResponse.active && responseOverlay.classList.contains("split-keyboard-mode") && !responseLock;
}

function presentHoldWheelResponse() {
  responseLock = false;
  resetHoldWheelResponse();
  holdWheelResponse = createHoldWheelResponseState();
  holdWheelResponse.active = true;
  holdWheelResponse.centerChoices = shuffle([state.current.center, state.current.decoy]);
  holdWheelResponse.requiredDirections = state.level >= 2 ? getRequiredPeripheralCount() : 0;

  responseOverlay.classList.add("visible", "hold-wheel-mode");
  responseOverlay.classList.remove("split-keyboard-mode", "peripheral-chooser", "feedback-mode");
  choiceRow.classList.remove("split-keyboard");
  choiceRow.classList.add("hold-wheel");
  promptText.className = "";
  promptText.textContent = state.level === 1 ? "Pick the center emoji." : "Hold emoji, drag to location, release.";
  feedbackText.className = "";
  feedbackText.textContent = getHoldWheelInstructionText();
  choiceRow.innerHTML = "";

  renderHoldWheelChoices();
}

function getHoldWheelInstructionText() {
  if (state.level === 1) return "Click the matching emoji.";
  const targetCount = getRequiredPeripheralCount();
  const directionCount = getDirections().length;
  const cancelKey = displayHotkey(getSettings().holdWheelCancelHotkey);
  return `${directionCount} slices match Direction count.${targetCount > 1 ? ` Drag through ${targetCount} target slices before release.` : " Release on the target slice."} Press ${cancelKey} to cancel a held emoji.`;
}

function renderHoldWheelChoices() {
  choiceRow.innerHTML = "";
  const board = document.createElement("div");
  board.className = "hold-wheel-board";

  const emojiRow = document.createElement("div");
  emojiRow.className = "hold-wheel-emoji-row";
  holdWheelResponse.centerChoices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "hold-wheel-emoji-choice";
    button.dataset.holdWheelCenterIndex = String(index);
    button.innerHTML = `<strong>${choice}</strong><span>${state.level === 1 ? "Click" : "Hold"}</span>`;
    button.addEventListener("click", (event) => {
      if (state.level !== 1) return;
      event.preventDefault();
      event.stopPropagation();
      submitHoldWheelCenterOnly(choice);
    });
    button.addEventListener("pointerdown", (event) => {
      if (state.level < 2) return;
      beginHoldWheelGesture(event, choice, button);
    });
    emojiRow.appendChild(button);
  });

  board.appendChild(emojiRow);
  if (state.level >= 2) {
    const hint = document.createElement("p");
    hint.className = "hold-wheel-hint";
    hint.textContent = getRequiredPeripheralCount() > 1
      ? `Drag across each remembered target slice, then release. ${displayHotkey(getSettings().holdWheelCancelHotkey)} cancels.` 
      : `Hold either emoji, move into the remembered slice, then release. ${displayHotkey(getSettings().holdWheelCancelHotkey)} cancels.`;
    board.appendChild(hint);
  }

  choiceRow.appendChild(board);
  updateHoldWheelVisualState();
}

function submitHoldWheelCenterOnly(choice) {
  if (!holdWheelResponse.active || responseLock) return;
  state.response.center = choice;
  finishTrial();
}

function beginHoldWheelGesture(event, choice, button) {
  if (!holdWheelResponse.active || responseLock || state.level < 2) return;
  event.preventDefault();
  event.stopPropagation();

  if (holdWheelResponse.selectedCenter !== choice) {
    holdWheelResponse.selectedDirections = [];
    state.response.peripherals = [];
  }

  holdWheelResponse.selectedCenter = choice;
  holdWheelResponse.pointerId = event.pointerId;
  holdWheelResponse.sourceButton = button;
  holdWheelResponse.hoverDirection = null;
  state.response.center = choice;

  try {
    button.setPointerCapture(event.pointerId);
  } catch (_) {}

  button.classList.add("dragging");
  document.body.classList.add("hold-wheel-gesture-active");
  window.addEventListener("pointermove", handleHoldWheelPointerMove, true);
  window.addEventListener("pointerup", handleHoldWheelPointerUp, true);
  window.addEventListener("pointercancel", cancelHoldWheelGesture, true);

  showHoldWheel(event.clientX, event.clientY, choice);
  updateHoldWheelFromPointer(event.clientX, event.clientY);
  updateHoldWheelVisualState();
}

function showHoldWheel(clientX, clientY, centerEmoji) {
  removeHoldWheelElement();

  const diameter = clamp(Math.min(window.innerWidth, window.innerHeight) * 0.34, 214, 310);
  const margin = diameter / 2 + 14;
  const centerX = clamp(clientX, margin, window.innerWidth - margin);
  const centerY = clamp(clientY, margin, window.innerHeight - margin);
  holdWheelResponse.wheelCenter = { x: centerX, y: centerY };

  const wheel = document.createElement("div");
  wheel.className = "hold-wheel-popover";
  wheel.style.setProperty("--hold-wheel-size", `${diameter}px`);
  wheel.style.left = `${centerX}px`;
  wheel.style.top = `${centerY}px`;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("hold-wheel-svg");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");

  const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  labelGroup.classList.add("hold-wheel-labels");

  getDirections().forEach((direction) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.classList.add("hold-wheel-slice");
    path.dataset.directionIndex = String(direction.index);
    path.setAttribute("d", describeSectorPath(direction.angle, getSectorWidth(), 49));
    svg.appendChild(path);

    const labelPoint = svgPointFromDirection(50, 50, 38, direction.angle);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.classList.add("hold-wheel-label");
    label.dataset.directionIndex = String(direction.index);
    label.setAttribute("x", labelPoint.x.toFixed(2));
    label.setAttribute("y", labelPoint.y.toFixed(2));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = direction.label;
    labelGroup.appendChild(label);
  });

  svg.appendChild(labelGroup);
  wheel.appendChild(svg);

  const center = document.createElement("div");
  center.className = "hold-wheel-center";
  center.textContent = centerEmoji;
  wheel.appendChild(center);

  const help = document.createElement("div");
  help.className = "hold-wheel-floating-help";
  help.textContent = getRequiredPeripheralCount() > 1
    ? `drag through slices · ${displayHotkey(getSettings().holdWheelCancelHotkey)} cancel` 
    : `release on slice · ${displayHotkey(getSettings().holdWheelCancelHotkey)} cancel`;
  wheel.appendChild(help);

  document.body.appendChild(wheel);
  holdWheelResponse.wheelElement = wheel;
}

function handleHoldWheelPointerMove(event) {
  if (event.pointerId !== holdWheelResponse.pointerId) return;
  event.preventDefault();
  updateHoldWheelFromPointer(event.clientX, event.clientY);
}

function updateHoldWheelFromPointer(clientX, clientY) {
  const direction = holdWheelDirectionFromPoint(clientX, clientY);
  holdWheelResponse.hoverDirection = direction;

  if (direction) {
    if (holdWheelResponse.requiredDirections > 1) {
      const alreadySelected = holdWheelResponse.selectedDirections.some((selected) => selected.index === direction.index);
      if (!alreadySelected && holdWheelResponse.selectedDirections.length < holdWheelResponse.requiredDirections) {
        holdWheelResponse.selectedDirections.push(direction);
      }
    } else {
      holdWheelResponse.selectedDirections = [direction];
    }
    state.response.peripherals = holdWheelResponse.selectedDirections.slice(0, holdWheelResponse.requiredDirections);
  }

  updateHoldWheelVisualState();
}

function holdWheelDirectionFromPoint(clientX, clientY) {
  const center = holdWheelResponse.wheelCenter;
  const dx = clientX - center.x;
  const dy = center.y - clientY;
  const distance = Math.hypot(dx, dy);
  const wheelSize = holdWheelResponse.wheelElement
    ? holdWheelResponse.wheelElement.getBoundingClientRect().width
    : 240;
  if (distance < Math.max(28, wheelSize * 0.13)) return null;

  const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  return nearestDirectionByAngle(angle);
}

function handleHoldWheelPointerUp(event) {
  if (event.pointerId !== holdWheelResponse.pointerId) return;
  event.preventDefault();
  finalizeHoldWheelGesture();
}

function finalizeHoldWheelGesture() {
  const selectedCount = holdWheelResponse.selectedDirections.length;
  const required = holdWheelResponse.requiredDirections;

  cleanupHoldWheelGesture(false);

  if (selectedCount >= required && required > 0) {
    state.response.peripherals = holdWheelResponse.selectedDirections.slice(0, required);
    finishTrial();
    return;
  }

  promptText.textContent = "Release on the target slice.";
  feedbackText.className = "";
  feedbackText.textContent = required > 1
    ? `${selectedCount}/${required} slices selected. Hold the emoji again and drag through the missing slice${required - selectedCount === 1 ? "" : "s"}.` 
    : "Hold an emoji, drag out to a slice, then release.";
  updateHoldWheelVisualState();
}

function cancelHoldWheelGesture(event) {
  if (event && event.pointerId !== holdWheelResponse.pointerId) return;
  cancelActiveHoldWheelGesture(true);
}

function isHoldWheelGestureActive() {
  return isHoldWheelResponseActive() && holdWheelResponse.pointerId !== null;
}

function cancelActiveHoldWheelGesture(showMessage = true) {
  if (!isHoldWheelGestureActive()) return false;

  cleanupHoldWheelGesture(true);
  holdWheelResponse.selectedCenter = null;
  holdWheelResponse.selectedDirections = [];
  state.response.center = null;
  state.response.peripherals = [];

  if (showMessage) {
    promptText.textContent = "Hold cancelled.";
    feedbackText.className = "";
    feedbackText.textContent = `Hold either emoji again. ${displayHotkey(getSettings().holdWheelCancelHotkey)} cancels the current hold.`;
  }

  updateHoldWheelVisualState();
  return true;
}

function cleanupHoldWheelGesture(cancelled) {
  window.removeEventListener("pointermove", handleHoldWheelPointerMove, true);
  window.removeEventListener("pointerup", handleHoldWheelPointerUp, true);
  window.removeEventListener("pointercancel", cancelHoldWheelGesture, true);

  if (holdWheelResponse.sourceButton) {
    holdWheelResponse.sourceButton.classList.remove("dragging");
    try {
      if (holdWheelResponse.pointerId !== null) holdWheelResponse.sourceButton.releasePointerCapture(holdWheelResponse.pointerId);
    } catch (_) {}
  }

  document.body.classList.remove("hold-wheel-gesture-active");
  holdWheelResponse.pointerId = null;
  holdWheelResponse.sourceButton = null;
  holdWheelResponse.hoverDirection = null;
  removeHoldWheelElement();

  if (cancelled) updateHoldWheelVisualState();
}

function removeHoldWheelElement() {
  if (holdWheelResponse.wheelElement) {
    holdWheelResponse.wheelElement.remove();
    holdWheelResponse.wheelElement = null;
  }
}

function resetHoldWheelResponse() {
  cleanupHoldWheelGesture(true);
  removeHoldWheelElement();
  holdWheelResponse = createHoldWheelResponseState();
  if (choiceRow) choiceRow.classList.remove("hold-wheel");
  if (responseOverlay) responseOverlay.classList.remove("hold-wheel-mode");
}

function updateHoldWheelVisualState() {
  if (!choiceRow) return;

  choiceRow.querySelectorAll(".hold-wheel-emoji-choice").forEach((button) => {
    const index = Number(button.dataset.holdWheelCenterIndex);
    const selected = holdWheelResponse.centerChoices[index] === holdWheelResponse.selectedCenter;
    button.classList.toggle("selected", selected);
  });

  const hoveredIndex = holdWheelResponse.hoverDirection ? holdWheelResponse.hoverDirection.index : -1;
  const selectedIndexes = new Set(holdWheelResponse.selectedDirections.map((direction) => direction.index));
  const wheel = holdWheelResponse.wheelElement;
  if (!wheel) return;

  wheel.querySelectorAll(".hold-wheel-slice, .hold-wheel-label").forEach((element) => {
    const directionIndex = Number(element.dataset.directionIndex);
    element.classList.toggle("hovered", directionIndex === hoveredIndex);
    element.classList.toggle("selected", selectedIndexes.has(directionIndex));
  });
}

function isHoldWheelResponseActive() {
  return holdWheelResponse.active && responseOverlay.classList.contains("hold-wheel-mode") && !responseLock;
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
  responseOverlay.classList.remove("split-keyboard-mode", "hold-wheel-mode");
  choiceRow.classList.remove("split-keyboard", "hold-wheel");
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible");
  responseOverlay.classList.add("peripheral-chooser");
  stage.classList.add("selecting-location");
  const settings = getSettings();
  const count = getRequiredPeripheralCount();
  promptText.textContent = count === 1 ? `Where was the ${settings.targetSymbol}?` : `Select all ${count} targets.`;
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
    chip.title = keyboardHotkey ? `${direction.name} · hotkeys ${keyboardHotkey}` : direction.name;
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
  state.skippable = false;
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
  recordSessionTrial(correct, centerCorrect, peripheralCorrect);
  if (state.recent.length > 20) state.recent.shift();
  while (state.levelRecent.length > getSettings().trialsToCheck) state.levelRecent.shift();
  showFeedback(correct, centerCorrect, peripheralCorrect);
  choiceRow.innerHTML = "";
  const progressResult = applyProgressionIfNeeded();
  if (progressResult && window.UFOVProgress) window.UFOVProgress.recordCheck(progressResult);
  const goalFinished = advanceTrialGoal(correct);
  updateStats();
  if (goalFinished) return;
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
  responseOverlay.classList.remove("split-keyboard-mode", "hold-wheel-mode");
  choiceRow.classList.remove("split-keyboard", "hold-wheel");
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
  return Math.max(MIN_FLASH_DURATION_MS, getSettings().minDuration);
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
  const flashBefore = Math.round(state.duration);
  let action = "stay";
  if (correctCount >= requiredCorrect) {
    const newDuration = clamp(state.duration * FLASH_ADVANCE_MULTIPLIER, minimum, maximum);
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
    const newDuration = clamp(state.duration * FLASH_REGRESS_MULTIPLIER, minimum, maximum);
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
  if (skipButton) {
    skipButton.classList.toggle("hidden", !state.running);
    skipButton.disabled = !state.skippable || state.paused;
  }
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

function handleChoiceHotkey(event) {
  if (!getSettings().hotkeys) return false;
  if (responseLock) return false;

  if (responseOverlay.classList.contains("split-keyboard-mode")) {
    return handleSplitKeyboardHotkey(event);
  }

  const settings = getSettings();
  const index = findHotkeyIndex(event, settings.centerChoiceHotkeys);
  if (index < 0) return false;
  const button = choiceRow.querySelector(`[data-hotkey-index="${index}"]`);
  if (!button) return false;
  button.click();
  return true;
}

function directionFromKeyboard(event) {
  const directions = getDirections();
  const mappedDirection = directionFromConfiguredHotkey(event);
  if (mappedDirection) return mappedDirection;

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
  const settings = getSettings();
  if (formTarget) {
    if (event.key === "Escape") {
      closeSettingsPanel();
      closeTimerPanel();
      closeHotkeyPanel();
    }
    return;
  }
  if (hotkeyPanel && !hotkeyPanel.classList.contains("hidden")) {
    if (event.key === "Escape") closeHotkeyPanel();
    return;
  }
  if (settings.hotkeys && isHoldWheelGestureActive() && eventMatchesHotkey(event, settings.holdWheelCancelHotkey)) {
    event.preventDefault();
    cancelActiveHoldWheelGesture(true);
    return;
  }
  if (settings.hotkeys && isSplitKeyboardResponseActive() && handleChoiceHotkey(event)) {
    event.preventDefault();
    return;
  }
  if (settings.hotkeys && eventMatchesHotkey(event, settings.pauseHotkey)) {
    event.preventDefault();
    if (state.running) togglePause();
    return;
  }
  if (settings.hotkeys && eventMatchesHotkey(event, settings.skipHotkey)) {
    if (skipCurrentTrial()) event.preventDefault();
    return;
  }
  if (event.key === "Escape") {
    closeSettingsPanel();
    closeTimerPanel();
    closeHotkeyPanel();
    return;
  }
  if (!settings.hotkeys) return;
  if (handleChoiceHotkey(event)) {
    event.preventDefault();
    return;
  }
  if (!state.awaitingPeripheral || responseLock) return;
  const direction = directionFromKeyboard(event);
  if (!direction) return;
  event.preventDefault();
  submitPeripheralDirection(direction);
}

function handleKeyboardKeyup(event) {
  if (isSplitKeyboardResponseActive() && setSplitKeyboardRefineFromKeyboard(event, false)) {
    event.preventDefault();
  }
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
    if (!raw) {
      enforceMinimumFlashSettings();
      return;
    }
    const data = JSON.parse(raw);
    allSettingInputs.forEach((input) => {
      if (input.id in data) {
        if (input.type === "checkbox") input.checked = data[input.id];
        else input.value = data[input.id];
      }
    });
  } catch (_) {}
  enforceMinimumFlashSettings();
}

function enforceMinimumFlashSettings() {
  [minDurationInput, startDurationInput].forEach((input) => {
    if (!input) return;
    input.min = String(MIN_FLASH_DURATION_MS);
    const value = Number(input.value);
    if (!Number.isFinite(value) || value < MIN_FLASH_DURATION_MS) {
      input.value = String(MIN_FLASH_DURATION_MS);
    }
  });
}

function migrateSplitKeyboardSettings() {
  if (!splitKeyboardEmojiHotkeysInput) return;
  const current = normalizeHotkeyToken(splitKeyboardEmojiHotkeysInput.value);
  if (current === "s" || current === "space,f") {
    splitKeyboardEmojiHotkeysInput.value = DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS.join(",");
  }
  if (splitKeyboardCounterClockwiseHotkeyInput && normalizeHotkeyToken(splitKeyboardCounterClockwiseHotkeyInput.value) === "v") {
    splitKeyboardCounterClockwiseHotkeyInput.value = DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY;
  }
}

function applySettingExplainers() {
  const explainers = {
    levelSelect: "Choose which task is trained: center only, center plus location, or center plus location with distractors.",
    responseStyleSelect: "Two step keeps the old flow. Split keyboard uses ←/→ plus QWE/AD/ZXC. Hold wheel uses click-hold-drag-release gestures.",
    stimulusAreaSelect: "Circle keeps targets in the ring. Full screen lets targets and distractors appear across the whole stage.",
    directionCountInput: "Controls how many direction slices are used for location choices.",
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
    hotkeysInput: "Enables keyboard shortcuts and the visible hotkey badges.",
    openHotkeyPanelButton: "Open the button-based hotkey editor.",
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

function updateRangeSliderValue() {
  if (!rangeSlider) return;

  const min = Number(rangeSlider.min) || 0;
  const max = Number(rangeSlider.max) || 100;
  const rawValue = Number(rangeSlider.value);
  const value = clamp(Number.isFinite(rawValue) ? rawValue : 78, min, max);
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const rounded = Math.round(value);

  rangeSlider.style.setProperty("--range-fill", `${clamp(progress, 0, 100)}%`);
  rangeSlider.setAttribute("aria-valuetext", `${rounded}% peripheral range`);
  rangeSlider.title = `Peripheral range: ${rounded}%`;

  if (rangeSliderValue) {
    rangeSliderValue.value = `${rounded}%`;
    rangeSliderValue.textContent = `${rounded}%`;
  }
}

function applyInputSteps() {
  const steps = {
    startDurationInput: "1",
    minDurationInput: "1",
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

function applyHotkeyUiState() {
  const enabled = hotkeysInput ? hotkeysInput.checked : true;
  document.body.classList.toggle("hotkeys-disabled", !enabled);
}

function openHotkeyPanel() {
  if (!hotkeyPanel) return;
  renderHotkeyPanel();
  hotkeyPanel.classList.remove("hidden");
}

function closeHotkeyPanel() {
  stopHotkeyCapture();
  if (!hotkeyPanel || hotkeyPanel.classList.contains("hidden")) return;
  hotkeyPanel.classList.add("hidden");
}

function resetHotkeysToDefaults() {
  if (centerHotkeysInput) centerHotkeysInput.value = DEFAULT_CENTER_CHOICE_HOTKEYS.join(",");
  if (splitKeyboardEmojiHotkeysInput) splitKeyboardEmojiHotkeysInput.value = DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS.join(",");
  if (splitKeyboardClockwiseHotkeyInput) splitKeyboardClockwiseHotkeyInput.value = DEFAULT_SPLIT_KEYBOARD_CLOCKWISE_HOTKEY;
  if (splitKeyboardCounterClockwiseHotkeyInput) splitKeyboardCounterClockwiseHotkeyInput.value = DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY;
  if (holdWheelCancelHotkeyInput) holdWheelCancelHotkeyInput.value = DEFAULT_HOLD_WHEEL_CANCEL_HOTKEY;
  if (splitKeyboardDirectionHotkeysInput) splitKeyboardDirectionHotkeysInput.value = DEFAULT_SPLIT_KEYBOARD_DIRECTION_HOTKEYS;
  if (directionHotkeysInput) directionHotkeysInput.value = DEFAULT_DIRECTION_HOTKEYS;
  if (pauseHotkeyInput) pauseHotkeyInput.value = DEFAULT_PAUSE_HOTKEY;
  if (skipHotkeyInput) skipHotkeyInput.value = DEFAULT_SKIP_HOTKEY;
  saveSettings();
  renderHotkeyPanel();
  applyHotkeyUiState();
}

function createHotkeySection(title) {
  const section = document.createElement("section");
  section.className = "hotkey-section";
  const heading = document.createElement("h3");
  heading.textContent = title;
  const grid = document.createElement("div");
  grid.className = "hotkey-button-grid";
  section.appendChild(heading);
  section.appendChild(grid);
  hotkeySections.appendChild(section);
  return grid;
}

function addHotkeyButton(grid, label, hotkey, applyValue) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "hotkey-capture-button";
  button.innerHTML = `<span>${label}</span><strong>${displayHotkey(hotkey)}</strong>`;
  button.addEventListener("click", () => beginHotkeyCapture(button, applyValue));
  grid.appendChild(button);
}

function renderHotkeyPanel() {
  if (!hotkeySections) return;
  hotkeySections.innerHTML = "";
  if (hotkeyHelp) hotkeyHelp.textContent = "Click a key button, then press the new key. Esc cancels capture.";

  const centerHotkeys = parseHotkeyList(centerHotkeysInput, DEFAULT_CENTER_CHOICE_HOTKEYS);
  const splitKeyboardEmojiHotkeys = parseHotkeyList(splitKeyboardEmojiHotkeysInput, DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS);

  const generalGrid = createHotkeySection("General");
  addHotkeyButton(generalGrid, "Pause / resume", readHotkey(pauseHotkeyInput, DEFAULT_PAUSE_HOTKEY), (value) => {
    if (pauseHotkeyInput) pauseHotkeyInput.value = serializeHotkeyToken(value);
  });
  addHotkeyButton(generalGrid, "Skip trial", readHotkey(skipHotkeyInput, DEFAULT_SKIP_HOTKEY), (value) => {
    if (skipHotkeyInput) skipHotkeyInput.value = serializeHotkeyToken(value);
  });

  const centerGrid = createHotkeySection("Center choices");
  for (let index = 0; index < 2; index += 1) {
    addHotkeyButton(centerGrid, `Choice ${index + 1}`, centerHotkeys[index] || DEFAULT_CENTER_CHOICE_HOTKEYS[index], (value) => {
      setIndexedHotkey(centerHotkeysInput, index, value, DEFAULT_CENTER_CHOICE_HOTKEYS);
    });
  }

  const splitKeyboardGrid = createHotkeySection("Split keyboard");
  for (let index = 0; index < 2; index += 1) {
    addHotkeyButton(splitKeyboardGrid, `Emoji ${index + 1}`, splitKeyboardEmojiHotkeys[index] || DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS[index], (value) => {
      setIndexedHotkey(splitKeyboardEmojiHotkeysInput, index, value, DEFAULT_SPLIT_KEYBOARD_EMOJI_HOTKEYS);
    });
  }
  addHotkeyButton(splitKeyboardGrid, "Refine clockwise", readHotkey(splitKeyboardClockwiseHotkeyInput, DEFAULT_SPLIT_KEYBOARD_CLOCKWISE_HOTKEY), (value) => {
    if (splitKeyboardClockwiseHotkeyInput) splitKeyboardClockwiseHotkeyInput.value = serializeHotkeyToken(value);
  });
  addHotkeyButton(splitKeyboardGrid, "Refine counter", readHotkey(splitKeyboardCounterClockwiseHotkeyInput, DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY), (value) => {
    if (splitKeyboardCounterClockwiseHotkeyInput) splitKeyboardCounterClockwiseHotkeyInput.value = serializeHotkeyToken(value);
  });
  getDirections().forEach((direction) => {
    addHotkeyButton(splitKeyboardGrid, direction.name, getSplitKeyboardDirectionHotkeys(direction)[0] || "", (value) => {
      setSplitKeyboardDirectionHotkey(direction.label, value);
    });
  });

  const holdWheelGrid = createHotkeySection("Hold wheel");
  addHotkeyButton(holdWheelGrid, "Cancel gesture", readHotkey(holdWheelCancelHotkeyInput, DEFAULT_HOLD_WHEEL_CANCEL_HOTKEY), (value) => {
    if (holdWheelCancelHotkeyInput) holdWheelCancelHotkeyInput.value = serializeHotkeyToken(value);
  });

  const directionGrid = createHotkeySection("Directions");
  getDirections().forEach((direction) => {
    addHotkeyButton(directionGrid, direction.name, getDirectionHotkeys(direction)[0] || "", (value) => {
      setDirectionHotkey(direction.label, value);
    });
  });
}

function beginHotkeyCapture(button, applyValue) {
  stopHotkeyCapture(false);
  activeHotkeyCapture = { button, applyValue };
  button.classList.add("capturing");
  const value = button.querySelector("strong");
  if (value) value.textContent = "Press key";
  if (hotkeyHelp) hotkeyHelp.textContent = "Press the new key now. Esc cancels.";
}

function stopHotkeyCapture(resetHelp = true) {
  if (activeHotkeyCapture && activeHotkeyCapture.button) {
    activeHotkeyCapture.button.classList.remove("capturing");
  }
  activeHotkeyCapture = null;
  if (resetHelp && hotkeyHelp) hotkeyHelp.textContent = "Click a key button, then press the new key. Esc cancels capture.";
}

function handleHotkeyCapture(event) {
  if (!activeHotkeyCapture) return;
  event.preventDefault();
  event.stopPropagation();
  if (event.key === "Escape") {
    stopHotkeyCapture();
    renderHotkeyPanel();
    return;
  }
  const hotkey = hotkeyFromEvent(event);
  if (!hotkey) return;
  activeHotkeyCapture.applyValue(hotkey);
  stopHotkeyCapture(false);
  saveSettings();
  renderHotkeyPanel();
  applyHotkeyUiState();
}

function setIndexedHotkey(input, index, value, fallback) {
  if (!input) return;
  const keys = parseHotkeyList(input, fallback).map(serializeHotkeyToken);
  while (keys.length <= index) keys.push(serializeHotkeyToken(fallback[keys.length] || String(keys.length + 1)));
  keys[index] = serializeHotkeyToken(value);
  input.value = keys.join(",");
}

function setDirectionHotkey(label, value) {
  if (!directionHotkeysInput) return;
  const map = parseDirectionHotkeyMap(directionHotkeysInput.value);
  map[String(label).toUpperCase()] = [serializeHotkeyToken(value)];
  directionHotkeysInput.value = serializeDirectionHotkeyMap(map);
}

function setSplitKeyboardDirectionHotkey(label, value) {
  if (!splitKeyboardDirectionHotkeysInput) return;
  const map = parseDirectionHotkeyMap(splitKeyboardDirectionHotkeysInput.value);
  map[String(label).toUpperCase()] = [serializeHotkeyToken(value)];
  splitKeyboardDirectionHotkeysInput.value = serializeDirectionHotkeyMap(map);
}

function serializeDirectionHotkeyMap(map) {
  const labels = [
    ...DIRECTION_HOTKEY_LABELS,
    ...getDirections().map((direction) => String(direction.label).toUpperCase()),
    ...Object.keys(map)
  ];
  return Array.from(new Set(labels))
    .filter((label) => map[label] && map[label].length)
    .map((label) => `${label}=${map[label].map(serializeHotkeyToken).join("/")}`)
    .join("; ");
}

const allSettingInputs = [
  levelSelect,
  responseStyleSelect,
  stimulusAreaSelect,
  directionCountInput,
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
  centerHotkeysInput,
  splitKeyboardEmojiHotkeysInput,
  splitKeyboardClockwiseHotkeyInput,
  splitKeyboardCounterClockwiseHotkeyInput,
  holdWheelCancelHotkeyInput,
  splitKeyboardDirectionHotkeysInput,
  directionHotkeysInput,
  pauseHotkeyInput,
  skipHotkeyInput,
  calmFieldInput,
  peripheralTargetInput,
  rangeSlider,
  distractorInput
].filter(Boolean);

function openSettingsPanel() {
  if (!settingsPanel) return;
  settingsPanel.classList.remove("closing");
  settingsPanel.classList.add("open");
}

function closeSettingsPanel() {
  if (!settingsPanel || !settingsPanel.classList.contains("open")) return;
  settingsPanel.classList.add("closing");
  settingsPanel.classList.remove("open");
  window.setTimeout(() => settingsPanel.classList.remove("closing"), 220);
}

startButton.addEventListener("click", () => {
  startSession();
});
settingsButton.addEventListener("click", openSettingsPanel);
closeSettingsButton.addEventListener("click", closeSettingsPanel);
document.addEventListener("click", (event) => {
  if (!settingsPanel.classList.contains("open")) return;
  if (settingsPanel.contains(event.target)) return;
  if (settingsButton.contains(event.target)) return;
  closeSettingsPanel();
});
calibrateButton.addEventListener("click", calibrateDisplay);
resetButton.addEventListener("click", resetSession);
pauseButton.addEventListener("click", togglePause);
if (skipButton) skipButton.addEventListener("click", skipCurrentTrial);
if (openHotkeyPanelButton) openHotkeyPanelButton.addEventListener("click", openHotkeyPanel);
if (hotkeyCloseButton) hotkeyCloseButton.addEventListener("click", closeHotkeyPanel);
if (hotkeyDoneButton) hotkeyDoneButton.addEventListener("click", closeHotkeyPanel);
if (hotkeyResetButton) hotkeyResetButton.addEventListener("click", resetHotkeysToDefaults);
if (hotkeyPanel) {
  hotkeyPanel.addEventListener("click", (event) => {
    if (event.target === hotkeyPanel) closeHotkeyPanel();
  });
}
window.addEventListener("keydown", handleHotkeyCapture, true);
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
    enforceMinimumFlashSettings();
    const settings = getSettings();
    if (input === startDurationInput) state.duration = settings.startDuration;
    else state.duration = clamp(state.duration, getEffectiveMinDuration(), settings.maxDuration);
    saveFlashDuration();
    updateStats();
  });
});
window.addEventListener("keydown", handleKeyboard);
window.addEventListener("keyup", handleKeyboardKeyup);
allSettingInputs.forEach((input) => {
  input.addEventListener("change", () => {
    saveSettings();
    updateLayout();
    updateRangeSliderValue();
    applyCalmField();
    applyHotkeyUiState();
    renderHotkeyPanel();
  });
});
[levelSelect, autoProgressInput, trialsToCheckInput, targetAccuracyInput, regressAccuracyInput, directionCountInput, peripheralTargetInput].filter(Boolean).forEach((input) => {
  input.addEventListener("change", () => {
    resetProgressWindow();
    updateStats();
    renderHotkeyPanel();
  });
});
rangeSlider.addEventListener("input", () => {
  saveSettings();
  updateLayout();
  updateRangeSliderValue();
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
    autoProgressInput: true,
    trialsToCheckInput: "4",
    targetAccuracyInput: "75",
    regressAccuracyInput: "50",
    startDurationInput: "500",
    minDurationInput: "16",
    maxDurationInput: "500",
    fixationInput: "600",
    maskInput: "90",
    symbolMaskInput: true,
    maskDensityInput: "140",
    correctDelayInput: "650",
    missDelayInput: "650",
    targetSymbolInput: "✕",
    distractorSymbolInput: "Y",
    blurLettersInput: false,
    letterBlurInput: "2.5",
    hotkeysInput: true,
    centerHotkeysInput: "A,D",
    splitKeyboardEmojiHotkeysInput: "ArrowLeft,ArrowRight",
    splitKeyboardClockwiseHotkeyInput: DEFAULT_SPLIT_KEYBOARD_CLOCKWISE_HOTKEY,
    splitKeyboardCounterClockwiseHotkeyInput: DEFAULT_SPLIT_KEYBOARD_COUNTER_CLOCKWISE_HOTKEY,
    holdWheelCancelHotkeyInput: DEFAULT_HOLD_WHEEL_CANCEL_HOTKEY,
    splitKeyboardDirectionHotkeysInput: DEFAULT_SPLIT_KEYBOARD_DIRECTION_HOTKEYS,
    directionHotkeysInput: DEFAULT_DIRECTION_HOTKEYS,
    pauseHotkeyInput: DEFAULT_PAUSE_HOTKEY,
    skipHotkeyInput: DEFAULT_SKIP_HOTKEY,
    calmFieldInput: false,
    rangeSlider: "78",
    peripheralTargetInput: "1",
    distractorInput: "20"
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
  applyCalmField();
  applyHotkeyUiState();
  renderHotkeyPanel();
  updateStats();
  saveSettings();
});


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
migrateSplitKeyboardSettings();
updateRangeSliderValue();
updateLayout();
applyCalmField();
applyHotkeyUiState();
renderHotkeyPanel();
initializeTimerControls();
initializeMobileWarning();
updateStats();
