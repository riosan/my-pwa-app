const translations = {
  en: {
    eyebrow: "Bakery production",
    title: "Portion Planner",
    inputHeading: "Input",
    calculate: "Calculate",
    now: "Now",
    productionStart: "Production start",
    productionEnd: "Production end",
    portionMinutes: "Full portion time, min",
    portionKg: "Full portion weight, kg",
    currentPortion: "Current portion number",
    presetsHeading: "Presets",
    preset: "Preset",
    savePreset: "Save preset",
    deletePreset: "Delete preset",
    presetNamePrompt: "Preset name",
    cannotDeletePreset: "Built-in presets cannot be deleted.",
    additivesHeading: "Additives per full portion",
    resetAdditives: "Reset additives",
    clearAll: "Clear all",
    clearAllConfirm: "Reset all values?",
    fatKg: "Fat, kg",
    waterLiters: "Water, l",
    sugarKg: "Sugar, kg",
    flourKg: "Flour, kg",
    breaksHeading: "Breaks",
    addBreak: "Add break",
    breakName: "Break name",
    breakStart: "Break start",
    breakEnd: "Break end",
    breakDefaultName: "Break",
    removeBreak: "Remove break",
    resultsHeading: "Result",
    copySchedule: "Copy schedule",
    copied: "Copied",
    copyFailed: "Copy failed",
    totalPortions: "Total portions",
    totalWeight: "Total weight",
    totalFat: "Total fat",
    totalWater: "Total water",
    totalSugar: "Total sugar",
    totalFlour: "Total flour",
    lastPortion: "Last portion",
    full: "Full",
    partial: "Partial",
    portion: "Portion",
    start: "Start",
    end: "End",
    weight: "Weight",
    fat: "Fat",
    water: "Water",
    sugar: "Sugar",
    flour: "Flour",
    scheduleStart: "Product start",
    overnight: "overnight",
    noRows: "No portions calculated",
    historyHeading: "History",
    clearHistory: "Clear history",
    noHistory: "No saved calculations yet",
    load: "Load",
    validationPortion: "Full portion time and weight must be greater than zero.",
    validationBreak: "Some breaks are outside production time and were ignored."
  },
  nl: {
    eyebrow: "Bakkerijproductie",
    title: "Portieplanner",
    inputHeading: "Invoer",
    calculate: "Berekenen",
    now: "Nu",
    productionStart: "Start productie",
    productionEnd: "Einde productie",
    portionMinutes: "Tijd volle portie, min",
    portionKg: "Gewicht volle portie, kg",
    currentPortion: "Huidig portienummer",
    presetsHeading: "Presets",
    preset: "Preset",
    savePreset: "Preset opslaan",
    deletePreset: "Preset verwijderen",
    presetNamePrompt: "Naam preset",
    cannotDeletePreset: "Standaardpresets kunnen niet worden verwijderd.",
    additivesHeading: "Toevoegingen per volle portie",
    resetAdditives: "Toevoegingen resetten",
    clearAll: "Alles wissen",
    clearAllConfirm: "Alle waarden resetten?",
    fatKg: "Vet, kg",
    waterLiters: "Water, l",
    sugarKg: "Suiker, kg",
    flourKg: "Meel, kg",
    breaksHeading: "Pauzes",
    addBreak: "Pauze toevoegen",
    breakName: "Naam pauze",
    breakStart: "Start pauze",
    breakEnd: "Einde pauze",
    breakDefaultName: "Pauze",
    removeBreak: "Pauze verwijderen",
    resultsHeading: "Resultaat",
    copySchedule: "Schema kopieren",
    copied: "Gekopieerd",
    copyFailed: "Kopieren mislukt",
    totalPortions: "Totaal porties",
    totalWeight: "Totaal gewicht",
    totalFat: "Totaal vet",
    totalWater: "Totaal water",
    totalSugar: "Totaal suiker",
    totalFlour: "Totaal meel",
    lastPortion: "Laatste portie",
    full: "Volledig",
    partial: "Gedeeltelijk",
    portion: "Portie",
    start: "Start",
    end: "Einde",
    weight: "Gewicht",
    fat: "Vet",
    water: "Water",
    sugar: "Suiker",
    flour: "Meel",
    scheduleStart: "Product start",
    overnight: "nacht",
    noRows: "Geen porties berekend",
    historyHeading: "Geschiedenis",
    clearHistory: "Geschiedenis wissen",
    noHistory: "Nog geen opgeslagen berekeningen",
    load: "Laden",
    validationPortion: "Tijd en gewicht van een volle portie moeten groter zijn dan nul.",
    validationBreak: "Sommige pauzes liggen buiten productietijd en zijn genegeerd."
  }
};

