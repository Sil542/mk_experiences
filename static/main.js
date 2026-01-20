//importing all important js files
import { loadStories, setupMarkers } from "./stories.js";

//Global state
export let selectedLang = "NL";
export let greetings = {};

//Funtion to start app
function init() {
  selectedLang = getLangFromURL();
  console.log("Geselecteerde taal:", selectedLang);

  loadStories().then(data => {
    greetings = data;
    setupMarkers();
    updateSettingsButton();
  });

  initSettingsButton();
}


//Created buttons for language selection
function getLangFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") || "NL";
}

//Created settingsbutton
function initSettingsButton() {
  document.getElementById("openSettingsBtn").addEventListener("click", () => {
    const startScreen = document.getElementById("startscreen");
    if (startScreen) startScreen.style.display = "flex";
  });
}

function updateSettingsButton() {
  const settingsBtn = document.getElementById("openSettingsBtn");
  if (!settingsBtn) return;

  settingsBtn.textContent =
    greetings.settings?.[selectedLang] || "Instellingen";
}


init();