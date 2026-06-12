const translations = {
  en: {
    eyebrow: "Bakery production",
    title: "Portion Planner",
    inputHeading: "Input",
    calculate: "Calculate",
    productionStart: "Production start",
    productionEnd: "Production end",
    portionMinutes: "Full portion time, min",
    portionKg: "Full portion weight, kg",
    currentPortion: "Current portion number",
    additivesHeading: "Additives per full portion",
    fatKg: "Fat, kg",
    waterLiters: "Water, l",
    sugarKg: "Sugar, kg",
    flourKg: "Flour, kg",
    breaksHeading: "Breaks",
    addBreak: "Add break",
    breakStart: "Break start",
    breakEnd: "Break end",
    removeBreak: "Remove break",
    resultsHeading: "Result",
    totalPortions: "Total portions",
    totalWeight: "Total weight",
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
    noRows: "No portions calculated",
    validationTime: "Production end must be later than production start.",
    validationPortion: "Full portion time and weight must be greater than zero."
  },
  nl: {
    eyebrow: "Bakkerijproductie",
    title: "Portieplanner",
    inputHeading: "Invoer",
    calculate: "Berekenen",
    productionStart: "Start productie",
    productionEnd: "Einde productie",
    portionMinutes: "Tijd volle portie, min",
    portionKg: "Gewicht volle portie, kg",
    currentPortion: "Huidig portienummer",
    additivesHeading: "Toevoegingen per volle portie",
    fatKg: "Vet, kg",
    waterLiters: "Water, l",
    sugarKg: "Suiker, kg",
    flourKg: "Meel, kg",
    breaksHeading: "Pauzes",
    addBreak: "Pauze toevoegen",
    breakStart: "Start pauze",
    breakEnd: "Einde pauze",
    removeBreak: "Pauze verwijderen",
    resultsHeading: "Resultaat",
    totalPortions: "Totaal porties",
    totalWeight: "Totaal gewicht",
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
    noRows: "Geen porties berekend",
    validationTime: "Het einde van de productie moet later zijn dan de start.",
    validationPortion: "Tijd en gewicht van een volle portie moeten groter zijn dan nul."
  }
};

const stateKey = "bakeryPortionPlannerState";
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

let language = "en";
let breaks = [];

const elements = {
  breakList: document.querySelector("#breakList"),
  resultRows: document.querySelector("#resultRows"),
  errorMessage: document.querySelector("#errorMessage"),
  scheduleStart: document.querySelector("#scheduleStart"),
  totalPortions: document.querySelector("#totalPortions"),
  totalWeight: document.querySelector("#totalWeight"),
  lastPortion: document.querySelector("#lastPortion")
};

function minuteOfDay(value) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function timeFromMinutes(totalMinutes) {
  const normalized = Math.max(0, Math.min(24 * 60 - 1, Math.round(totalMinutes)));
  const hours = String(Math.floor(normalized / 60)).padStart(2, "0");
  const minutes = String(normalized % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function numberValue(id) {
  const value = document.querySelector(`#${id}`).value.replace(",", ".");
  return Number.parseFloat(value) || 0;
}

function sortedBreaks() {
  return breaks
    .map((item) => ({
      start: minuteOfDay(item.start),
      end: minuteOfDay(item.end)
    }))
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start);
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

function calculatePortions() {
  const productionStart = minuteOfDay(document.querySelector("#productionStart").value);
  const productionEnd = minuteOfDay(document.querySelector("#productionEnd").value);
  const fullPortionMinutes = numberValue("portionMinutes");
  const fullPortionKg = numberValue("portionKg");

  if (productionEnd <= productionStart) {
    showError(t("validationTime"));
    renderResults([]);
    return;
  }

  if (fullPortionMinutes <= 0 || fullPortionKg <= 0) {
    showError(t("validationPortion"));
    renderResults([]);
    return;
  }

  hideError();

  const additives = {
    fatKg: numberValue("fatKg"),
    waterLiters: numberValue("waterLiters"),
    sugarKg: numberValue("sugarKg"),
    flourKg: numberValue("flourKg")
  };

  const pauseList = sortedBreaks();
  const results = [];
  let cursor = productionStart;
  let portionNumber = Math.max(1, Number.parseInt(document.querySelector("#currentPortion").value, 10) || 1);

  while (cursor < productionEnd) {
    cursor = skipBreakIfNeeded(cursor, pauseList, productionEnd);

    if (cursor >= productionEnd) {
      break;
    }

    const remainingWorking = workingMinutes(cursor, productionEnd, pauseList);
    const usedMinutes = Math.min(remainingWorking, fullPortionMinutes);

    if (usedMinutes <= 0) {
      break;
    }

    const ratio = usedMinutes / fullPortionMinutes;
    const end = addWorkingMinutes(usedMinutes, cursor, pauseList, productionEnd);

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

  renderResults(results);
  saveState();
}

function renderResults(results) {
  elements.resultRows.innerHTML = "";
  elements.scheduleStart.textContent = `${t("scheduleStart")}: ${document.querySelector("#productionStart").value}`;
  elements.totalPortions.textContent = String(results.length);
  elements.totalWeight.textContent = `${formatNumber(results.reduce((sum, item) => sum + item.kg, 0))} kg`;
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
      <td>${formatNumber(item.fatKg)} kg</td>
      <td>${formatNumber(item.waterLiters)} l</td>
      <td>${formatNumber(item.sugarKg)} kg</td>
      <td>${formatNumber(item.flourKg)} kg</td>
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

function addBreak() {
  breaks.push({ start: "10:00", end: "10:15" });
  renderBreaks();
  calculatePortions();
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

  renderBreaks();
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

function showError(message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.hidden = false;
}

function hideError() {
  elements.errorMessage.hidden = true;
}

function saveState() {
  const data = {
    language,
    breaks,
    fields: Object.fromEntries(fields.map((id) => [id, document.querySelector(`#${id}`).value]))
  };

  localStorage.setItem(stateKey, JSON.stringify(data));
}

function loadState() {
  const raw = localStorage.getItem(stateKey);
  if (!raw) {
    return;
  }

  try {
    const data = JSON.parse(raw);
    language = data.language === "nl" ? "nl" : "en";
    breaks = Array.isArray(data.breaks) ? data.breaks : [];

    for (const id of fields) {
      if (data.fields?.[id]) {
        document.querySelector(`#${id}`).value = data.fields[id];
      }
    }
  } catch {
    localStorage.removeItem(stateKey);
  }
}

document.querySelector("#calculateBtn").addEventListener("click", calculatePortions);
document.querySelector("#addBreakBtn").addEventListener("click", addBreak);

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
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js");
  });
}

loadState();
setLanguage(language);
