// Holen aller Buttons mit class="uploadAudio" => speichern in Array uploadAudioButtons
let uploadAudioButtons = document.getElementsByClassName('uploadAudio');
let audioLoadedStatus = {};

// Holen aller Buttons mit class="uploadVideo" => speichern in Array uploadVideoButtons
let uploadVideoButtons = document.getElementsByClassName('uploadVideo');
let videoLoadedStatus = {};

// Iterieren über alle Elemente in diesem Array
for (const button of uploadAudioButtons) {
    button.addEventListener('click', () => {
        // Wenn angeklickt wurde des Attribut id des Buttons holen und String umwandeln in Int
        var nrOfSong = parseInt(button.getAttribute('id'));
        // Abfangen, ob in der Spur bereits eine Audiodatei hochgeladen wurde
        if (!audioLoadedStatus[nrOfSong]) {
            // input-Element (html) erstellen und konfigurieren
            let inputFile = document.createElement('input');
            inputFile.type = 'file';
            inputFile.accept = 'audio/*';
            // Hinzufügen Eventlistener, der auf Auswahl einer Datei reagiert
            inputFile.addEventListener('change', e => handleAudioFileSelect(e, nrOfSong), false);
            inputFile.click();
        }
    }, false);
}

Array.from(uploadVideoButtons).forEach(button => {
    button.addEventListener('click', () => {
        var nrOfVideo = parseInt(button.getAttribute('id'));
        if (!videoLoadedStatus[nrOfVideo]) {
            let fileInput = createVideoFileInput(nrOfVideo); // Erstelle das File Input-Element
            fileInput.addEventListener('change', e => handleVideoFileSelect(e, nrOfVideo), false);
            fileInput.click(); // Trigger the click event on the file input element
        }
    }, false);
});

// Verarbeiten der ausgewählten Audiodatei
function handleAudioFileSelect(evt, nrOfSong) {
    //console.log(nrOfSong);
    var audioFile = evt.target.files[0]; // Speichern der ausgewählten Datei mit Index[0] => 1. Datei
    evt.stopPropagation();
    evt.preventDefault();

    var audioUrl = URL.createObjectURL(audioFile); // Erstellen Link zur ausgewählten Audio-Datei
    const audio = document.createElement('audio');
    audio.id = 'audio' + nrOfSong;
    const controllerDiv = document.getElementById('audioRegulatorsAudio' + nrOfSong);
    controllerDiv.appendChild(audio); // Speichern, der Audiodatei in controllerDiv
    //audio.controls = false; // Anzeigen von automatisch generierter Leiste (Start/Stop-Knopf, Lautstärkeregler)
    audio.src = audioUrl; // Speichern der URL für html audio ELement

    audioLoadedStatus[nrOfSong] = true;

    const playButton = document.getElementById('playButton' + nrOfSong);
    const volumeSlider = document.getElementById('volumeSlider' + nrOfSong);
    const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nrOfSong);
    const record = document.getElementById('record' + nrOfSong);
    const resetButton = document.getElementById('resetButton' + nrOfSong);
    // const playAllButton

    console.log(playButton);
    console.log(volumeSlider);

    playButton.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            record.style.animationPlayState = 'running';
            video.play();
        } else {
            audio.pause();
            record.style.animationPlayState = 'paused';
            video.pause();
        }
    });

    resetButton.addEventListener('click', () => {
        resetAudioTrack(nrOfSong);
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
    });

    playbackSpeedSlider.addEventListener('input', () => {
        audio.playbackRate = playbackSpeedSlider.value;
    });

    const loopButton = document.getElementById('loopAudioButton' + nrOfSong);

    loopButton.addEventListener('click', () => {
        audio.loop = !audio.loop; // Setze den Wert, ob audio loopt immer auf den gegensätzlichen Wert (true -> false, false -> true)
        if (audio.loop) { // Wenn alle Elemente true sind
            loopButton.firstElementChild.innerHTML = "Unloop";
        } else {
            loopButton.firstElementChild.innerHTML = "Loop";
        }
    })

    visualizeAudio(audio, nrOfSong);
}

