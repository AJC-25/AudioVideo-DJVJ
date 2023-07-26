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

        //Add audio logic
        const uploadedVideo = document.getElementById('uploadedVideo' + nr);
        const audioTrack = document.getElementById('audio' + nr);
        const playButton = document.getElementById('playButton' + nr);
        const volumeSlider = document.getElementById('volumeSlider' + nr);
        const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nr);
        const record = document.getElementById('record' + nr);
        const resetButton = document.getElementById('resetButton' + nr);
        const canvas = document.getElementById('videoPlayer' + nr);

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
            audioTrack.loop = !audioTrack.loop; // Set the value whether audio loops always to the opposite value (true -> false, false -> true)
            if (audioTrack.loop) {
                console.log("Audio is looping");
            } else {
                console.log("Audio is not looping");
            }
            uploadedVideo.loop = !uploadedVideo.loop;
            if (uploadedVideo.loop) {
                console.log("Video is looping");
            } else {
                console.log("Video is not looping");
            }
        });
    } else if (type === 'video') {
        const video = document.createElement('video');
        video.id = 'uploadedVideo' + nr;
        video.src = fileUrl;
        video.autoplay = false;

        // Video laden und dann die drawVideos-Funktion aufrufen
        video.addEventListener('loadedmetadata', () => {
            const videoPlayer = document.getElementById('videoPlayer' + nr);
            if (videoPlayer) {
                videoPlayer.innerHTML = '';
                videoPlayer.appendChild(video);
                videoLoadedStatus[nr] = true;

                // Prüfen, ob beide Videos geladen sind und dann die overlayVideos-Funktion aufrufen
                if (Object.keys(videoLoadedStatus).length === 2) {
                    overlayVideos();
                }
            }
        });
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

/* const videoPlayer = document.getElementById('Video' + nr);
if (videoPlayer) {
    videoPlayer.innerHTML = '';
    videoPlayer.appendChild(video);
    videoLoadedStatus[nr] = true;
    //Video control logic
    // const playButton = document.getElementById('playButton' + nr);
    const volumeSlider = document.getElementById('videoVolumeSlider' + nr);
    const playbackSpeedSlider = document.getElementById('videoPlaybackSpeedSlider' + nr);
    //const resetButton = document.getElementById('videoResetButton' + nr);

    /*  playButton.addEventListener('click', () => {
         if (video.paused) {
             video.play();
         } else {
             video.pause();
         }
     }); 

const videoResetButton1 = document.getElementById('resetButton1');
videoResetButton1.addEventListener('click', function () {
    resetVideoTrack(1);
})

const videoResetButton2 = document.getElementById('resetButton2');
videoResetButton2.addEventListener('click', function () {
    resetVideoTrack(2);
})

/*    resetButton.addEventListener('click', () => {
       resetVideoTrack(nr);
   });

volumeSlider.addEventListener('input', () => {
    video.volume = volumeSlider.value / 100;
});

playbackSpeedSlider.addEventListener('input', () => {
    video.playbackRate = playbackSpeedSlider.value;
});

const loopButton = document.getElementById('loopVideoButton' + nr);

loopButton.addEventListener('click', () => {
    video.loop = !video.loop;
    if (video.loop) {
        loopButton.innerHTML = "Unloop";
    } else {
        loopButton.innerHTML = "Loop";
    }
});
} */

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

function overlayVideos() {
    const canvas = document.getElementById('chromaVideo');
    const ctx = canvas.getContext('2d');

    const video1 = document.getElementById('uploadedVideo1');
    const video2 = document.getElementById('uploadedVideo2');

    const chromaSlider = document.getElementById('chromaSlider');

    // Checkbox elements for Video1
    const video1RedCheckbox = document.getElementById('video1RedCheckbox');
    const video1GreenCheckbox = document.getElementById('video1GreenCheckbox');
    const video1BlueCheckbox = document.getElementById('video1BlueCheckbox');

    // Checkbox elements for Video2
    const video2RedCheckbox = document.getElementById('video2RedCheckbox');
    const video2GreenCheckbox = document.getElementById('video2GreenCheckbox');
    const video2BlueCheckbox = document.getElementById('video2BlueCheckbox');

    canvas.width = video1.videoWidth;
    canvas.height = video1.videoHeight;

    function drawVideos() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Filter Video1 based on the checkboxes
        let video1Filtered = filterColor(video1, video1RedCheckbox.checked, video1GreenCheckbox.checked, video1BlueCheckbox.checked);

        ctx.drawImage(video1Filtered, 0, 0, canvas.width, canvas.height);

        // Apply Chromakeying to Video2 based on the checkboxes
        let video2Filtered = applyChromakey(video2, video2RedCheckbox.checked, video2GreenCheckbox.checked, video2BlueCheckbox.checked);

        const alpha = parseFloat(chromaSlider.value) / 100;
        ctx.globalAlpha = alpha;
        ctx.drawImage(video2Filtered, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        requestAnimationFrame(drawVideos);
    }

    // Function to apply color filtering to the video based on checkbox states
    function filterColor(video, red, green, blue) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (red) {
                data[i + 1] = 0; // Set green channel to 0
                data[i + 2] = 0; // Set blue channel to 0
            }
            if (green) {
                data[i] = 0; // Set red channel to 0
                data[i + 2] = 0; // Set blue channel to 0
            }
            if (blue) {
                data[i] = 0; // Set red channel to 0
                data[i + 1] = 0; // Set green channel to 0
            }
        }

        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas;
    }

    // Function to apply Chromakeying to the video based on checkbox states
    function applyChromakey(video, red, green, blue) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = video.videoWidth;
        tempCanvas.height = video.videoHeight;
        tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (red && data[i] > data[i + 1] && data[i] > data[i + 2]) {
                data[i + 3] = 0; // Set alpha channel to 0
            }
            if (green && data[i + 1] > data[i] && data[i + 1] > data[i + 2]) {
                data[i + 3] = 0; // Set alpha channel to 0
            }
            if (blue && data[i + 2] > data[i] && data[i + 2] > data[i + 1]) {
                data[i + 3] = 0; // Set alpha channel to 0
            }
        }

        tempCtx.putImageData(imageData, 0, 0);
        return tempCanvas;
    }

    drawVideos();
}