const stateKey = "bakeryPortionPlannerState";
const presetKey = "bakeryPortionPlannerPresets";
const historyKey = "bakeryPortionPlannerHistory";
const maxHistoryItems = 10;

const fields = [
  "productionStart",
  "productionEnd",
  "portionMinutes",
  "portionKg",
  "currentPortion",
  "fatKg",
  "waterLiters",
  "sugarKg",
  "flourKg"
];

const defaultFields = {
  productionStart: "05:20",
  productionEnd: "13:30",
  portionMinutes: "30",
  portionKg: "240",
  currentPortion: "1",
  fatKg: "0",
  waterLiters: "0",
  sugarKg: "0",
  flourKg: "0"
};

const builtInPresets = [
  {
    id: "standard",
    builtIn: true,
    labels: { en: "Standard", nl: "Standaard" },
    fields: defaultFields,
    breaks: []
  },
  {
    id: "morning",
    builtIn: true,
    labels: { en: "Morning shift", nl: "Ochtenddienst" },
    fields: { ...defaultFields, productionStart: "05:00", productionEnd: "13:30" },
    breaks: [{ name: "Break", start: "07:45", end: "08:03" }, { name: "Break", start: "10:20", end: "10:38" }]
  },
  {
    id: "evening",
    builtIn: true,
    labels: { en: "Evening shift", nl: "Avonddienst" },
    fields: { ...defaultFields, productionStart: "13:30", productionEnd: "22:00" },
    breaks: [{ name: "Break", start: "15:20", end: "15:38" }, { name: "Break", start: "18:20", end: "18:38" }]
  }
];

let language = "en";
let breaks = [];
let customPresets = [];
let historyItems = [];
let lastResults = [];
let lastWarnings = [];
let lastSelectedPreset = "standard";

const elements = {
  breakList: document.querySelector("#breakList"),
  presetSelect: document.querySelector("#presetSelect"),
  resultRows: document.querySelector("#resultRows"),
  historyList: document.querySelector("#historyList"),
  errorMessage: document.querySelector("#errorMessage"),
  scheduleStart: document.querySelector("#scheduleStart"),
  totalPortions: document.querySelector("#totalPortions"),
  totalWeight: document.querySelector("#totalWeight"),
  totalFat: document.querySelector("#totalFat"),
  totalWater: document.querySelector("#totalWater"),
  totalSugar: document.querySelector("#totalSugar"),
  totalFlour: document.querySelector("#totalFlour"),
  lastPortion: document.querySelector("#lastPortion")
};

