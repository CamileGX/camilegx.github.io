const STORAGE_KEY = "dexieos-data-v1";
const WEATHER_CACHE_KEY = "dexieos-weather-cache-v1";

const initialData = {
  projects: [
    {
      id: crypto.randomUUID(),
      name: "DexieOS",
      description: "Osobiste centrum projektów, notatek i codziennych informacji.",
      status: "active",
      priority: "high",
      progress: 45,
      link: "https://github.com/CamileGX/camilegx.github.io",
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Genealogy",
      description: "Porządkowanie rodzinnych nazwisk, miejscowości, map i dopasowań DNA.",
      status: "active",
      priority: "medium",
      progress: 35,
      link: "",
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Job Search",
      description: "CV, aplikacje i organizacja powrotu do pracy.",
      status: "active",
      priority: "high",
      progress: 30,
      link: "",
      updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: "Gaming",
      description: "Lista gier, serwerów i pomysłów związanych z ARK oraz innymi tytułami.",
      status: "planned",
      priority: "low",
      progress: 10,
      link: "",
      updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
    }
  ],
  notes: [
    {
      id: crypto.randomUUID(),
      title: "DexieOS — kierunek",
      category: "Projekty",
      content: "Strona ma być praktyczna: projekty, notatki, pogoda Southampton, timeline i eksport danych.",
      updatedAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: "Pomysły do rozbudowy",
      category: "Pomysły",
      content: "Później można dodać synchronizację, skróty do usług, RSS albo panel GitHub.",
      updatedAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  timeline: [
    {
      id: crypto.randomUUID(),
      title: "Start DexieOS",
      date: new Date().toISOString().slice(0, 10),
      content: "Pierwsza działająca wersja osobistego centrum dowodzenia.",
      tags: "DexieOS, GitHub"
    }
  ],
  knowledge: [
    {
      id: crypto.randomUUID(),
      title: "GitHub Pages",
      date: "",
      content: "Statyczne strony działają bez backendu. Najbezpieczniejsze są ścieżki względne zaczynające się od ./",
      tags: "GitHub, Web"
    },
    {
      id: crypto.randomUUID(),
      title: "LocalStorage",
      date: "",
      content: "Dane są przechowywane lokalnie w przeglądarce. Eksport JSON chroni przed utratą wpisów.",
      tags: "JavaScript, Dane"
    }
  ],
  changelog: [
    {
      id: crypto.randomUUID(),
      title: "DexieOS v1.0",
      date: new Date().toISOString().slice(0, 10),
      content: "Dashboard, pogoda Southampton, projekty, notatki, timeline, baza wiedzy, ustawienia i import/eksport.",
      tags: "Release"
    }
  ],
  settings: {
    theme: "dark",
    accent: "#7c8cff",
    animations: true
  }
};

let state = loadState();
let activeNoteId = state.notes[0]?.id || null;

const qs = (selector, parent = document) => parent.querySelector(selector);
const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved && saved.projects && saved.notes ? saved : structuredClone(initialData);
  } catch {
    return structuredClone(initialData);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatDate(value, options = {}) {
  if (!value) return "Brak daty";
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/London",
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options
  }).format(new Date(value));
}

