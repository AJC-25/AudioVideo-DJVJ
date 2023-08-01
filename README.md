# AudioVideo-DJVJ

This is a DJ/VJ tool created as part of the course Audio-Video Technology at the University of applied Sciences Berlin. </br> 
This application can play 2 audios and 2 videos simultaneously, visulalize the audio and add chroma keying / blending to videos. </br> 
Besides the usual controls for play/pause and volume, you can also influence the playback speed, loop the audios and videos, and reset them individually to upload new media. 


# Requirements

to run this application you need the following programs:
- Programming environment
- Node.js
- npm
- a browser

# How to install and run our application

1. Clone or download this project from GitHub and open it in your environment 

2. Initialize new Node.js project and create package.json
```
npm init
```
3. Install the npm packages

Use ```npm install``` to install all neccessary npm packages and node modules to run this project.
This command should also install the live server. If not use:
```
npm install live-server --save-dev
or:
npm install -g live-server  
```
4. Run the application
```
npm run start
```

# How to use our application 

1. upload songs and videos

- use the "upload audio" and "load video" buttons to upload songs and videos
- you can upload any audio and video as there is no assets folder in this project
- recommended source for (license) free audio downloads: https://www.bensound.com/
- recommended sources for (license) free video downloads: https://pixabay.com/de/videos/ or https://www.pexels.com/de-de/videos/

2. controllers

- controllers: play/pause, loop, reset, volume, playback speed
- manipulate the volume and playback speed or play the media on loop
- use reset to upload new media
- with the controllers you can control audio and video at the same time
  --> the controls on the left side affect the audio and the video on the left side at the same time. The same applies to the right side

3. chroma keying

- you will be able to upload 2 videos that will be played in the preview sections
- below you can select a color or multiple to use for chroma keying
  --> the chosen color will be set transparent
- with the chroma slider you can set the intensity and set which video will be played in the foreground (slider on the left - video 1 in foreground | slider on the right - video 2 in foreground) --> blend videos on top of each other

# Used technology

The application was written in Javascript using Node.js. The design was implemented with the help of CSS grids. The visualization of the audio and video is done with HTML-canvas. 
You will find all structures from css grid in the index.html styled by the style.css. All functions and further functional code can be found in the index.js. 

# Features

- Simultaneous playback of 2 audio tracks and 2 videos
- Controls for the media: volume, play/pause, playback speed, loop, reset 
- Simultaneous control of the audios and videos 
- Visualizations of the audio signals
- Chroma keying / blending of the videos using a slider 