function minuteOfDay(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function shiftBounds() {
  const start = minuteOfDay(document.querySelector("#productionStart").value);
  let end = minuteOfDay(document.querySelector("#productionEnd").value);

  if (end <= start) {
    end += 1440;
  }

  return { start, end, isOvernight: end >= 1440 };
}

function normalizeTime(value, bounds) {
  let minutes = minuteOfDay(value);

  if (bounds.isOvernight && minutes < bounds.start) {
    minutes += 1440;
  }

  return minutes;
}

function timeFromMinutes(totalMinutes) {
  const dayOffset = totalMinutes >= 1440 ? " +1" : "";
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minutes = String(normalized % 60).padStart(2, "0");
  return `${hours}:${minutes}${dayOffset}`;
}

function nowTimeValue() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function numberValue(id) {
  const value = document.querySelector(`#${id}`).value.replace(",", ".");
  return Number.parseFloat(value) || 0;
}

function getFormFields() {
  return Object.fromEntries(fields.map((id) => [id, document.querySelector(`#${id}`).value]));
}

function setFormFields(values) {
  fields.forEach((id) => {
    document.querySelector(`#${id}`).value = values[id] ?? defaultFields[id];
  });
}

function cleanBreak(item, index = 0) {
  return {
    name: item.name || `${t("breakDefaultName")} ${index + 1}`,
    start: item.start || "10:00",
    end: item.end || "10:15"
  };
}

function sortedBreaks(bounds) {
  const warnings = [];
  const pauseList = breaks
    .map((item, index) => {
      let start = normalizeTime(item.start, bounds);
      let end = normalizeTime(item.end, bounds);

      if (end <= start) {
        end += 1440;
      }

      const clippedStart = Math.max(start, bounds.start);
      const clippedEnd = Math.min(end, bounds.end);
      const isOutside = clippedEnd <= bounds.start || clippedStart >= bounds.end || clippedEnd <= clippedStart;

      if (isOutside) {
        warnings.push(t("validationBreak"));
        return null;
      }

      return {
        name: item.name || `${t("breakDefaultName")} ${index + 1}`,
        start: clippedStart,
        end: clippedEnd
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.start - b.start);

  return { pauseList, warnings: [...new Set(warnings)] };
}

function skipBreakIfNeeded(cursor, pauseList, productionEnd) {
  const activeBreak = pauseList.find((item) => cursor >= item.start && cursor < item.end);
  return activeBreak ? Math.min(activeBreak.end, productionEnd) : cursor;
}

function workingMinutes(from, to, pauseList) {
  let cursor = from;
  let minutes = 0;

  while (cursor < to) {
    const activeBreak = pauseList.find((item) => cursor >= item.start && cursor < item.end);
    if (activeBreak) {
      cursor = Math.min(activeBreak.end, to);
      continue;
    }

    const nextBreak = pauseList.find((item) => item.start > cursor);
    const segmentEnd = Math.min(nextBreak ? nextBreak.start : to, to);
    minutes += Math.max(0, segmentEnd - cursor);
    cursor = segmentEnd;
  }

  return minutes;
}

function addWorkingMinutes(minutesToAdd, from, pauseList, productionEnd) {
  let cursor = from;
  let remaining = minutesToAdd;

  while (remaining > 0 && cursor < productionEnd) {
    const activeBreak = pauseList.find((item) => cursor >= item.start && cursor < item.end);
    if (activeBreak) {
      cursor = Math.min(activeBreak.end, productionEnd);
      continue;
    }

    const nextBreak = pauseList.find((item) => item.start > cursor);
    const segmentEnd = Math.min(nextBreak ? nextBreak.start : productionEnd, productionEnd);
    const available = segmentEnd - cursor;

    if (remaining <= available) {
      return cursor + remaining;
    }

    remaining -= available;
    cursor = segmentEnd;
  }

  return Math.min(cursor, productionEnd);
}

function calculatePortions(options = {}) {
  const shouldRecordHistory = options.recordHistory === true;
  const bounds = shiftBounds();
  const fullPortionMinutes = numberValue("portionMinutes");
  const fullPortionKg = numberValue("portionKg");

  if (fullPortionMinutes <= 0 || fullPortionKg <= 0) {
    showError(t("validationPortion"));
    renderResults([]);
    return;
  }

  const { pauseList, warnings } = sortedBreaks(bounds);
  lastWarnings = warnings;
  showWarnings(warnings);

  const additives = {
    fatKg: numberValue("fatKg"),
    waterLiters: numberValue("waterLiters"),
    sugarKg: numberValue("sugarKg"),
    flourKg: numberValue("flourKg")
  };

  const results = [];
  let cursor = bounds.start;
  let portionNumber = Math.max(1, Number.parseInt(document.querySelector("#currentPortion").value, 10) || 1);

  while (cursor < bounds.end) {
    cursor = skipBreakIfNeeded(cursor, pauseList, bounds.end);

    if (cursor >= bounds.end) {
      break;
    }

    const remainingWorking = workingMinutes(cursor, bounds.end, pauseList);
    const usedMinutes = Math.min(remainingWorking, fullPortionMinutes);

    if (usedMinutes <= 0) {
      break;
    }

    const ratio = usedMinutes / fullPortionMinutes;
    const end = addWorkingMinutes(usedMinutes, cursor, pauseList, bounds.end);

    results.push({
      number: portionNumber,
      start: cursor,
      end,
      kg: fullPortionKg * ratio,
      fatKg: additives.fatKg * ratio,
      waterLiters: additives.waterLiters * ratio,
      sugarKg: additives.sugarKg * ratio,
      flourKg: additives.flourKg * ratio,
      isPartial: ratio < 0.999
    });

    portionNumber += 1;
    cursor = end;

    if (ratio < 0.999) {
      break;
    }
  }

  lastResults = results;
  renderResults(results, bounds);
  saveState();

  if (shouldRecordHistory && results.length) {
    addHistoryItem(results, bounds);
  }
}

function renderResults(results, bounds = shiftBounds()) {
  elements.resultRows.innerHTML = "";
  const overnightLabel = bounds.isOvernight ? ` (${t("overnight")})` : "";
  elements.scheduleStart.textContent = `${t("scheduleStart")}: ${timeFromMinutes(bounds.start)}${overnightLabel}`;

  const totals = results.reduce(
    (sum, item) => ({
      kg: sum.kg + item.kg,
      fatKg: sum.fatKg + item.fatKg,
      waterLiters: sum.waterLiters + item.waterLiters,
      sugarKg: sum.sugarKg + item.sugarKg,
      flourKg: sum.flourKg + item.flourKg
    }),
    { kg: 0, fatKg: 0, waterLiters: 0, sugarKg: 0, flourKg: 0 }
  );

  elements.totalPortions.textContent = String(results.length);
  elements.totalWeight.textContent = `${formatNumber(totals.kg)} kg`;
  setSignedTotal(elements.totalFat, totals.fatKg, "kg");
  setSignedTotal(elements.totalWater, totals.waterLiters, "l");
  setSignedTotal(elements.totalSugar, totals.sugarKg, "kg");
  setSignedTotal(elements.totalFlour, totals.flourKg, "kg");
  elements.lastPortion.textContent = results.length
    ? t(results[results.length - 1].isPartial ? "partial" : "full")
    : "-";

  if (!results.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="8">${t("noRows")}</td>`;
    elements.resultRows.append(row);
    return;
  }

  for (const item of results) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        ${item.number}
        ${item.isPartial ? `<span class="partial-badge">${t("partial")}</span>` : ""}
      </td>
      <td>${timeFromMinutes(item.start)}</td>
      <td>${timeFromMinutes(item.end)}</td>
      <td>${formatNumber(item.kg)} kg</td>
      <td>${signedValue(item.fatKg, "kg")}</td>
      <td>${signedValue(item.waterLiters, "l")}</td>
      <td>${signedValue(item.sugarKg, "kg")}</td>
      <td>${signedValue(item.flourKg, "kg")}</td>
    `;
    elements.resultRows.append(row);
  }
}

function renderBreaks() {
  elements.breakList.innerHTML = "";

  for (const [index, item] of breaks.entries()) {
    const row = document.createElement("div");
    row.className = "break-row";
    row.innerHTML = `
      <label>
        <span>${t("breakName")}</span>
        <input type="text" value="${escapeHtml(item.name || "")}" data-break-index="${index}" data-break-field="name" autocomplete="off">
      </label>
      <label>
        <span>${t("breakStart")}</span>
        <input type="time" value="${item.start}" data-break-index="${index}" data-break-field="start">
      </label>
      <label>
        <span>${t("breakEnd")}</span>
        <input type="time" value="${item.end}" data-break-index="${index}" data-break-field="end">
      </label>
      <button class="remove-button" type="button" aria-label="${t("removeBreak")}" title="${t("removeBreak")}" data-remove-break="${index}">x</button>
    `;
    elements.breakList.append(row);
  }
}

function renderPresets() {
  const selected = elements.presetSelect.value || lastSelectedPreset;
  const presets = allPresets();
  elements.presetSelect.innerHTML = "";

  for (const preset of presets) {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.labels?.[language] || preset.name;
    elements.presetSelect.append(option);
  }

  elements.presetSelect.value = presets.some((preset) => preset.id === selected) ? selected : "standard";
}

function renderHistory() {
  elements.historyList.innerHTML = "";

  if (!historyItems.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = t("noHistory");
    elements.historyList.append(empty);
    return;
  }

  for (const item of historyItems) {
    const row = document.createElement("div");
    row.className = "history-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(item.label)}</strong>
        <span>${item.summary}</span>
      </div>
      <button class="secondary-button compact-button" type="button" data-history-id="${item.id}">${t("load")}</button>
    `;
    elements.historyList.append(row);
  }
}

function addBreak() {
  breaks.push({
    name: `${t("breakDefaultName")} ${breaks.length + 1}`,
    start: "10:00",
    end: "10:15"
  });
  renderBreaks();
  calculatePortions();
}

function resetAdditives() {
  ["fatKg", "waterLiters", "sugarKg", "flourKg"].forEach((id) => {
    document.querySelector(`#${id}`).value = "0";
  });

  calculatePortions();
  saveState();
}

function clearAll() {
  if (!window.confirm(t("clearAllConfirm"))) {
    return;
  }

  setFormFields(defaultFields);
  breaks = [];
  renderBreaks();
  calculatePortions();
  saveState();
}

function setStartNow() {
  document.querySelector("#productionStart").value = nowTimeValue();
  calculatePortions();
  saveState();
}

function applyPreset(id) {
  const preset = allPresets().find((item) => item.id === id);
  if (!preset) {
    return;
  }

  lastSelectedPreset = id;
  setFormFields(preset.fields);
  breaks = (preset.breaks || []).map(cleanBreak);
  renderBreaks();
  calculatePortions();
  saveState();
}

function savePreset() {
  const name = window.prompt(t("presetNamePrompt"));
  if (!name?.trim()) {
    return;
  }

  const id = `custom-${Date.now()}`;
  customPresets.push({
    id,
    builtIn: false,
    name: name.trim(),
    fields: getFormFields(),
    breaks: breaks.map(cleanBreak)
  });

  lastSelectedPreset = id;
  saveCustomPresets();
  renderPresets();
  elements.presetSelect.value = id;
  saveState();
}

function deletePreset() {
  const id = elements.presetSelect.value;
  const preset = allPresets().find((item) => item.id === id);

  if (!preset || preset.builtIn) {
    showWarnings([t("cannotDeletePreset")]);
    return;
  }

  customPresets = customPresets.filter((item) => item.id !== id);
  lastSelectedPreset = "standard";
  saveCustomPresets();
  renderPresets();
  saveState();
}

async function copySchedule() {
  const text = scheduleText();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }
    showWarnings([t("copied")]);
  } catch {
    if (fallbackCopy(text)) {
      showWarnings([t("copied")]);
    } else {
      showWarnings([t("copyFailed")]);
    }
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  textarea.remove();
  return ok;
}

function scheduleText() {
  const totals = lastResults.reduce(
    (sum, item) => ({
      kg: sum.kg + item.kg,
      fatKg: sum.fatKg + item.fatKg,
      waterLiters: sum.waterLiters + item.waterLiters,
      sugarKg: sum.sugarKg + item.sugarKg,
      flourKg: sum.flourKg + item.flourKg
    }),
    { kg: 0, fatKg: 0, waterLiters: 0, sugarKg: 0, flourKg: 0 }
  );

  const lines = [
    `${t("title")}`,
    `${t("productionStart")}: ${document.querySelector("#productionStart").value}`,
    `${t("productionEnd")}: ${document.querySelector("#productionEnd").value}`,
    `${t("totalWeight")}: ${formatNumber(totals.kg)} kg`,
    `${t("totalFat")}: ${formatNumber(totals.fatKg)} kg`,
    `${t("totalWater")}: ${formatNumber(totals.waterLiters)} l`,
    `${t("totalSugar")}: ${formatNumber(totals.sugarKg)} kg`,
    `${t("totalFlour")}: ${formatNumber(totals.flourKg)} kg`,
    ""
  ];

  for (const item of lastResults) {
    lines.push(
      `${t("portion")} ${item.number}: ${timeFromMinutes(item.start)} - ${timeFromMinutes(item.end)}, ${t("weight")}: ${formatNumber(item.kg)} kg, ${t("fat")}: ${formatNumber(item.fatKg)} kg, ${t("water")}: ${formatNumber(item.waterLiters)} l, ${t("sugar")}: ${formatNumber(item.sugarKg)} kg, ${t("flour")}: ${formatNumber(item.flourKg)} kg`
    );
  }

  return lines.join("\n");
}

function addHistoryItem(results, bounds) {
  const fieldsSnapshot = getFormFields();
  const totalKg = results.reduce((sum, item) => sum + item.kg, 0);
  const id = String(Date.now());
  const label = `${fieldsSnapshot.productionStart} - ${fieldsSnapshot.productionEnd}`;
  const summary = `${results.length} ${t("portion").toLowerCase()}, ${formatNumber(totalKg)} kg`;

  historyItems = [
    {
      id,
      label,
      summary,
      fields: fieldsSnapshot,
      breaks: breaks.map(cleanBreak),
      createdAt: new Date().toISOString(),
      overnight: bounds.isOvernight
    },
    ...historyItems
  ].slice(0, maxHistoryItems);

  saveHistory();
  renderHistory();
}

function loadHistoryItem(id) {
  const item = historyItems.find((entry) => entry.id === id);
  if (!item) {
    return;
  }

  setFormFields(item.fields);
  breaks = (item.breaks || []).map(cleanBreak);
  renderBreaks();
  calculatePortions();
  saveState();
}

function setLanguage(nextLanguage) {
  language = nextLanguage;
  document.documentElement.lang = nextLanguage;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });

  document.querySelectorAll(".language-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.language === nextLanguage);
  });

  renderPresets();
  renderBreaks();
  renderHistory();
  calculatePortions();
  saveState();
}