function relativeDate(value) {
  const diff = Date.now() - new Date(value).getTime();
  if (diff < 60000) return "przed chwilą";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min temu`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} godz. temu`;
  return `${Math.floor(diff / 86400000)} dni temu`;
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function showToast(message) {
  const toast = qs("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2600);
}

function openView(name) {
  qsa(".view").forEach(view => view.classList.toggle("active", view.id === `view-${name}`));
  qsa(".nav-item").forEach(item => item.classList.toggle("active", item.dataset.view === name));
  qs("#sidebar").classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setClock() {
  const now = new Date();
  qs("#currentTime").textContent = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(now);
  qs("#currentDate").textContent = new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/London",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(now);
}

const weatherCode = {
  0: ["Bezchmurnie", "☀"],
  1: ["Przeważnie pogodnie", "◐"],
  2: ["Częściowe zachmurzenie", "☁"],
  3: ["Pochmurno", "☁"],
  45: ["Mgła", "≋"],
  48: ["Mgła osadzająca szadź", "≋"],
  51: ["Lekka mżawka", "☂"],
  53: ["Mżawka", "☂"],
  55: ["Silna mżawka", "☂"],
  61: ["Lekki deszcz", "☂"],
  63: ["Deszcz", "☂"],
  65: ["Silny deszcz", "☂"],
  71: ["Lekki śnieg", "❄"],
  73: ["Śnieg", "❄"],
  75: ["Silny śnieg", "❄"],
  80: ["Przelotne opady", "☂"],
  81: ["Przelotne opady", "☂"],
  82: ["Silne opady", "☂"],
  95: ["Burza", "ϟ"],
  96: ["Burza z gradem", "ϟ"],
  99: ["Silna burza z gradem", "ϟ"]
};

async function loadWeather(force = false) {
  const container = qs("#weatherContent");
  const cached = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "null");
  if (!force && cached && Date.now() - cached.savedAt < 20 * 60 * 1000) {
    renderWeather(cached.data, true);
    return;
  }

  container.innerHTML = `<div class="weather-main"><span class="weather-icon">◌</span><strong>Ładowanie…</strong></div>`;
  try {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=50.9039&longitude=-1.4043&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=sunrise,sunset&timezone=Europe%2FLondon&forecast_days=1";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather request failed");
    const data = await response.json();
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ savedAt: Date.now(), data }));
    renderWeather(data, false);
  } catch {
    if (cached) {
      renderWeather(cached.data, true);
      showToast("Pokazuję ostatnią zapisaną pogodę.");
    } else {
      container.innerHTML = `
        <div class="weather-main"><span class="weather-icon">!</span><strong>Pogoda niedostępna</strong></div>
        <p style="color:var(--muted);margin-top:12px">Sprawdź połączenie z internetem i odśwież.</p>`;
    }
  }
}

function renderWeather(data, cached) {
  const current = data.current;
  const daily = data.daily;
  const [label, icon] = weatherCode[current.weather_code] || ["Warunki pogodowe", "◌"];
  const timeOnly = value => new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/London", hour: "2-digit", minute: "2-digit"
  }).format(new Date(value));

  qs("#weatherContent").innerHTML = `
    <div class="weather-main">
      <span class="weather-icon">${icon}</span>
      <div><strong>${Math.round(current.temperature_2m)}°C</strong><span style="display:block;color:var(--muted)">${label}${cached ? " · zapisane" : ""}</span></div>
    </div>
    <div class="weather-details">
      <div class="weather-detail"><span>Odczuwalna</span><strong>${Math.round(current.apparent_temperature)}°C</strong></div>
      <div class="weather-detail"><span>Wilgotność</span><strong>${current.relative_humidity_2m}%</strong></div>
      <div class="weather-detail"><span>Wiatr</span><strong>${Math.round(current.wind_speed_10m)} km/h</strong></div>
      <div class="weather-detail"><span>Wschód</span><strong>${timeOnly(daily.sunrise[0])}</strong></div>
      <div class="weather-detail"><span>Zachód</span><strong>${timeOnly(daily.sunset[0])}</strong></div>
      <div class="weather-detail"><span>Lokalizacja</span><strong>Southampton</strong></div>
    </div>`;
}

const statusLabels = {
  active: "Aktywny", planned: "Planowany", paused: "Wstrzymany", done: "Zakończony"
};
const priorityLabels = { high: "Wysoki", medium: "Średni", low: "Niski" };

