//importing all important js files
import { loadStories, setupMarkers } from "./stories.js";
import { initCounters } from "./counter.js";

//Global state
export let selectedLang = "NL";
export let greetings = {};

//Funtion to start app
function init() {
  //Loading JSON file for the stories
  loadStories().then(data => {
    greetings = data;
    setupMarkers();
  });

  initLanguageButtons();
  initSettingsButton();
  initCounters();
}

//Created buttons for language selection
function initLanguageButtons() {
  document.querySelectorAll('.langBtn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedLang = btn.dataset.lang;
      document.getElementById('startscreen').style.display = 'none';
    });
  });
}

//Created settingsbutton
function initSettingsButton() {
  document.getElementById("openSettingsBtn").addEventListener("click", () => {
    const startScreen = document.getElementById("startscreen");
    if (startScreen) startScreen.style.display = "flex";
  });
}

init();
