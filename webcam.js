/**
 * FaceAPI Demo for Browsers
 * Loaded via `webcam.html`
 */

import * as faceapi from './dist/face-api.esm.js'; // use when in dev mode
// import * as faceapi from '@vladmandic/face-api'; // use when downloading face-api as npm

// configuration options
const modelPath = './model/'; // path to model folder that will be loaded using http
// const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/'; // path to model folder that will be loaded using http
const minScore = 0.2; // minimum score
const maxResults = 1; // maximum number of results to return
let optionsSSDMobileNet;


let gender = document.getElementById('gender');
let Age = document.getElementById('Age');
let Emotion = document.getElementById('Emotion');
let Name = document.getElementById('Name');
let blackWhiteList = document.getElementById('blackWhiteList');
// var button = document.getElementById('FaceRecog');

// helper function to pretty-print json object to string
function str(json) {
  let text = '<font color="lightblue">';
  text += json ? JSON.stringify(json).replace(/{|}|"|\[|\]/g, '').replace(/,/g, ', ') : '';
  text += '</font>';
  return text;
}

// helper function to print strings to html document as a log
function log(...txt) {
  console.log(...txt); // eslint-disable-line no-console
  const div = document.getElementById('log');
  if (div) div.innerHTML += `<br>${txt}`;
}


function drawFaces(canvas, data, fps,) {

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // draw title
  ctx.font = 'small-caps 20px "Segoe UI"';
  ctx.fillStyle = 'white';
  // ctx.fillText(`FPS: ${fps}`, 10, 25);
  for (const person of data) {
    // draw box around each face
    ctx.lineWidth = 3;
    // ctx.strokeStyle = 'deepskyblue';
    // ctx.fillStyle = 'deepskyblue';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.rect(person.detection.box.x, person.detection.box.y, person.detection.box.width, person.detection.box.height);
    ctx.stroke();
    ctx.globalAlpha = 1;
    // draw text labels
    const expression = Object.entries(person.expressions).sort((a, b) => b[1] - a[1]);
    
    ctx.strokeStyle = 'deepskyblue';
    ctx.fillStyle = 'deepskyblue';
    

    // draw face points for each face
    ctx.globalAlpha = 0.8;
    // ctx.fillStyle = 'lightblue';
    
    // from here 
    
    // $(this).find('.robo_seriel').text();
    gender.innerHTML = (`Gender: ${Math.round(100 * person.genderProbability)}% ${person.gender}`);
    Emotion.innerHTML = (`Expression: ${Math.round(100 * expression[0][1])}% ${expression[0][0]}`);
    Age.innerHTML = (`Age: ${Math.round(person.age)} years`);
    // ctx.fillText(`roll:${person.angle.roll}° pitch:${person.angle.pitch}° yaw:${person.angle.yaw}°`, person.detection.box.x, person.detection.box.y - 6);
    // draw face points for each face
    ctx.globalAlpha = 0.8;

    
    // to here

    const pointSize = 2;
    for (let i = 0; i < person.landmarks.positions.length; i++) {
      ctx.beginPath();
      ctx.arc(person.landmarks.positions[i].x, person.landmarks.positions[i].y, pointSize, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function capture(faceMatch) {
  setInterval(async () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d');
  // Draw the video to the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas
  var imgData = canvas.toDataURL('image/jpeg');
  var dataURL = imgData;

  // Convert the data URL to a binary string
  var binaryString = atob(dataURL.split(',')[1]);

  // Create a Uint8Array to store the binary string
  var array = new Uint8Array(binaryString.length);

  // Loop through the binary string and set the values of the Uint8Array
  for (var i = 0; i < binaryString.length; i++) {
    array[i] = binaryString.charCodeAt(i);
  }
  // Create a Blob from the Uint8Array
  var blob = new Blob([array], { type: 'image/jpeg' });

  // Create a URL for the JPG image 
  var url = URL.createObjectURL(blob);

  // Use the URL to create an <img> element and set its src
  var img = document.createElement('img');
  img.src = url;
  // document.body.appendChild(img);
  console.log(img)

    const detections =
      await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors()
      const results = detections.map((d) => {
        return faceMatch.findBestMatch(d.descriptor)
      })
    const noneList = [''];
    const blackList = ['Sarah'];
    const whiteList = ['Dr_Elie', 'Mohammed'];
    
    const css = window.document.styleSheets[0];
    let index;
    let index2;
    results.forEach((result, i) => {
      
      if(whiteList.includes(result._label)){
        
        

        document.styleSheets[0].deleteRule(index);
        $('span').removeClass('unkList');
        $('span').removeClass('removeList');
        $('span').addClass('whiteList');
        index = document.styleSheets[0].insertRule('#circle:after { background-image: url(assets/lists/dr.png); }', 0);
        document.styleSheets[0].cssRules[0].style.backgroundImage= 'assets/lists/dr.png';
     


      }else if(blackList.includes(result._label)){
        $('span').removeClass('unkList');
        $('span').removeClass('whiteList');
        $('span').addClass('removeList');
        document.styleSheets[0].deleteRule(index);
        index = document.styleSheets[0].insertRule('#circle:after { background-image: url(assets/lists/sara.png); }', 0);
        document.styleSheets[0].cssRules[0].style.backgroundImage= 'assets/lists/sara.png';

       
      }else{
        $('span').removeClass('removeList');
        $('span').removeClass('whiteList');
        $('span').addClass('unkList');
        document.styleSheets[0].deleteRule(index);
        index = document.styleSheets[0].insertRule('#circle:after { background-image: url(assets/lists/unknown.jpg); }', 0);
        document.styleSheets[0].cssRules[0].style.backgroundImage= 'assets/lists/unknown.jpg'

      }
      // document.getElementById('a').style.backgroundImage="url(images/img.jpg)";
      Name.innerHTML = `Name: ${result._label}`;
      
    })
  }, 3000)
}

 function detectVideo(video, canvas) {

  if (!video || video.paused) return false;
  
  const t0 = performance.now();
  faceapi
    .detectAllFaces(video, optionsSSDMobileNet)
    .withFaceLandmarks()
    .withFaceExpressions()
    // .withFaceDescriptors()
    .withAgeAndGender()
    .then((result) => {
      const fps = 1000 / (performance.now() - t0);
      drawFaces(canvas, result, fps.toLocaleString());
      requestAnimationFrame(() => detectVideo(video, canvas));
      
      return true;
      
    })
    .catch((err) => {
      log(`Detect Error: ${str(err)}`);
      return false;
    });
  return false;
}


// just initialize everything and call main function
async function setupCamera() {
  const labeledDescriptors = await loadLabeledImages()
  // console.log(labeledDescriptors._label)
  const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.5)

  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  if (!video || !canvas) return null;

  log('Setting up camera');
  // setup webcam. note that navigator.mediaDevices requires that page is accessed via https
  if (!navigator.mediaDevices) {
    log('Camera Error: access not supported');
    return null;
  }
  let stream;
  const constraints = { audio: false, video: { facingMode: 'user', resizeMode: 'crop-and-scale' } };
  if (window.innerWidth > window.innerHeight) constraints.video.width = { ideal: window.innerWidth };
  else constraints.video.height = { ideal: window.innerHeight };
  try {
    stream = await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    if (err.name === 'PermissionDeniedError' || err.name === 'NotAllowedError') log(`Camera Error: camera permission denied: ${err.message || err}`);
    if (err.name === 'SourceUnavailableError') log(`Camera Error: camera not available: ${err.message || err}`);
    return null;
  }
  if (stream) {
    video.srcObject = stream;
  } else {
    log('Camera Error: stream empty');
    return null;
  }
  const track = stream.getVideoTracks()[0];
  const settings = track.getSettings();
  if (settings.deviceId) delete settings.deviceId;
  if (settings.groupId) delete settings.groupId;
  if (settings.aspectRatio) settings.aspectRatio = Math.trunc(100 * settings.aspectRatio) / 100;
  log(`Camera active: ${track.label}`);
  log(`Camera settings: ${str(settings)}`);
  canvas.addEventListener('click', () => {
    if (video && video.readyState >= 2) {
      if (video.paused) {
        video.play();
        capture(faceMatcher);
        detectVideo(video, canvas);
        // faceRecog(video,canvas);
      } else {
        video.pause();
      }
    }
    log(`Camera state: ${video.paused ? 'paused' : 'playing'}`);
  });
  return new Promise((resolve) => {
    video.onloadeddata = async () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.play();
      capture(faceMatcher);
      detectVideo(video, canvas);
      // await capture();
      // faceRecog(video,canvas);
      resolve(true);
    };
  });
}


async function setupFaceAPI() {
  // load face-api models
  // log('Models loading');
  // await faceapi.nets.tinyFaceDetector.load(modelPath); // using ssdMobilenetv1
  await faceapi.nets.ssdMobilenetv1.load(modelPath);
  await faceapi.nets.ageGenderNet.load(modelPath);
  await faceapi.nets.faceLandmark68Net.load(modelPath);
  await faceapi.nets.faceRecognitionNet.load(modelPath);
  await faceapi.nets.faceExpressionNet.load(modelPath);
  optionsSSDMobileNet = new faceapi.SsdMobilenetv1Options({ minConfidence: minScore, maxResults });
  // check tf engine state

  console.log(`Models loaded: ${str(faceapi.tf.engine().state.numTensors)} tensors`);
}

async function loadLabeledImages() {
  const labels = ['Mohammed', 'Abdulaziz', 'Amera', 'Dr_Elie', 'Sarah']
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for (let i = 1; i <= 6; i++) {
        const img = await faceapi.fetchImage(`./labeled_images/${label}/${i}.jpg`)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)// array of Descriptors 
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  )
}

async function main() {

  // default is webgl backend
  await faceapi.tf.setBackend('webgl');
  await faceapi.tf.ready();

  // check version
  // log(`Version: FaceAPI ${str(faceapi?.version || '(not loaded)')} TensorFlow/JS ${str(faceapi?.tf?.version_core || '(not loaded)')} Backend: ${str(faceapi?.tf?.getBackend() || '(not loaded)')}`);
  await setupFaceAPI();
  await setupCamera();

}

// start processing as soon as page is loaded
window.onload = main;
