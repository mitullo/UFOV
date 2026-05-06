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
const directionRay = document.getElementById("directionRay");
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
const correctDelayInput = document.getElementById("correctDelayInput");
const missDelayInput = document.getElementById("missDelayInput");
const distractorInput = document.getElementById("distractorInput");
const peripheralTargetInput = document.getElementById("peripheralTargetInput");
const resetSettingsButton = document.getElementById("resetSettingsButton");

const levelNames = ["Mode · Identification", "Mode · Divided Attention", "Mode · Selective Attention"];
const directions = [
  { label: "E", name: "East", angle: 0 },
  { label: "NE", name: "North-East", angle: 45 },
  { label: "N", name: "North", angle: 90 },
  { label: "NW", name: "North-West", angle: 135 },
  { label: "W", name: "West", angle: 180 },
  { label: "SW", name: "South-West", angle: 225 },
  { label: "S", name: "South", angle: 270 },
  { label: "SE", name: "South-East", angle: 315 }
];
const emojiGroups = [
  ["\uD83D\uDE0E", "\uD83D\uDE0F", "\uD83D\uDE44", "\uD83D\uDE10"],
  ["\uD83D\uDE0A", "\uD83D\uDE0C", "\uD83E\uDD17", "\uD83D\uDE0B"],
  ["\uD83D\uDE14", "\uD83D\uDE43", "\uD83D\uDE15", "\uD83E\uDD2D"],
  ["\uD83D\uDC3B", "\uD83D\uDC3C", "\uD83D\uDC28", "\uD83E\uDD8A"],
  ["\uD83D\uDC31", "\uD83D\uDC36", "\uD83D\uDC30", "\uD83D\uDC37"],
  ["\uD83E\uDD81", "\uD83D\uDC2F", "\uD83D\uDC38", "\uD83D\uDC35"],
];
const emojiPool = emojiGroups.flat();
const peripheralTarget = "✕";
const peripheralDistractor = "Y";

const FLASH_DURATION_KEY = "ufov_current_flash_ms";

let state = createInitialState();
let pendingTimer = null;
let peripheralElements = [];
let decoyElements = [];
let sectorElements = [];
let responseLock = true;
let sessionToken = 0;
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
    response: { center: null, peripheral: null },
    awaitingPeripheral: false
  };
}

function getSettings() {
  const minimum = readNumber(minDurationInput, 16, 4, 100);
  const maximum = Math.max(readNumber(maxDurationInput, 500, 50, 1500), minimum);
  return {
    level: readNumber(levelSelect, 3, 1, 3),
    autoProgress: autoProgressInput.checked,
    trialsToCheck: readNumber(trialsToCheckInput, 4, 1, 40),
    targetAccuracy: readNumber(targetAccuracyInput, 80, 50, 98) / 100,
    regressAccuracy: readNumber(regressAccuracyInput, 50, 10, 80) / 100,
    startDuration: clamp(readNumber(startDurationInput, 500, 16, 1000), minimum, maximum),
    minDuration: minimum,
    maxDuration: maximum,
    fixationMs: readNumber(fixationInput, 1200, 0, 1500),
    maskMs: readNumber(maskInput, 90, 0, 500),
    correctDelayMs: readNumber(correctDelayInput, 180, 0, 2000),
    missDelayMs: readNumber(missDelayInput, 420, 0, 3000),
    peripheralRange: readNumber(rangeSlider, 78, 36, 98),
    peripheralTargets: readNumber(peripheralTargetInput, 1, 1, 5),
    distractors: readNumber(distractorInput, 18, 0, 48),
    targets: emojiPool
  };
}

