let greetings = {};
let selectedLang = "NL";

fetch('../static/json/stories.json')
  .then(response => response.json())
  .then(data => {
    greetings = data;
    setupMarkers(); 
  })
  .catch(err => console.error('Error loading JSON:', err));


  
function setupMarkers() {
  const bottomText = document.getElementById('bottomText');
  const markers = document.querySelectorAll('a-marker');
  const allAudios = Array.from(document.querySelectorAll('audio'));

  markers.forEach(m => {
    const key = m.id.replace('marker', '');

    m.addEventListener('markerFound', () => {
      if (greetings[key] && greetings[key][selectedLang]) {
        bottomText.innerHTML = greetings[key][selectedLang];
        bottomText.style.display = 'block';

        // Maak een play/pause knop
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Speel audio af';
        toggleButton.classList.add('play-audio-btn');
        bottomText.appendChild(toggleButton);

        // Zoek het juiste audio-element
        const audio = document.getElementById(`audio${key}_${selectedLang}`);
        if (!audio) return;

        // Zorg dat audio standaard uit staat
        audio.pause();
        audio.currentTime = 0;

        // Toggle play/pause gedrag
        toggleButton.addEventListener('click', () => {
          if (audio.paused) {
            // Stop alle andere audio's
            allAudios.forEach(a => {
              a.pause();
            });

            audio.play();
            toggleButton.textContent = 'Pauzeer audio';
          } else {
            audio.pause();
            toggleButton.textContent = 'Speel audio af';
          }
        });

        // Als audio vanzelf stopt → knop resetten
        audio.addEventListener('ended', () => {
          toggleButton.textContent = 'Speel audio af';
        });
      }
    });

    m.addEventListener('markerLost', () => {
      // Stop en reset audio
      allAudios.forEach(a => {
        a.pause();
      });

      // Verberg tekst en knop
      bottomText.style.display = 'none';
      bottomText.innerHTML = "";
    });
  });
}


/* Language selection stays the same */
document.querySelectorAll('.langBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLang = btn.dataset.lang;
    document.getElementById('startscreen').style.display = 'none';
  });
});

//  Instellingenknop opent het startscherm
document.getElementById("openSettingsBtn").addEventListener("click", function() {
  const startScreen = document.getElementById("startscreen");
  if (startScreen) {
    startScreen.style.display = "flex"; // toon het startscherm
  }
});

// sietze counter boy
// --- Teller variabelen (tijdelijke variabelen) ---
let countNL = 0;
let countEn = 0;
let countDe = 0;

// --- JSON laden uit localStorage als het bestaat ---
const savedCounters = localStorage.getItem("counters");
if (savedCounters) {
  const data = JSON.parse(savedCounters);
  countNL = data.NL;
  countEn = data.EN;
  countDe = data.DE;
}

// --- Update labels op pagina ---
function updateLabels() {
  document.getElementById("LabelcounterNL").textContent = countNL;
  document.getElementById("LabelcounterEn").textContent = countEn;
  document.getElementById("LabelcounterDE").textContent = countDe;
}

// --- Discord webhook functie ---
const webhookURL = "https://canary.discord.com/api/webhooks/1433427430445682688/sdizPzVEYSED3CySehUamhvkVwwyZvhrS8vnNkx_AeZsWwzXHygiELTHxY0PVq04L45h";

async function sendToDiscord(message) {
  try {
    await fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
    console.log("Bericht verzonden:", message);
  } catch (error) {
    console.error("Fout bij verzenden:", error);
  }
}

// --- JSON opslaan in localStorage ---
function saveCounterToJSON() {
  const data = { NL: countNL, EN: countEn, DE: countDe };
  localStorage.setItem("counters", JSON.stringify(data));
  console.log("Teller opgeslagen in localStorage");
}

// --- Button clicks ---
document.getElementById("NederlandsBtn").onclick = () => {
  countNL++;
  updateLabels();
  sendToDiscord(`NL teller: ${countNL}`);
  saveCounterToJSON();
};

document.getElementById("EngelsBtn").onclick = () => {
  countEn++;
  updateLabels();
  sendToDiscord(`EN teller: ${countEn}`);
  saveCounterToJSON();
};

document.getElementById("DuitsBtn").onclick = () => {
  countDe++;
  updateLabels();
  sendToDiscord(`DE teller: ${countDe}`);
  saveCounterToJSON();
};

// --- Initial labels tonen ---
updateLabels();
