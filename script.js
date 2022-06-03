

const canvas = document.getElementById('main-canvas');
const smallCanvas = document.getElementById('small-canvas');
const displayBox = document.getElementById('prediction');

const inputBox = canvas.getContext('2d');
const smBox = smallCanvas.getContext('2d');

let isDrawing = false;
let model;
var numberpre;
var predictions;
var vecteurFalse=new Array();
/* Loads trained model */
async function init() {

  model = undefined;
  
  console.log("start loading model")
  
  model = await tf.loadLayersModel('./modelfin/model.json');

  console.log("model loaded..");

}

canvas.addEventListener('mousedown', event => {
  isDrawing = true;

  inputBox.strokeStyle = 'white';
  inputBox.lineWidth = '15';
  inputBox.lineJoin = inputBox.lineCap = 'round';
  inputBox.beginPath();
  
});

canvas.addEventListener('mousemove', event => {
  if (isDrawing) drawStroke(event.clientX, event.clientY);
});

canvas.addEventListener('mouseup', event => {
  isDrawing = false;
  //updateDisplay(predict());
});

function predict_onclick(){
  isDrawing = false;
  updateDisplay(predict());
}

/* Draws on canvas */
function drawStroke(clientX, clientY) {
  // get mouse coordinates on canvas
  const rect = canvas.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // draw
  inputBox.lineTo(x, y);
  inputBox.stroke();
  inputBox.moveTo(x, y);
}

/* Makes predictions */
function predict() {
  let values = getPixelData();
 predictions = model.predict(values).dataSync();
 console.log(predictions)
  return predictions;
}

//resetClick
function resetClick(){
  if(predictions !=null){
  
    predictions[numberpre]=0
    var bestPred
     bestPred = predictions.indexOf(Math.max(...predictions));
     displayBox.innerText = bestPred;
    
    numberpre=bestPred
    console.log("hello"+bestPred)
   // predictions=newpredictions;
  }}

/* Returns pixel data from canvas after applying transformations */
function getPixelData() {
  smBox.drawImage(inputBox.canvas, 0, 0, smallCanvas.width, smallCanvas.height);
  const imgData = smBox.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
  console.log();
  // preserve and normalize values from red channel only
  let values = [];
  for (let i = 0; i < imgData.data.length; i += 4) {
    values.push(imgData.data[i] / 255);
    
  }
  values = tf.reshape(values, [1, 28, 28, 1]);
  return values;
}

/* Displays predictions on screen */
function updateDisplay(predictions) {
  // Find index of best prediction, which corresponds to the predicted value
  const bestPred = predictions.indexOf(Math.max(...predictions));
  
  displayBox.innerText = bestPred;
  numberpre=bestPred
  console.log(bestPred)
}

document.getElementById('erase').addEventListener('click', erase);

/* Clears canvas */
function erase() {
  inputBox.fillStyle = 'black';
  
  inputBox.fillRect(0, 0, canvas.width, canvas.height);
  displayBox.innerText = '';
}

erase();
init();
//calculatrice
document.getElementById('answer').readOnly = true; //set this attribute in Html file
let screen = document.getElementById('answer');
buttons = document.querySelectorAll(".operation");
console.log(buttons)
let screenValue = '';
function saveNumber(){
  if(numberpre !=null){
   screenValue+=numberpre
   screen.value = screenValue;
  }
}
  
  for (item of buttons) {
      item.addEventListener('click', (e) => {
          
          buttonText = e.target.innerText;
          console.log(buttonText, "has been pressed");
          if (buttonText == '*') {
              buttonText = '*';
              screenValue += buttonText;
              screen.value = screenValue;
          }
          else if (buttonText == 'c') {
              screenValue = "";
              screen.value = screenValue;
          }
          else if (buttonText == '=') {
              screen.value = eval(screenValue);
              screenValue = "";
          }
          else {
              screenValue += buttonText;
              screen.value = screenValue;
          }
  
      })
  }
//   window.onerror = function(){
//     alert("PLEASE INPUT VALID EXPRESSION");
//     screenValue = "";
//     screen.value = screenValue;
//     console.clear();
// }
  