function projectCard(project, compact = false) {
  return `
    <article class="project-card" data-project-id="${project.id}">
      <div class="project-card-top">
        <span class="badge">${statusLabels[project.status]}</span>
        ${compact ? "" : `<div class="project-menu">
          <button data-edit-project="${project.id}" title="Edytuj">✎</button>
          <button data-delete-project="${project.id}" title="Usuń">×</button>
        </div>`}
      </div>
      <h3>${escapeHtml(project.name)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${project.progress}%"></div></div>
      <div class="project-meta">
        <span>${project.progress}%</span>
        <span>${compact ? relativeDate(project.updatedAt) : `Priorytet: ${priorityLabels[project.priority]}`}</span>
      </div>
    </article>`;
}

function renderProjects() {
  const filter = qs("#projectStatusFilter").value;
  const projects = [...state.projects]
    .filter(p => filter === "all" || p.status === filter)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  qs("#projectsGrid").innerHTML = projects.length
    ? projects.map(p => projectCard(p)).join("")
    : `<div class="empty-state"><div><h2>Brak projektów</h2><p>Dodaj pierwszy projekt.</p></div></div>`;

  const dashboard = [...state.projects]
    .filter(p => p.status === "active")
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 4);
  qs("#dashboardProjects").innerHTML = dashboard.map(p => projectCard(p, true)).join("");

  const focus = dashboard[0] || state.projects[0];
  qs("#focusCard").innerHTML = focus ? `
    <div><span class="badge">${statusLabels[focus.status]}</span><h3>${escapeHtml(focus.name)}</h3><p style="color:var(--muted)">${escapeHtml(focus.description)}</p></div>
    <div><div style="display:flex;justify-content:space-between"><span>Postęp</span><strong>${focus.progress}%</strong></div>
    <div class="progress-bar"><div class="progress-fill" style="width:${focus.progress}%"></div></div></div>`
    : `<p style="color:var(--muted)">Brak projektów.</p>`;
}

function openProjectDialog(project = null) {
  const dialog = qs("#projectDialog");
  qs("#projectDialogTitle").textContent = project ? "Edytuj projekt" : "Nowy projekt";
  qs("#projectId").value = project?.id || "";
  qs("#projectName").value = project?.name || "";
  qs("#projectDescription").value = project?.description || "";
  qs("#projectStatus").value = project?.status || "active";
  qs("#projectPriority").value = project?.priority || "medium";
  qs("#projectProgress").value = project?.progress ?? 0;
  qs("#projectProgressValue").textContent = `${project?.progress ?? 0}%`;
  qs("#projectLink").value = project?.link || "";
  dialog.showModal();
}

function renderNotes() {
  const query = qs("#notesSearch").value.toLowerCase();
  const category = qs("#notesCategoryFilter").value;
  const categories = [...new Set(state.notes.map(n => n.category).filter(Boolean))].sort();

  const filterSelect = qs("#notesCategoryFilter");
  const selected = filterSelect.value;
  filterSelect.innerHTML = `<option value="all">Wszystkie kategorie</option>` +
    categories.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("");
  filterSelect.value = categories.includes(selected) ? selected : "all";

  const notes = [...state.notes]
    .filter(n => (!query || `${n.title} ${n.content} ${n.category}`.toLowerCase().includes(query)))
    .filter(n => filterSelect.value === "all" || n.category === filterSelect.value)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  qs("#notesList").innerHTML = notes.length
    ? notes.map(note => `
      <div class="note-list-item ${note.id === activeNoteId ? "active" : ""}" data-note-id="${note.id}">
        <strong>${escapeHtml(note.title || "Bez tytułu")}</strong>
        <span>${escapeHtml(note.category || "Bez kategorii")} · ${relativeDate(note.updatedAt)}</span>
      </div>`).join("")
    : `<p style="color:var(--muted);padding:12px">Brak notatek.</p>`;

  const recent = [...state.notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 4);
  qs("#recentNotes").innerHTML = recent.map(note => `
    <div class="stack-item" data-open-note="${note.id}">
      <strong>${escapeHtml(note.title || "Bez tytułu")}</strong>
      <span>${escapeHtml(note.category || "Bez kategorii")} · ${relativeDate(note.updatedAt)}</span>
    </div>`).join("");

  loadActiveNote();
}

