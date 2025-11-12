//Creating variables for counters
let countNL = 0;
let countEn = 0;
let countDe = 0;

//Connectie naar webhook
const webhookURL =
  "https://canary.discord.com/api/webhooks/1433427430445682688/sdizPzVEYSED3CySehUamhvkVwwyZvhrS8vnNkx_AeZsWwzXHygiELTHxY0PVq04L45h";

export function initCounters() {
  loadCountersFromStorage();
  setupCounterButtons();
  updateLabels();
}

//Local saving in browser for remembrance of counter
function loadCountersFromStorage() {
  const savedCounters = localStorage.getItem("counters");
  if (savedCounters) {
    const data = JSON.parse(savedCounters);
    countNL = data.NL || 0;
    countEn = data.EN || 0;
    countDe = data.DE || 0;
  }
}

//Updating labels to current counter
function updateLabels() {
  document.getElementById("LabelcounterNL").textContent = countNL;
  document.getElementById("LabelcounterEn").textContent = countEn;
  document.getElementById("LabelcounterDE").textContent = countDe;
}

//Creation of buttons in all languages
function setupCounterButtons() {
  document.getElementById("NederlandsBtn").onclick = () => incrementCounter("NL");
  document.getElementById("EngelsBtn").onclick = () => incrementCounter("EN");
  document.getElementById("DuitsBtn").onclick = () => incrementCounter("DE");
}

//Incrementing counter
function incrementCounter(lang) {
  if (lang === "NL") countNL++;
  if (lang === "EN") countEn++;
  if (lang === "DE") countDe++;

  updateLabels();
  sendToDiscord(`${lang} teller: ${getCount(lang)}`);
  saveCounterToJSON();
}

//Recieving all counters for checking purpose
function getCount(lang) {
  if (lang === "NL") return countNL;
  if (lang === "EN") return countEn;
  if (lang === "DE") return countDe;
}

//Saving counter to json file
function saveCounterToJSON() {
  const data = { NL: countNL, EN: countEn, DE: countDe };
  localStorage.setItem("counters", JSON.stringify(data));
  console.log("Teller opgeslagen in localStorage");
}

//Connection to discord and sending of counter information
async function sendToDiscord(message) {
  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    console.log("Bericht verzonden:", message);
  } catch (error) {
    console.error("Fout bij verzenden:", error);
  }
}