function t(key) {
  return translations[language][key] || translations.en[key] || key;
}

function formatNumber(value) {
  return new Intl.NumberFormat(language === "nl" ? "nl-NL" : "en-US", {
    maximumFractionDigits: 2
  }).format(Math.round(value * 100) / 100);
}

function signedValue(value, unit) {
  const className = value < 0 ? "negative-value" : "";
  return `<span class="${className}">${formatNumber(value)} ${unit}</span>`;
}

function setSignedTotal(element, value, unit) {
  element.textContent = `${formatNumber(value)} ${unit}`;
  element.classList.toggle("negative-value", value < 0);
}

function showWarnings(messages) {
  const filtered = messages.filter(Boolean);

  if (!filtered.length) {
    hideError();
    return;
  }

  elements.errorMessage.textContent = filtered.join(" ");
  elements.errorMessage.hidden = false;
}

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.hidden = false;
}

function hideError() {
  elements.errorMessage.hidden = true;
}

function allPresets() {
  return [...builtInPresets, ...customPresets];
}

function saveCustomPresets() {
  localStorage.setItem(presetKey, JSON.stringify(customPresets));
}

function saveHistory() {
  localStorage.setItem(historyKey, JSON.stringify(historyItems));
}

function saveState() {
  const data = {
    language,
    breaks,
    selectedPreset: elements.presetSelect.value || lastSelectedPreset,
    fields: getFormFields()
  };

  localStorage.setItem(stateKey, JSON.stringify(data));
}

