/*  Geluid aan/uit */
function mute_audio() {
  const audios = [audioNL, audioDE, audioEN];
  const muted = audios[0].muted;
  audios.forEach(a => a.muted = !muted);
  mutebutton.textContent = muted ? "Geluid is momenteel aan" : "Geluid is momenteel uit";
}

/*  Taalkeuze */
let selectedLang = "NL";
document.querySelectorAll('.langBtn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedLang = btn.dataset.lang;
    document.getElementById('startscreen').style.display = 'none';
  });
});

/*  Teksten per marker */
const greetings = {
  VISSERVROUW: {
    NL: `De visservrouw met de lange broek uit Moddergat is een fascinerend figuur uit de Friese visserijcultuur.<br><br>
    In traditionele vissersgemeenschappen droegen vrouwen vaak lange rokken, maar deze vrouw viel op omdat ze een broek droeg — iets wat destijds ongebruikelijk was.<br><br>
    Dit kledingstuk stond symbool voor haar praktische instelling en sterke karakter.<br><br>
    De vrouwen in Moddergat, dat aan de Waddenzee ligt, verrichtten zwaar werk zoals het herstellen van netten en dragen van goederen.<br><br>
    De visservrouw met de lange broek symboliseert de kracht en het doorzettingsvermogen van de vrouwen die het dorp en hun gezinnen draaiende hielden.`,
    EN: `The fisherwoman with the long trousers in Moddergat is a fascinating figure from Frisian fishing culture.<br><br>
    In traditional fishing communities, women often wore long skirts, but this woman stood out because she wore trousers — something unusual for women at the time.<br><br>
    This choice reflected her practicality and strong character.`,
    DE: `Die Fischerin mit der langen Hose in Moddergat ist eine faszinierende Figur aus der friesischen Fischereikultur.<br><br>
    In traditionellen Fischerdörfern trugen Frauen meist lange Röcke, aber diese Frau fiel auf, weil sie Hosen trug – etwas, das für Frauen damals ungewöhnlich war.`
  },
  JONGETJE: {
    NL: `Hallo, welkom in mijn woonkamer.<br><br>
    Tijdens het eten zat ik op de grond. In ons huis was het zo dat de bewoners met een inkomen een stoel voor de tafel kregen en de rest niet.<br><br>
    Dit vertelt iets over de verdeling van welvaart in die tijd.`,
    EN: `Hello, welcome to my living room.<br><br>
    While eating, I sat on the floor. In our home, those who earned an income got a chair, the others did not.`,
    DE: `Hallo, willkommen in meinem Wohnzimmer.<br><br>
    Beim Essen saß ich auf dem Boden. Die Bewohner mit einem Einkommen bekamen einen Stuhl, der Rest nicht.`
  }
};

/*  Tekst onderin aanpassen bij markers */
const bottomText = document.getElementById('bottomText');
const markers = document.querySelectorAll('a-marker');

markers.forEach(m => {
  const key = m.id.replace('marker', ''); // bv. 'VISSERVROUW'
  m.addEventListener('markerFound', () => {
    if (greetings[key] && greetings[key][selectedLang]) {
      bottomText.innerHTML = greetings[key][selectedLang];
      bottomText.style.display = 'block';
      const audio = document.getElementById('audio' + selectedLang);
      if (audio) audio.play();
    }
  });
  m.addEventListener('markerLost', () => {
    bottomText.style.display = 'none';
    bottomText.innerHTML = "";
  });
});
