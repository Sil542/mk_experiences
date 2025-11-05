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
  let markerLostTimeouts = {};

  markers.forEach(m => {
    const key = m.id.replace('marker', '');

    m.addEventListener('markerFound', () => {
      // If this marker was lost and a timeout exists, cancel it
      if (markerLostTimeouts[key]) {
        clearTimeout(markerLostTimeouts[key]);
        markerLostTimeouts[key] = null;
      }

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

        // Toggle play/pause gedrag
        toggleButton.addEventListener('click', () => {
          if (audio.paused) {
            // Stop alle andere audio's
            allAudios.forEach(a => a.pause());
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
      markerLostTimeouts[key] = setTimeout(() => {
        if (!m.object3D.visible) {
          // Stop and reset audio only if still lost
          allAudios.forEach(a => {
            a.pause();
            a.currentTime = 0;
          });

          // Hide text and button
          bottomText.style.display = 'none';
          bottomText.innerHTML = "";
        }
      }, 2000);
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