function loadState() {
  loadCustomPresets();
  loadHistory();

  const raw = localStorage.getItem(stateKey);
  if (!raw) {
    setFormFields(defaultFields);
    return;
  }

  try {
    const data = JSON.parse(raw);
    language = data.language === "nl" ? "nl" : "en";
    breaks = Array.isArray(data.breaks) ? data.breaks.map(cleanBreak) : [];
    lastSelectedPreset = data.selectedPreset || "standard";
    setFormFields(data.fields || defaultFields);
  } catch {
    localStorage.removeItem(stateKey);
    setFormFields(defaultFields);
  }
}

function loadCustomPresets() {
  try {
    customPresets = JSON.parse(localStorage.getItem(presetKey) || "[]");
  } catch {
    customPresets = [];
  }
}

function loadHistory() {
  try {
    historyItems = JSON.parse(localStorage.getItem(historyKey) || "[]");
  } catch {
    historyItems = [];
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

document.querySelector("#calculateBtn").addEventListener("click", () => calculatePortions({ recordHistory: true }));
document.querySelector("#addBreakBtn").addEventListener("click", addBreak);
document.querySelector("#resetAdditivesBtn").addEventListener("click", resetAdditives);
document.querySelector("#clearAllBtn").addEventListener("click", clearAll);
document.querySelector("#nowBtn").addEventListener("click", setStartNow);
document.querySelector("#savePresetBtn").addEventListener("click", savePreset);
document.querySelector("#deletePresetBtn").addEventListener("click", deletePreset);
document.querySelector("#copyScheduleBtn").addEventListener("click", copySchedule);
document.querySelector("#clearHistoryBtn").addEventListener("click", () => {
  historyItems = [];
  saveHistory();
  renderHistory();
});

elements.presetSelect.addEventListener("change", (event) => applyPreset(event.target.value));

document.querySelectorAll("input").forEach((input) => {
  input.addEventListener("change", () => {
    calculatePortions();
    saveState();
  });
});

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

elements.breakList.addEventListener("change", (event) => {
  const input = event.target.closest("input[data-break-index]");
  if (!input) {
    return;
  }

  breaks[Number(input.dataset.breakIndex)][input.dataset.breakField] = input.value;
  calculatePortions();
  saveState();
});

elements.breakList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-break]");
  if (!button) {
    return;
  }

  breaks.splice(Number(button.dataset.removeBreak), 1);
  renderBreaks();
  calculatePortions();
  saveState();
});

elements.historyList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-history-id]");
  if (!button) {
    return;
  }

  loadHistoryItem(button.dataset.historyId);
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

loadState();
renderPresets();
elements.presetSelect.value = lastSelectedPreset;
setLanguage(language);
