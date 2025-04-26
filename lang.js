const translations = {
  pl: {
    clock: "Czas:",
    status: "STATUS SYSTEMU: Aktywny",
    broadcast: "TRANSMISJA NOCNA: Brak sygnału",
    sendButton: "Wyślij wiadomość do Discorda",
    langButton: "Zmień język / Switch Language",
    archiveLink: "ARCHIWUM",
    archiveTitle: "ARCHIWUM"
  },
  en: {
    clock: "Time:",
    status: "SYSTEM STATUS: Active",
    broadcast: "NIGHT TRANSMISSION: No signal",
    sendButton: "Send message to Discord",
    langButton: "Switch Language / Zmień język",
    archiveLink: "ARCHIVE",
    archiveTitle: "ARCHIVE"
  }
};

let currentLang = localStorage.getItem("dexieLang") || "pl";

function switchLanguage() {
  currentLang = currentLang === "pl" ? "en" : "pl";
  localStorage.setItem("dexieLang", currentLang);
  applyTranslations();
}

function applyTranslations() {
  document.getElementById("status").innerText = translations[currentLang].status;
  document.getElementById("broadcast").innerText = translations[currentLang].broadcast;
  document.getElementById("sendButton").innerText = translations[currentLang].sendButton;
  document.getElementById("langButton").innerText = translations[currentLang].langButton;
  document.getElementById("archiveLink").innerText = translations[currentLang].archiveLink;
  if(document.getElementById("archiveTitle")) {
    document.getElementById("archiveTitle").innerText = translations[currentLang].archiveTitle;
  }
}

document.addEventListener("DOMContentLoaded", applyTranslations);