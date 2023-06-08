// Holen aller Buttons mit class="uploadAudio" => speichern in Array uploadAudioButtons
let uploadAudioButtons = document.getElementsByClassName('uploadAudio');
// Iterieren über alle Elemente in diesem Array
for (const button of uploadAudioButtons) {
    button.addEventListener('click', () => {
        // Wenn angeklickt wurde des Attribut id des Buttons holen und String umwandeln in Int
        var nrOfSong = parseInt(button.getAttribute('id'));
        // input-Element (html) erstellen und konfigurieren
        let inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = 'audio/*';
        // Hinzufügen Eventlistener, der auf Auswahl einer Datei reagiert
        inputFile.addEventListener('change', e => handleAudioFileSelect(e, nrOfSong), false);
        inputFile.click();
    }, false);
}

// Verarbeiten der ausgewählten Audiodatei
function handleAudioFileSelect(evt, nrOfSong) {
    //console.log(nrOfSong);
    var audioFile = evt.target.files[0]; // Speichern der ausgewählten Datei mit Index[0] => 1. Datei
    evt.stopPropagation();
    evt.preventDefault();

    var audioUrl = URL.createObjectURL(audioFile); // Erstellen Link zur ausgewählten Audio-Datei
    const audio = document.createElement('audio');
    const controllerDiv = document.getElementById('audioRegulatorsAudio' + nrOfSong);
    controllerDiv.appendChild(audio); // Speichern, wo das Element eingebunden werden soll
    audio.controls = true; // Anzeigen von Start und Stop
    audio.src = audioUrl; // Speichern der URL für html audio ELement

    visualizeAudio(audio, nrOfSong);
    // Überprüfen, ob die Datei ein Audioformat hat
    /* if (audioFile.type.substring(0, 5) == 'audio') {
        if (checkForEmptyAudioSlot()) {
            console.log('The File ' + audioFile.name + ' of type ' + audioFile.type + ' is uploaded');
            loadAudioFile(audioFile);
        }
    } */
}

function visualizeAudio(audio, nrOfSong) {
    const canvas = document.getElementById('visualizeAudio' + nrOfSong);
    canvas.width = 1100;
    canvas.height = 50;
    const context = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var audioSource = null;
    var analyser = null;

    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;
    console.log(canvas.width);
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const barWidth = canvas.width / bufferLength;

    let x = 0;
    let barHeight = 0;
    function animate() {
        x = 0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            context.fillStyle = "white";
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }

        requestAnimationFrame(animate);
    }

    animate();
}

