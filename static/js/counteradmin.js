
async function loadCounters() {
  try {
    const res = await fetch("../static/Php/api.php"); // GET request
    const data = await res.json();

    document.getElementById("LabelcounterNL1").textContent = data.NL;
    document.getElementById("LabelcounterEn1").textContent = data.EN;
    document.getElementById("LabelcounterDE1").textContent = data.DE;
  } catch (err) {
    console.error("Fout bij laden van tellers:", err);
  }
}

// Load counters zodra pagina opent
window.addEventListener("DOMContentLoaded", loadCounters);

// Optioneel: automatisch elke 5 seconden verversen
setInterval(loadCounters, 5000);

