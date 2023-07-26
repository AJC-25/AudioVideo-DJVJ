//Get all buttons with class="uploadAudio" and class="uploadVideo" => save in Array uploadButtons
let uploadAudioButtons = document.getElementsByClassName('uploadAudio');
let uploadVideoButtons = document.getElementsByClassName('uploadVideo');
let uploadButtons = [...uploadAudioButtons, ...uploadVideoButtons]; //Convert HTMLCollection to array
let audioLoadedStatus = {};
let videoLoadedStatus = {};

/*When upload button is clicked check whether file of corresponding type has already been loaded. 
If not create file input element and trigger click event 
prompt user to select a file of the specified type (audio or video)*/
uploadButtons.forEach(button => {
    button.addEventListener('click', () => {
        var nr = parseInt(button.getAttribute('id'));
        let fileType = button.classList.contains('uploadAudio') ? 'audio' : 'video';

        if (!isFileLoaded(fileType, nr)) {
            let fileInput = createFileInput(fileType, nr); //create File Input-Element
            fileInput.addEventListener('change', e => handleFileSelect(e, fileType, nr), false);
            fileInput.click(); //trigger the click event on the file input element
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
    fileInput.setAttribute('id', type === 'audio' ? 'audioInput' + nr : 'videoInput' + nr); //save numbers of videos as attributes
    return fileInput; 0
}

// Process chosen video file
function handleFileSelect(evt, type, nr) {
    var file = evt.target.files[0];
    evt.stopPropagation();
    evt.preventDefault();

    var fileUrl = URL.createObjectURL(file);

    if (type === 'audio') {
        const audio = document.createElement('audio');
        audio.id = 'audio' + nr;
        const controllerDiv = document.getElementById('audioRegulatorsAudio' + nr);
        controllerDiv.appendChild(audio); // save audio file in controllerDiv
        //audio.controls = false; // Display of automatically generated bar (Start/Stop button, volume control)

        audio.src = fileUrl; // Save URL for html audio ELement

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


            if (Object.keys(videoLoadedStatus).length === 2) {
                overlayVideos();
            }
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

    /*if play button is clicked check if either the audioTrack or the uploadedVideo is currently paused
    If at least one of is paused play audio and animate record
    */
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

    //Function to reset the audio track
    resetButton.addEventListener('click', () => {
        resetAudioTrack(nr); 
        resetVideoTrack(nr);
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height); // empty Waveform Canvas
    });


    volumeSlider.addEventListener('input', () => {
        audioTrack.volume = volumeSlider.value / 100;
    });

    playbackSpeedSlider.addEventListener('input', () => {
        audioTrack.playbackRate = playbackSpeedSlider.value;
        uploadedVideo.playbackRate = playbackSpeedSlider.value;
    });

    const loopButton = document.getElementById('loopButton' + nr);

    //Function to loop media files
    loopButton.addEventListener('click', () => {
        audioTrack.loop = !audioTrack.loop; // Set the value whether audio loops always to the opposite value (true -> false, false -> true)
        if (audioTrack.loop) { // If all elements are true
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

// Function to reset the uploaded audio track
function resetAudioTrack(nr) {
    const record = document.getElementById('record' + nr);
    const controllerDiv = document.getElementById('audioRegulatorsAudio' + nr);
    const audio = document.getElementById('audio' + nr);

    if (audio) {
        audio.pause();
        audio.src = ''; // Empty the src to stop audio and detach from URL
        audio.load(); // Reloading the audio
        controllerDiv.removeChild(audio);
        delete audioLoadedStatus[nr];
    }

    // Pause animation of the record
    record.style.animationPlayState = 'paused';
    record.offsetHeight;

    // Reset controller values
    const volumeSlider = document.getElementById('volumeSlider' + nr);
    const playbackSpeedSlider = document.getElementById('playbackSpeedSlider' + nr);
    volumeSlider.value = 100; // Reset the volume
    playbackSpeedSlider.value = 1.0; // Reset the playback speed slider
}

// Function to reset the uploaded video track
function resetVideoTrack(nr) {
    const videoPlayer = document.getElementById('videoPlayer' + nr);
    if (videoPlayer) {
        const video = videoPlayer.querySelector('video');
        if (video) {
            video.pause();
            video.src = ''; // Empty the src to stop video and detach from URL
            video.load(); // Reload the video
        }
        delete videoLoadedStatus[nr];
        console.log(videoPlayer);
    }
}

/*visualize the frequency data of HTML audio element on a canvas
render a real-time audio visualization on the canvas element using the frequency data obtained from the given audio element*/
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
            barHeight = dataArray[i] / 2; // divide by 2 so that the bar height remains in the canvas -> compressed
            context.fillStyle = "white";
            context.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
            x += barWidth;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

/*overlay two videos on HTML canvas and allow color filtering for the first video based on checkboxes (red, green, blue channel)
second video is overlayed with adjustable transparency using the slider
continuously update the canvas to create an interactive video overlay effect
 */
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

        const alpha = parseFloat(chromaSlider.value) / 100;
        ctx.globalAlpha = alpha;
        ctx.drawImage(video2, 0, 0, canvas.width, canvas.height);
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

    drawVideos();
}