function createVideoFileInput(nrOfVideo) {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'video/*';
    fileInput.setAttribute('id', 'videoInput' + nrOfVideo); // Speichere die Nummer des Videos als Attribut
    //fileInput.addEventListener('change', e => handleVideoFileSelect(e, nrOfVideo), false);
    return fileInput;
}
// Verarbeiten der ausgewählten Videodatei
function handleVideoFileSelect(evt, nrOfVideo) {
    var videoFile = evt.target.files[0]; // Speichern der ausgewählten Datei mit Index[0] => 1. Datei
    evt.stopPropagation();
    evt.preventDefault();

    var videoUrl = URL.createObjectURL(videoFile); // Erstellen des Links zur ausgewählten Video-Datei

    const video = document.createElement('video');
    const controllerDiv = document.getElementById('videoRegulatorsVideo' + nrOfVideo);
    controllerDiv.appendChild(video);
    video.src = videoUrl; // Speichern der URL für das HTML-Videoelement

    videoLoadedStatus[nrOfVideo] = true;

    const playButton = document.getElementById('videoPlayButton' + nrOfVideo);
    const volumeSlider = document.getElementById('videoVolumeSlider' + nrOfVideo);
    const playbackSpeedSlider = document.getElementById('videoPlaybackSpeedSlider' + nrOfVideo);
    const resetButton = document.getElementById('videoResetButton' + nrOfVideo);

    playButton.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    resetButton.addEventListener('click', () => {
        resetVideoTrack(nrOfVideo);
    });

    volumeSlider.addEventListener('input', () => {
        video.volume = volumeSlider.value / 100;
    });

    playbackSpeedSlider.addEventListener('input', () => {
        video.playbackRate = playbackSpeedSlider.value;
    });

    const loopButton = document.getElementById('loopVideoButton' + nrOfVideo);

    loopButton.addEventListener('click', () => {
        video.loop = !video.loop;
        if (video.loop) {
            loopButton.innerHTML = "Unloop";
        } else {
            loopButton.innerHTML = "Loop";
        }
    });
}

// Funktion zum Zurücksetzen des hochgeladenen Audiotracks
function resetAudioTrack(nrOfSong) {
    const record = document.getElementById('record' + nrOfSong);
    const controllerDiv = document.getElementById('audioRegulatorsAudio' + nrOfSong);
    const audio = document.getElementById('audio' + nrOfSong);

    if (audio) {
        audio.pause();
        audio.src = ''; // Leeren der src, um Audio zu stoppen und von URL zu lösen
        audio.load(); // Neuladen der Audio
        controllerDiv.removeChild(audio);
        delete audioLoadedStatus[nrOfSong];
    }

    // Animation der Schallplatte pausieren
    record.style.animationPlayState = 'paused';
    record.offsetHeight;

    // Reglerwerte zurücksetzen
    const volumeSlider = document.getElementById('volumeSlider' + nrOfSong);
    const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nrOfSong);
    volumeSlider.value = 100; // Zurücksetzen der Lautstärke
    playbackSpeedSlider.value = 1.0; // Zurücksetzen des Wiedergabegeschwindigkeitssliders
}

// Funktion zum Zurücksetzen des hochgeladenen Videotracks
function resetVideoTrack(nrOfVideo) {
    const controllerDiv = document.getElementById('videoRegulatorsVideo' + nrOfVideo);
    const video = document.getElementById('video' + nrOfVideo);
    const videoPreview = document.getElementById('videoPreview' + nrOfVideo);

    if (video) {
        video.pause();
        video.src = '';
        video.load();
        controllerDiv.removeChild(video);

        if (videoPreview) {
            videoPreview.innerHTML = '';
        }
    }

    const volumeSlider = document.getElementById('videoVolumeSlider' + nrOfVideo);
    const playbackSpeedSlider = document.getElementById('videoPlaybackSpeedSlider' + nrOfVideo);
    volumeSlider.value = 100;
    playbackSpeedSlider.value = 1.0;
}

// Event Listener für den Reset-Button für Video 1
const videoResetButton1 = document.getElementById('videoResetButton1');
videoResetButton1.addEventListener('click', function() {
    resetVideoTrack(nrOfVideo);
});

// Event Listener für den Reset-Button für Video 2
const videoResetButton2 = document.getElementById('videoResetButton2');
videoResetButton2.addEventListener('click', function() {
    resetVideoTrack(nrOfVideo);
});

  

function visualizeAudio(audio, nrOfSong) {
    const canvas = document.getElementById('visualizeAudio' + nrOfSong);
    const context = canvas.getContext('2d');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    var audioSource = null;
    var analyser = null;

    audioSource = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 128;
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
            barHeight = dataArray[i] / 2; // durch 2, damit die Balkenhöhe im Canvas bleibt -> gestaucht
            context.fillStyle = "white";
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate();
}