function loadActiveNote() {
  const note = state.notes.find(n => n.id === activeNoteId);
  qs("#emptyNoteState").classList.toggle("hidden", Boolean(note));
  qs("#noteEditor").classList.toggle("hidden", !note);
  if (!note) return;
  qs("#noteTitle").value = note.title;
  qs("#noteCategory").value = note.category;
  qs("#noteContent").value = note.content;
  qs("#noteSavedStatus").textContent = "Zapisano";
}

function createNote() {
  const note = {
    id: crypto.randomUUID(),
    title: "Nowa notatka",
    category: "Ogólne",
    content: "",
    updatedAt: new Date().toISOString()
  };
  state.notes.unshift(note);
  activeNoteId = note.id;
  saveState();
  renderNotes();
  openView("notes");
  setTimeout(() => qs("#noteTitle").select(), 0);
}

function saveActiveNote() {
  const note = state.notes.find(n => n.id === activeNoteId);
  if (!note) return;
  note.title = qs("#noteTitle").value;
  note.category = qs("#noteCategory").value;
  note.content = qs("#noteContent").value;
  note.updatedAt = new Date().toISOString();
  qs("#noteSavedStatus").textContent = "Zapisywanie…";
  clearTimeout(saveActiveNote.timer);
  saveActiveNote.timer = setTimeout(() => {
    saveState();
    qs("#noteSavedStatus").textContent = "Zapisano";
    renderNotes();
  }, 450);
}

function renderSimpleEntries(type) {
  const config = {
    timeline: ["#timelineList", entry => `
      <article class="timeline-item">
        <time>${formatDate(entry.date)}</time>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.content)}</p>
        <div class="tags">${tagsHtml(entry.tags)}</div>
      </article>`],
    knowledge: ["#knowledgeGrid", entry => `
      <article class="knowledge-card">
        <span class="badge">${escapeHtml(entry.tags?.split(",")[0]?.trim() || "Wiedza")}</span>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.content)}</p>
        <div class="tags">${tagsHtml(entry.tags)}</div>
      </article>`],
    changelog: ["#changelogList", entry => `
      <article class="changelog-item">
        <time>${formatDate(entry.date)}</time>
        <div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.content)}</p><div class="tags">${tagsHtml(entry.tags)}</div></div>
      </article>`]
  };
  const [selector, template] = config[type];
  const list = [...state[type]].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  qs(selector).innerHTML = list.map(template).join("") || `<div class="empty-state"><div><h2>Brak wpisów</h2></div></div>`;
}

function tagsHtml(tags = "") {
  return tags.split(",").map(t => t.trim()).filter(Boolean).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
}

function openSimpleEntryDialog(type) {
  const labels = {
    timeline: ["Timeline", "Dodaj wydarzenie"],
    knowledge: ["Baza wiedzy", "Dodaj wpis"],
    changelog: ["Changelog", "Dodaj zmianę"]
  };
  qs("#simpleEntryType").value = type;
  qs("#simpleEntryKicker").textContent = labels[type][0];
  qs("#simpleEntryTitle").textContent = labels[type][1];
  qs("#simpleEntryName").value = "";
  qs("#simpleEntryDate").value = new Date().toISOString().slice(0, 10);
  qs("#simpleEntryContent").value = "";
  qs("#simpleEntryTags").value = "";
  qs("#simpleEntryDialog").showModal();
}

function renderAll() {
  renderProjects();
  renderNotes();
  renderSimpleEntries("timeline");
  renderSimpleEntries("knowledge");
  renderSimpleEntries("changelog");
  applySettings();
}

function applySettings() {
  document.documentElement.dataset.theme = state.settings.theme;
  document.documentElement.style.setProperty("--accent", state.settings.accent);
  document.body.classList.toggle("no-animations", !state.settings.animations);
  qs("#themeSelect").value = state.settings.theme;
  qs("#accentColor").value = state.settings.accent;
  qs("#animationsToggle").checked = state.settings.animations;
}

