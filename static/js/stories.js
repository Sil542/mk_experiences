// Importing from main.js stories.js
import { greetings, selectedLang } from "./main.js";

// JSON parsing
export async function loadStories() {
  try {
    const response = await fetch('../static/json/stories.json');
    const data = await response.json();
    console.log("Stories geladen:", data);
    return data;
  } catch (err) {
    console.error('Error loading JSON:', err);
    return {};
  }
}

//Function creation for when markers lost or found
export function setupMarkers() {
  const bottomText = document.getElementById('bottomText');
  const markers = document.querySelectorAll('a-marker');
  const allAudios = Array.from(document.querySelectorAll('audio'));
  const markerLostTimeouts = {};

  markers.forEach(marker => {
    const key = marker.id.replace('marker', '');

    marker.addEventListener('markerFound', () =>
      handleMarkerFound(marker, key, bottomText, allAudios, markerLostTimeouts)
    );

    marker.addEventListener('markerLost', () =>
      handleMarkerLost(marker, key, bottomText, allAudios, markerLostTimeouts)
    );
  });
}

//Preventation of audio replaying when marker is found
function handleMarkerFound(marker, key, bottomText, allAudios, markerLostTimeouts) {
  if (markerLostTimeouts[key]) {
    clearTimeout(markerLostTimeouts[key]);
    markerLostTimeouts[key] = null;
  }

  if (greetings[key] && greetings[key][selectedLang]) {
    bottomText.innerHTML = greetings[key][selectedLang];
    bottomText.style.display = 'block';

    const toggleButton = createAudioButton(key, allAudios);
    bottomText.appendChild(toggleButton);
  }
}

//Added delay to the ui when marker is lost to prevent flickering
function handleMarkerLost(marker, key, bottomText, allAudios, markerLostTimeouts) {
  markerLostTimeouts[key] = setTimeout(() => {
    if (!marker.object3D.visible) {
      stopAllAudios(allAudios);
      bottomText.style.display = 'none';
      bottomText.innerHTML = "";
    }
  }, 2000);
}

//The creation of audio button
function createAudioButton(key, allAudios) {
  const toggleButton = document.createElement('button');
  toggleButton.classList.add('play-audio-btn');

  toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";

  const audio = document.getElementById(`audio${key}_${selectedLang}`);
  if (!audio) return toggleButton;

  toggleButton.addEventListener('click', () =>
    toggleAudio(audio, toggleButton, allAudios)
  );

  audio.addEventListener('ended', () => {
    toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";
  });

  return toggleButton;
}

//Toggling audios to pause audio and restart where it's left off
function toggleAudio(audio, toggleButton, allAudios) {
  if (audio.paused) {
    allAudios.forEach(a => a.pause());
    audio.play();
    toggleButton.textContent = greetings["audio_pause"][selectedLang] || "Pause audio";
  } else {
    audio.pause();
    toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";
  }
}

//Created fuction for all audios to stop
function stopAllAudios(allAudios) {
  allAudios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
}