function readNumber(input, fallback, min, max) {
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

function loadSavedFlashDuration(settings) {
  try {
    const raw = localStorage.getItem(FLASH_DURATION_KEY);
    const saved = Number(raw);

    if (!Number.isFinite(saved)) {
      return settings.startDuration;
    }

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
  startOverlay.classList.add("hidden");
  pauseButton.classList.remove("hidden");
  updateStats();
  calibrateDisplay().then(() => scheduleTrial(220, token));
}

function resetSession() {
  window.clearTimeout(pendingTimer);
  clearStage();
  sessionToken += 1;
  state = createInitialState();
  startOverlay.classList.remove("hidden");
  pauseButton.classList.add("hidden");
  responseOverlay.classList.remove("visible");
  responseOverlay.classList.remove("feedback-mode");
  promptText.className = "";
  promptText.textContent = "Press start.";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  updateStats();
}

function togglePause() {
  state.paused = !state.paused;
  if (state.paused) {
    window.clearTimeout(pendingTimer);
    clearStage();
    promptText.textContent = "Paused";
  } else {
    scheduleTrial(120, sessionToken);
  }
  updateStats();
}

function scheduleTrial(delay, token) {
  if (!state.running || state.paused) return;
  wait(delay).then(() => {
    if (token === sessionToken && !state.paused) runTrial(token);
  });
}

async function runTrial(token) {
  if (!state.running || state.paused || token !== sessionToken) return;
  const settings = getSettings();
  responseLock = true;
  clearStage();
  state.trial += 1;
  state.levelTrial += 1;
  state.response = { center: null, peripheral: null };
  state.awaitingPeripheral = false;
  state.current = createTrial();
  feedbackText.className = "";
  feedbackText.textContent = "";
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible", "feedback-mode", "peripheral-chooser");
  promptText.textContent = "Focus on the +";
  updateStats();
  await wait(Math.max(settings.fixationMs, 100));
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
  const decoys = group.filter(e => e !== center);
  const decoy = randomItem(decoys);
  
  const targetCount = getSettings().peripheralTargets;
  const usedDirections = [];
  const allDirections = [...directions];
  for (let i = 0; i < targetCount; i++) {
    const available = allDirections.filter(d => !usedDirections.some(u => u.label === d.label));
    const dir = randomItem(available.length ? available : directions);
    usedDirections.push(dir);
  }
  const primaryDirection = usedDirections[0];
  return { center, decoy, direction: primaryDirection, directions: usedDirections };
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
    const targetCount = getSettings().peripheralTargets;
    const targetDirs = trial.directions || [trial.direction];
    for (let i = 0; i < targetCount && i < targetDirs.length; i++) {
      createPeripheralTarget(targetDirs[i]);
    }
  }
  if (state.level === 3) createDistractors(trial.direction);
}

function hideStimuli() {
  centerStimulus.classList.remove("visible");
  peripheralElements.forEach((element) => element.classList.remove("visible"));
  decoyElements.forEach((element) => element.classList.remove("visible"));
}

function showMask() {
  noiseMask.classList.add("visible");
}

function hideMask() {
  noiseMask.classList.remove("visible");
}

function clearStage() {
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.remove("hidden");
  
  centerStimulus.classList.remove("visible");
  hideMask();
  hideDirectionPreview();
  stage.classList.remove("selecting-location");
  removeSectors();
  peripheralElements.forEach((element) => element.remove());
  decoyElements.forEach((element) => element.remove());
  peripheralElements = [];
  decoyElements = [];
  responseLock = true;
}

function createPeripheralTarget(direction) {
  const element = document.createElement("div");
  element.className = "peripheral-target visible";
  element.textContent = peripheralTarget;
  const jitter = 0.3 + Math.random() * 0.7; // 30–100% of range
  const position = positionFromDirection(direction.angle, getSettings().peripheralRange * jitter);
  element.style.left = position.x;
  element.style.top = position.y;
  stage.appendChild(element);
  peripheralElements.push(element);
}

function createDistractors(targetDirection) {
  const settings = getSettings();
  if (settings.distractors <= 0) return;
  const placed = []; // track all placed positions to avoid overlaps
  const targetAngle = targetDirection.angle;
  const targetJitter = 0.3 + Math.random() * 0.7;
  const targetRadius = settings.peripheralRange * targetJitter;
  placed.push({ angle: targetAngle, radius: targetRadius });
  const nonTargetDirs = directions.filter((d) => d.label !== targetDirection.label);
  const perDirCount = Math.min(nonTargetDirs.length, settings.distractors);
  for (let i = 0; i < perDirCount; i += 1) {
    const jitter = 0.7 + Math.random() * 0.3;
    const a = nonTargetDirs[i].angle;
    const r = settings.peripheralRange * jitter;
    placed.push({ angle: a, radius: r });
    addDecoy(a, r);
  }
  for (let i = perDirCount; i < settings.distractors; i += 1) {
    let angle = 0, radius = 0;
    for (let attempt = 0; attempt < 30; attempt += 1) {
      angle = Math.random() * 360;
      radius = 12 + Math.random() * (settings.peripheralRange - 12);
      const tooClose = placed.some((p) => {
        const ad = Math.min(Math.abs(angle - p.angle), 360 - Math.abs(angle - p.angle));
        const rd = Math.abs(radius - p.radius);
        return ad < 25 && rd < 12;
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
  element.textContent = peripheralDistractor;
  const position = positionFromDirection(angle, radius);
  element.style.left = position.x;
  element.style.top = position.y;
  stage.appendChild(element);
  decoyElements.push(element);
}

function radiusPxFromRange(rangePercent) {
  const rect = stage.getBoundingClientRect();
  const minSide = Math.min(rect.width, rect.height);
  return (minSide / 2) * (rangePercent / 100);
}

function positionFromDirection(angle, radiusPercent) {
  const radians = (angle * Math.PI) / 180;
  const radiusPx = radiusPxFromRange(radiusPercent);
  return {
    x: `calc(50% + ${Math.cos(radians) * radiusPx}px)`,
    y: `calc(50% - ${Math.sin(radians) * radiusPx}px)`
  };
}

function presentResponseControls() {
  const fixation = document.getElementById("fixation");
  if (fixation) fixation.classList.add("hidden");
  
  responseLock = false;
  responseOverlay.classList.add("visible");
  promptText.className = ""; // Reset any red/green from previous trial
  promptText.textContent = "Which emoji was in the center?";
  choiceRow.innerHTML = "";
  
  // Show only 2 options: the correct one and the pre-selected decoy
  const choices = [state.current.center, state.current.decoy];
  // Shuffle them so the correct one isn't always first
  choices.sort(() => Math.random() - 0.5);
  
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button emoji-choice";
    button.type = "button";
    button.textContent = choice;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      submitCenter(choice);
    });
    choiceRow.appendChild(button);
  });
}

function submitCenter(choice) {
  if (responseLock) return;
  state.response.center = choice;
  if (state.level === 1) finishTrial();
  else presentPeripheralChooser();
}


function presentPeripheralChooser() {
  state.awaitingPeripheral = true;
  responseLock = true;
  choiceRow.innerHTML = "";
  responseOverlay.classList.remove("visible");
  responseOverlay.classList.add("peripheral-chooser");
  stage.classList.add("selecting-location");
  promptText.textContent = "Where was the X?";
  promptText.className = "";
  responseOverlay.classList.add("visible");
  createSectors();
  window.setTimeout(() => {
    if (state.running && !state.paused && state.awaitingPeripheral && state.current) {
      responseLock = false;
    }
  }, 0);
}

function updateLayout() {
  const rangePercent = getSettings().peripheralRange;
  const radiusPx = radiusPxFromRange(rangePercent);
  stage.style.setProperty("--peripheral-diameter", `${radiusPx * 2}px`);

  const lines = sectorOverlay.querySelectorAll(".spoke-line");
  lines.forEach((line) => {
    line.style.width = `${radiusPx}px`;
  });
}

function createSectors() {
  removeSectors();
  const rangePercent = getSettings().peripheralRange;
  updateLayout();

  directions.forEach((direction) => {
    // Spoke line (visual divider, length = peripheral range)
    const line = document.createElement("div");
    line.className = "spoke-line";
    line.style.width = `${radiusPxFromRange(rangePercent)}px`;
    line.style.transform = `rotate(${-direction.angle - 22.5}deg)`;
    sectorOverlay.appendChild(line);
    sectorElements.push(line);
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
  const dy = centerY - clientY; // inverted for math logic
  
  // Get angle (0=East, 90=North)
  let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  return directions.reduce((best, direction) => {
    const distance = Math.min(Math.abs(angleDeg - direction.angle), 360 - Math.abs(angleDeg - direction.angle));
    return distance < best.distance ? { direction, distance } : best;
  }, { direction: directions[0], distance: Infinity }).direction;
}

function updateHoverDirection(event) {
  if (responseLock || state.level === 1 || !state.current || !state.awaitingPeripheral) return;
  
  const rect = stage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distPx = Math.sqrt(dx * dx + dy * dy);
  
  const maxRadiusPx = radiusPxFromRange(getSettings().peripheralRange);
  
  // Cutoff at 20px from center and 10px beyond ring
  if (distPx < 20 || distPx > maxRadiusPx + 10) {
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
  const rect = stage.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxRadius = radiusPxFromRange(getSettings().peripheralRange);
  if (distance < 20 || distance > maxRadius + 10) return;
  const target = nearestDirection(event.clientX, event.clientY);
  state.response.peripheral = target;
  feedbackText.className = "";
  feedbackText.textContent = `Location selected: ${state.response.peripheral.name}`;
  maybeFinishDividedTrial();
}

function maybeFinishDividedTrial() {
  if (state.response.center && state.response.peripheral) finishTrial();
}

function finishTrial() {
  responseLock = true;
  hideDirectionPreview();
  stage.classList.remove("selecting-location");
  responseOverlay.classList.remove("visible", "peripheral-chooser");
  state.awaitingPeripheral = false;
  removeSectors();
  const centerCorrect = state.response.center === state.current.center;
  const peripheralCorrect =
    state.level === 1 ||
    (state.response.peripheral && state.current.directions.some(d => d.label === state.response.peripheral.label));
  const correct = centerCorrect && peripheralCorrect;
  state.total += 1;
  state.correct += correct ? 1 : 0;
  state.streak = correct ? state.streak + 1 : 0;
  state.recent.push(correct);
  state.levelRecent.push(correct);
  state.progressBlock.push({ correct, centerCorrect, peripheralCorrect });
  if (state.recent.length > 20) state.recent.shift();
  // Keep levelRecent as a rolling window of trialsToCheck size
  while (state.levelRecent.length > getSettings().trialsToCheck) state.levelRecent.shift();

  showFeedback(correct, centerCorrect, peripheralCorrect);
  choiceRow.innerHTML = "";

  const progressResult = applyProgressionIfNeeded();

  if (progressResult && window.UFOVProgress) {
    window.UFOVProgress.recordCheck(progressResult);
  }

  updateStats();
  // Ensure feedback is visible for at least 2 seconds
  const feedbackDelay = Math.max(2000, correct ? getSettings().correctDelayMs : getSettings().missDelayMs);
  scheduleTrial(feedbackDelay, sessionToken);
}

function showFeedback(correct, centerCorrect, peripheralCorrect) {
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

  while (state.levelRecent.length > trialsToCheck) {
    state.levelRecent.shift();
  }

  while (state.progressBlock.length > trialsToCheck) {
    state.progressBlock.shift();
  }

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

  const centerCorrectCount = state.progressBlock.filter(item => item.centerCorrect).length;
  const peripheralCorrectCount = state.progressBlock.filter(item => item.peripheralCorrect).length;

  saveFlashDuration();

  const result = {
    mode: state.level,
    modeName: levelNames[state.level - 1],
    trials: trialsToCheck,
    flashBefore,
    flashAfter: Math.round(state.duration),
    accuracy: (correctCount / trialsToCheck) * 100,
    centerAccuracy: (centerCorrectCount / trialsToCheck) * 100,
    peripheralAccuracy: state.level === 1
      ? 100
      : (peripheralCorrectCount / trialsToCheck) * 100,
    correctCount,
    wrongCount,
    action
  };

  resetProgressWindow();

  return result;
}

function updateStats() {
  levelTitle.textContent = levelNames[state.level - 1];
  durationStat.textContent = `${Math.round(state.duration)}ms`;
  trialStat.textContent = String(state.trial);
  accuracyStat.textContent = state.total ? `${Math.round((state.correct / state.total) * 100)}%` : "0%";
  refreshStat.textContent = state.frameMs ? `${Math.round(1000 / state.frameMs)}Hz` : "--Hz";
  runStatus.textContent = !state.running ? "Idle" : state.paused ? "Paused" : "Running";
  runStatus.classList.toggle("paused", state.paused);
  pauseButton.textContent = state.paused ? "Resume" : "Pause";
}

function setDirectionPreview(direction) {
  const rangePercent = getSettings().peripheralRange;
  const position = positionFromDirection(direction.angle, rangePercent * 0.55);
  directionPreview.textContent = direction.name;
  directionPreview.style.left = position.x;
  directionPreview.style.top = position.y;
  directionPreview.classList.add("visible");

  const cssRotation = 90 - direction.angle;
  sectorHighlight.style.transform = `translate(-50%, -50%) rotate(${cssRotation}deg)`;
  sectorHighlight.classList.add("active");
}

function hideDirectionPreview() {
  hoverDirection = null;
  directionPreview.classList.remove("visible");
  sectorHighlight.classList.remove("active");
  // Don't wipe feedback styling if we're showing feedback
  if (!responseOverlay.classList.contains("feedback-mode")) {
    promptText.className = "";
  }
}

startButton.addEventListener("click", startSession);
settingsButton.addEventListener("click", () => settingsPanel.classList.add("open"));
closeSettingsButton.addEventListener("click", () => settingsPanel.classList.remove("open"));
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

    if (input === startDurationInput) {
      state.duration = settings.startDuration;
    } else {
      state.duration = clamp(state.duration, getEffectiveMinDuration(), settings.maxDuration);
    }

    saveFlashDuration();
    updateStats();
  });
});
window.addEventListener("keydown", (event) => {
  const key = event.key.toUpperCase();
  if (key === " ") {
    event.preventDefault();
    if (state.running) togglePause();
    return;
  }
  if (key === "ESCAPE") settingsPanel.classList.remove("open");
});

