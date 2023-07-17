# AudioVideo-DJVJ

This is a DJ/VJ Tool created as part of the course Audio-Video Technology at the University of applied Sciences Berlin. 
This application can play 2 audios and 2 videos simultaneously, visulalize the audio and add chroma keying to videos.  

# Requirements

to run this application you need the following programs:
- Node.js
- npm
- a browser

# How to install and run our application

1. Initialize new Node.js project and create package.json
```
npm init
```
2. Install the live-server
```
npm install live-server --save-dev
or:
npm install -g live-server  
```
3. Run the application
```
npm run start
```

# How to use our application 

1. upload songs and videos

- use the "upload audio" and "load video" button to upload songs and videos

2. controllers

- with the controllers you can control audio and video at the same time
- manipulate the volume and playback speed or play the media on loop

3. chroma keying

- you will be able to upload 2 videos and will be played in the preview
- below you can select a color or multiple to use for chroma keying - the chosen color will be set transparent
- with the chroma slider you can set the intensity and set which video will be played in the foreground (slider on the left - video 1 in foreground | slider on the right - video 2 in foreground)

# Used technology

The application was written in Javascript using Node.js. The design was implemented with the help of CSS grids. The visualization of the audio is done with HTML-canvas. 

# Features

- Simultaneous playback of 2 audio tracks and 2 videos
- Separate control of the media (volume, pause, playback speed)
- Visualizations of the audio signal(s)
- Chroma keying of the foreground video
