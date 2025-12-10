// Importing from main.js
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

// Function setup for markers
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

// When a marker is found
function handleMarkerFound(marker, key, bottomText, allAudios, markerLostTimeouts) {
  if (markerLostTimeouts[key]) {
    clearTimeout(markerLostTimeouts[key]);
    markerLostTimeouts[key] = null;
  }

  if (greetings[key] && greetings[key][selectedLang]) {
    // Show text box
    bottomText.innerHTML = greetings[key][selectedLang];
    bottomText.style.display = 'block';
    
    removeExistingAudioButton();

    // Create new audio button outside the textbox
    const toggleButton = createAudioButton(key, allAudios);
    document.body.appendChild(toggleButton);
  }
}

// When a marker is lost (with delay to prevent flicker)
function handleMarkerLost(marker, key, bottomText, allAudios, markerLostTimeouts) {
  markerLostTimeouts[key] = setTimeout(() => {
    if (!marker.object3D.visible) {
      stopAllAudios(allAudios);
      bottomText.style.display = 'none';
      bottomText.innerHTML = "";
      removeExistingAudioButton(); // remove button on marker loss
    }
  }, 2000);
}

// Create the floating audio play/pause button
function createAudioButton(key, allAudios) {
  const toggleButton = document.createElement('button');
  toggleButton.classList.add('play-audio-btn');

  toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";

  const audio = document.getElementById(`audio${key}_${selectedLang}`);
  if (!audio) return toggleButton;

  toggleButton.addEventListener('click', () =>
    toggleAudio(audio, toggleButton, allAudios)
  );

  // Reset button text when audio ends
  audio.addEventListener('ended', () => {
    toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";
  });

  return toggleButton;
}

// Ensure only one button exists at a time
function removeExistingAudioButton() {
  const existingBtn = document.querySelector('.play-audio-btn');
  if (existingBtn) existingBtn.remove();
}

// Toggle audio playback
function toggleAudio(audio, toggleButton, allAudios) {
  if (audio.paused) {
    // Stop any currently playing audio
    allAudios.forEach(a => a.pause());
    audio.play();
    toggleButton.textContent = greetings["audio_pause"][selectedLang] || "Pause audio";
  } else {
    audio.pause();
    toggleButton.textContent = greetings["audio_play"][selectedLang] || "Play audio";
  }
}

// Stop all audio completely (reset)
function stopAllAudios(allAudios) {
  allAudios.forEach(a => {
    a.pause();
    a.currentTime = 0;
  });
}
