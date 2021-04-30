// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
var synth = window.speechSynthesis;
var inputElement = document.getElementById("image-input");
inputElement.addEventListener("change", handleFiles, false);
var voiceSelect = document.querySelector('select');

var range = document.querySelector("[type='range']");
var generate = document.querySelector("[type='submit']");
var clear = document.querySelector("[type='reset']");
var read = document.querySelector("[type='button']");
var topText = document.getElementById("text-top").value;
var bottText = document.getElementById("text-bottom").value;
var slider = document.querySelector("[type='button']");
var voices = [];
var volume_level = 3;
var icon = document.querySelector('#volume-group img');
setTimeout(() => {
  console.log(window.speechSynthesis.getVoices());
}, 50);

range.addEventListener("input", function(){
  if (range.value > 66){
    volume_level = range.value;
   icon.src = "icons/volume-level-3.svg";
  }

  else if(range.value > 33){
volume_level = range.value;
icon.src = "icons/volume-level-2.svg";
  }

  else if(range.value > 0){
volume_level = range.value;
icon.src = "icons/volume-level-1.svg";
  }

  else if(range.value == 0){
volume_level = range.value;
icon.src = "icons/volume-level-0.svg";
  }
});

function populateVoiceList() {
  voiceSelect.disabled = false;
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  

  speechSynthesis.addEventListener("voiceschanged", () => {
    var voices = speechSynthesis.getVoices()
  

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
});
}

populateVoiceList();
clear.addEventListener("click", function(){
  const canvas = document.getElementById('user-image');
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  generate.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  document.getElementById("text-bottom").value = "";
  document.getElementById("text-top").value = "";
  document.getElementById("image-input").value = null;
});


read.addEventListener("click", function(){
  var utterance = new SpeechSynthesisUtterance(document.getElementById("text-top").value + " " +  document.getElementById("text-bottom").value);
  utterance.volume = volume_level/100;
  console.log(voiceSelect.value.slice(-6, -1));
  utterance.lang = voiceSelect.value.slice(-6, -1);
  console.log(voiceSelect.value.slice(-6, -1));
  synth.speak(utterance);
 
});

generate.addEventListener("click", function(event){
  event.preventDefault();
 
  w_canvas(document.getElementById('user-image').getContext('2d'), document.getElementById("text-top").value, document.getElementById("text-bottom").value);
  
  generate.disabled = true;
  clear.disabled = false;
  read.disabled = false;
});


function w_canvas(ctx, top, bott){
 

  ctx.fillStyle = "Blue";
  ctx.font  = "30pt Arial";
  ctx.setAlign = "center";
  //ctx.translate(200, 0);
  if(top){
  ctx.textAlign = "center";  
  ctx.fillText(top.toUpperCase(), 200, 50);
}
  //ctx.translate(0,300);
  if(bott){
  ctx.textAlign = "center";  
  ctx.fillText(bott.toUpperCase(), 200,375);}

}


function handleFiles(){
  if(inputElement){
    img.src = URL.createObjectURL(this.files[0]);
    img.alt =  this.value.split("/").pop();
  }
}



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  inputElement.addEventListener("change", handleFiles, false);
  // TODO
  
  console.log(img.src);

  const canvas = document.getElementById('user-image');
  const context = canvas.getContext('2d');

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black';
  context.fillRect(0, 0, 400, 400);
  var new_vals = getDimmensions(400, 400, img.width, img.height);



  context.drawImage(img,new_vals.startX,new_vals.startY,  new_vals.width,  new_vals.height);

  
  
  //var clear = document.querySelector("[type='reset']");
  //clear.removeAttribute('disabled');
  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