// --- Settings persistence ---
const SETTINGS_KEY = "ufov_settings";

const allSettingInputs = [
  levelSelect, autoProgressInput, trialsToCheckInput,
  targetAccuracyInput, regressAccuracyInput, startDurationInput, minDurationInput, maxDurationInput,
  fixationInput, maskInput, correctDelayInput, missDelayInput,
  peripheralTargetInput, rangeSlider, distractorInput
];

function saveSettings() {
  const data = {};
  allSettingInputs.forEach((input) => {
    data[input.id] = input.type === "checkbox" ? input.checked : input.value;
  });
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(data)); } catch (_) {}
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

allSettingInputs.forEach((input) => input.addEventListener("change", saveSettings));
[levelSelect, autoProgressInput, trialsToCheckInput, targetAccuracyInput, regressAccuracyInput].forEach((input) => {
  input.addEventListener("change", () => {
    resetProgressWindow();
    updateStats();
  });
});
rangeSlider.addEventListener("input", () => {
  saveSettings();
  updateLayout();
});

window.addEventListener("resize", () => {
  updateLayout();
});

loadSettings();
updateLayout();
updateStats();

resetSettingsButton.addEventListener("click", () => {
  try { localStorage.removeItem(SETTINGS_KEY); } catch (_) {}
  try { localStorage.removeItem(FLASH_DURATION_KEY); } catch (_) {}
  const defaults = {
    levelSelect: "3",
    autoProgressInput: true,
    trialsToCheckInput: "4",
    targetAccuracyInput: "80",
    regressAccuracyInput: "50",
    startDurationInput: "500",
    minDurationInput: "16",
    maxDurationInput: "500",
    fixationInput: "1200",
    maskInput: "90",
    correctDelayInput: "650",
    missDelayInput: "1000",
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
