// Holen aller Buttons mit class="uploadAudio" und class="uploadVideo" => speichern in Array uploadButtons
let uploadAudioButtons = document.getElementsByClassName('uploadAudio');
let uploadVideoButtons = document.getElementsByClassName('uploadVideo');
let uploadButtons = [...uploadAudioButtons, ...uploadVideoButtons]; //Convert HTMLCollection to array
let audioLoadedStatus = {};
let videoLoadedStatus = {};


uploadButtons.forEach(button => {
    button.addEventListener('click', () => {
        var nr = parseInt(button.getAttribute('id'));
        let fileType = button.classList.contains('uploadAudio') ? 'audio' : 'video';

        if (!isFileLoaded(fileType, nr)) {
            let fileInput = createFileInput(fileType, nr); // Erstelle das File Input-Element
            fileInput.addEventListener('change', e => handleFileSelect(e, fileType, nr), false);
            fileInput.click(); // Trigger the click event on the file input element
        }
    }, false);
});

function isFileLoaded(fileType, nr) {
    if (fileType === 'audio') {
        return audioLoadedStatus[nr];
    } else if (fileType === 'video') {
        return videoLoadedStatus[nr];
    }
    return false;
}

function createFileInput(type, nr) {
    let fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = type === 'audio' ? 'audio/*' : 'video/*';
    fileInput.setAttribute('id', type === 'audio' ? 'audioInput' + nr : 'videoInput' + nr); // Speichere die Nummer des Videos als Attribut
    return fileInput; 0
}

// Verarbeiten der ausgewählten Videodatei
function handleFileSelect(evt, type, nr) {
    var file = evt.target.files[0];
    evt.stopPropagation();
    evt.preventDefault();

    var fileUrl = URL.createObjectURL(file);

    if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.id = 'audio' + nr;
        const controllerDiv = document.getElementById('audioRegulatorsAudio' + nr);
        controllerDiv.appendChild(audio); // Speichern, der Audiodatei in controllerDiv
        //audio.controls = false; // Anzeigen von automatisch generierter Leiste (Start/Stop-Knopf, Lautstärkeregler)

        audio.src = fileUrl; // Speichern der URL für html audio ELement

        audioLoadedStatus[nr] = true;


        visualizeAudio(audio, nr);
        // visualizeAudioWaveform(audio, nr);

    } else if (type === 'video') {
        const video = document.createElement('video');
        video.id = 'uploadedVideo' + nr;
        video.src = fileUrl; // Save the URL for the html video element
        video.autoplay = false;
        console.log('foundCorrectVideo' + nr);

        const videoPlayer = document.getElementById('videoPlayer' + nr);
        if (videoPlayer) {
            videoPlayer.innerHTML = '';
            videoPlayer.appendChild(video);
            videoLoadedStatus[nr] = true;
        }
    }
    //Add audio logic
    const uploadedVideo = document.getElementById('uploadedVideo' + nr);
    const audioTrack = document.getElementById('audio' + nr);
    const playButton = document.getElementById('playButton' + nr);
    const volumeSlider = document.getElementById('volumeSlider' + nr);
    const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nr);
    const record = document.getElementById('record' + nr);
    const resetButton = document.getElementById('resetButton' + nr);
    const canvas = document.getElementById('videoPlayer' + nr);
    // const playAllButton

    console.log(playButton);
    console.log(volumeSlider);
    console.log(uploadedVideo);
    console.log(audioTrack);
    uploadedVideo.volume = 0.0; //mute video

    playButton.addEventListener('click', () => {
        console.log(audioTrack);
        if (audioTrack.paused || uploadedVideo.paused) {
            audioTrack.play();
            record.style.animationPlayState = 'running';
            uploadedVideo.play();
        } else {
            audioTrack.pause();
            record.style.animationPlayState = 'paused';
            uploadedVideo.pause();
        }
    });

    resetButton.addEventListener('click', () => {
        resetAudioTrack(nr); // Funktion zum Zurücksetzen des Audiotracks
        resetVideoTrack(nr);
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // Leeren des Waveform-Canvas
    });


    volumeSlider.addEventListener('input', () => {
        audioTrack.volume = volumeSlider.value / 100;
    });

    playbackSpeedSlider.addEventListener('input', () => {
        audioTrack.playbackRate = playbackSpeedSlider.value;
        uploadedVideo.playbackRate = playbackSpeedSlider.value;
    });

    const loopButton = document.getElementById('loopButton' + nr);

    loopButton.addEventListener('click', () => {
        audioTrack.loop = !audioTrack.loop; // Setze den Wert, ob audio loopt immer auf den gegensätzlichen Wert (true -> false, false -> true)
        if (audioTrack.loop) { // Wenn alle Elemente true sind
            loopButton.firstElementChild.innerHTML = "Unloop";
        } else {
            loopButton.firstElementChild.innerHTML = "Loop";
        }
        uploadedVideo.loop = !uploadedVideo.loop;
        if (uploadedVideo.loop) {
            loopButton.innerHTML = "Unloop";
        } else {
            loopButton.innerHTML = "Loop";
        }
    })
}

// Funktion zum Zurücksetzen des hochgeladenen Audiotracks
function resetAudioTrack(nr) {
    const record = document.getElementById('record' + nr);
    const controllerDiv = document.getElementById('audioRegulatorsAudio' + nr);
    const audio = document.getElementById('audio' + nr);

    if (audio) {
        audio.pause();
        audio.src = ''; // Leeren der src, um Audio zu stoppen und von URL zu lösen
        audio.load(); // Neuladen der Audio
        controllerDiv.removeChild(audio);
        delete audioLoadedStatus[nr];
    }

    // Animation der Schallplatte pausieren
    record.style.animationPlayState = 'paused';
    record.offsetHeight;

    // Reglerwerte zurücksetzen
    const volumeSlider = document.getElementById('volumeSlider' + nr);
    const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nr);
    volumeSlider.value = 100; // Zurücksetzen der Lautstärke
    playbackSpeedSlider.value = 1.0; // Zurücksetzen des Wiedergabegeschwindigkeitssliders
}

function resetVideoTrack(nr) {
    const videoPlayer = document.getElementById('videoPlayer' + nr);
    if (videoPlayer) {
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.src = ''; // Leeren der src, um Video zu stoppen und von URL zu lösen
            video.load(); // Neuladen des Videos
        }
        delete videoLoadedStatus[nr];
        console.log(videoPlayer);
    }
}

function visualizeAudio(audio, nr) {
    const canvas = document.getElementById('visualizeAudio' + nr);
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