function globalSearch(query) {
  const needle = query.trim().toLowerCase();
  const box = qs("#searchResults");
  if (needle.length < 2) {
    box.classList.add("hidden");
    box.innerHTML = "";
    return;
  }

  const results = [
    ...state.projects.map(x => ({ type: "projects", id: x.id, title: x.name, meta: "Projekt", text: x.description })),
    ...state.notes.map(x => ({ type: "notes", id: x.id, title: x.title, meta: `Notatka · ${x.category}`, text: x.content })),
    ...state.timeline.map(x => ({ type: "timeline", id: x.id, title: x.title, meta: "Timeline", text: x.content })),
    ...state.knowledge.map(x => ({ type: "knowledge", id: x.id, title: x.title, meta: "Wiedza", text: x.content }))
  ].filter(x => `${x.title} ${x.meta} ${x.text}`.toLowerCase().includes(needle)).slice(0, 10);

  box.innerHTML = results.length
    ? results.map(x => `<button class="search-result" data-search-type="${x.type}" data-search-id="${x.id}">
        ${escapeHtml(x.title)}<span>${escapeHtml(x.meta)}</span>
      </button>`).join("")
    : `<div style="padding:14px;color:var(--muted)">Brak wyników.</div>`;
  box.classList.remove("hidden");
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `dexieos-backup-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importData(file) {
  try {
    const imported = JSON.parse(await file.text());
    if (!imported.projects || !imported.notes || !imported.settings) throw new Error("Invalid data");
    state = imported;
    activeNoteId = state.notes[0]?.id || null;
    saveState();
    renderAll();
    showToast("Dane zostały zaimportowane.");
  } catch {
    showToast("Nie udało się zaimportować pliku.");
  }
}

qsa(".nav-item").forEach(btn => btn.addEventListener("click", () => openView(btn.dataset.view)));
qsa("[data-open-view]").forEach(btn => btn.addEventListener("click", () => openView(btn.dataset.openView)));
qsa("[data-close-dialog]").forEach(btn => btn.addEventListener("click", () => qs(`#${btn.dataset.closeDialog}`).close()));

qs("#menuBtn").addEventListener("click", () => qs("#sidebar").classList.toggle("open"));
qs("#refreshWeatherBtn").addEventListener("click", () => loadWeather(true));

["#quickProjectBtn", "#addProjectBtn"].forEach(selector => qs(selector).addEventListener("click", () => openProjectDialog()));
["#quickNoteBtn", "#addNoteBtn"].forEach(selector => qs(selector).addEventListener("click", createNote));

qsa("[data-action='new-project']").forEach(btn => btn.addEventListener("click", () => openProjectDialog()));
qsa("[data-action='new-note']").forEach(btn => btn.addEventListener("click", createNote));

qs("#projectProgress").addEventListener("input", event => {
  qs("#projectProgressValue").textContent = `${event.target.value}%`;
});

qs("#projectForm").addEventListener("submit", event => {
  event.preventDefault();
  const id = qs("#projectId").value;
  const existing = state.projects.find(p => p.id === id);
  const project = {
    id: existing?.id || crypto.randomUUID(),
    name: qs("#projectName").value.trim(),
    description: qs("#projectDescription").value.trim(),
    status: qs("#projectStatus").value,
    priority: qs("#projectPriority").value,
    progress: Number(qs("#projectProgress").value),
    link: qs("#projectLink").value.trim(),
    updatedAt: new Date().toISOString()
  };
  if (existing) Object.assign(existing, project);
  else state.projects.unshift(project);
  saveState();
  renderProjects();
  qs("#projectDialog").close();
  showToast(existing ? "Projekt zaktualizowany." : "Projekt dodany.");
});

qs("#projectsGrid").addEventListener("click", event => {
  const editId = event.target.dataset.editProject;
  const deleteId = event.target.dataset.deleteProject;
  if (editId) openProjectDialog(state.projects.find(p => p.id === editId));
  if (deleteId && confirm("Usunąć ten projekt?")) {
    state.projects = state.projects.filter(p => p.id !== deleteId);
    saveState();
    renderProjects();
    showToast("Projekt usunięty.");
  }
});

qs("#projectStatusFilter").addEventListener("change", renderProjects);

qs("#notesList").addEventListener("click", event => {
  const item = event.target.closest("[data-note-id]");
  if (!item) return;
  activeNoteId = item.dataset.noteId;
  renderNotes();
});
qs("#recentNotes").addEventListener("click", event => {
  const item = event.target.closest("[data-open-note]");
  if (!item) return;
  activeNoteId = item.dataset.openNote;
  openView("notes");
  renderNotes();
});
["#noteTitle", "#noteCategory", "#noteContent"].forEach(selector => qs(selector).addEventListener("input", saveActiveNote));
qs("#notesSearch").addEventListener("input", renderNotes);
qs("#notesCategoryFilter").addEventListener("change", renderNotes);

qs("#deleteNoteBtn").addEventListener("click", () => {
  if (!activeNoteId || !confirm("Usunąć tę notatkę?")) return;
  state.notes = state.notes.filter(n => n.id !== activeNoteId);
  activeNoteId = state.notes[0]?.id || null;
  saveState();
  renderNotes();
  showToast("Notatka usunięta.");
});

qs("#addTimelineBtn").addEventListener("click", () => openSimpleEntryDialog("timeline"));
qs("#addKnowledgeBtn").addEventListener("click", () => openSimpleEntryDialog("knowledge"));
qs("#addChangelogBtn").addEventListener("click", () => openSimpleEntryDialog("changelog"));

qs("#simpleEntryForm").addEventListener("submit", event => {
  event.preventDefault();
  const type = qs("#simpleEntryType").value;
  state[type].unshift({
    id: crypto.randomUUID(),
    title: qs("#simpleEntryName").value.trim(),
    date: qs("#simpleEntryDate").value,
    content: qs("#simpleEntryContent").value.trim(),
    tags: qs("#simpleEntryTags").value.trim()
  });
  saveState();
  renderSimpleEntries(type);
  qs("#simpleEntryDialog").close();
  showToast("Wpis dodany.");
});

qs("#themeSelect").addEventListener("change", event => {
  state.settings.theme = event.target.value;
  saveState(); applySettings();
});
qs("#accentColor").addEventListener("input", event => {
  state.settings.accent = event.target.value;
  saveState(); applySettings();
});
qs("#animationsToggle").addEventListener("change", event => {
  state.settings.animations = event.target.checked;
  saveState(); applySettings();
});
qs("#resetDataBtn").addEventListener("click", () => {
  if (!confirm("Przywrócić dane startowe? Obecne wpisy zostaną usunięte.")) return;
  state = structuredClone(initialData);
  activeNoteId = state.notes[0]?.id || null;
  saveState(); renderAll();
  showToast("Przywrócono dane startowe.");
});

qs("#globalSearch").addEventListener("input", event => globalSearch(event.target.value));
qs("#searchResults").addEventListener("click", event => {
  const item = event.target.closest("[data-search-type]");
  if (!item) return;
  const type = item.dataset.searchType;
  if (type === "notes") activeNoteId = item.dataset.searchId;
  openView(type);
  if (type === "notes") renderNotes();
  qs("#searchResults").classList.add("hidden");
  qs("#globalSearch").value = "";
});
document.addEventListener("click", event => {
  if (!event.target.closest(".search-wrap")) qs("#searchResults").classList.add("hidden");
});

qs("#exportDataBtn").addEventListener("click", exportData);
qs("#importDataInput").addEventListener("change", event => {
  const file = event.target.files[0];
  if (file) importData(file);
  event.target.value = "";
});

setClock();
setInterval(setClock, 1000);
renderAll();
loadWeather();
