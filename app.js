const URL = 'https://github.com/sundar505/test_model/blob/main/img_model.tm';
let model, webcam, labelContainer, maxPredictions;

// Load the model and setup the webcam
async function init() {
    model = await tmImage.load(URL);
    maxPredictions = model.getTotalClasses();

    // Setup a webcam
    const flip = true;
    webcam = new tmImage.Webcam(224, 224, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Append elements to the DOM
    document.getElementById('webcam').appendChild(webcam.canvas);
    labelContainer = document.getElementById('result');
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement('div'));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Run the webcam image through the image model
async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }
}

// Initialize the application
init();