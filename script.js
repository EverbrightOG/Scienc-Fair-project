document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("camera");
    const button = document.getElementById("startCamera");
    const result = document.getElementById("result");

    const modelURL = "./Model/model.json";
    const metadataURL = "./Model/metadata.json";

    let model;

    // Check that the HTML elements actually exist
    if (!video || !button || !result) {
        console.error("Could not find one or more HTML elements.");
        return;
    }

    // Load the AI model
    async function loadModel() {
        result.textContent = "Loading AI model...";

        model = await tmImage.load(modelURL, metadataURL);

        result.textContent = "AI model loaded! Start the camera.";
        console.log("AI model loaded!");
    }

    // Start the camera
    button.addEventListener("click", async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });

        video.srcObject = stream;

        result.textContent = "Camera started! Looking for waste...";

        predict();
    });

    // Ask the AI what it sees
    async function predict() {
        if (!model) {
            return;
        }

        const predictions = await model.predict(video);

        let bestPrediction = predictions[0];

        for (let i = 1; i < predictions.length; i++) {
            if (predictions[i].probability > bestPrediction.probability) {
                bestPrediction = predictions[i];
            }
        }

        const percentage =
            (bestPrediction.probability * 100).toFixed(1);

        result.textContent =
            `${bestPrediction.className} — ${percentage}%`;

        requestAnimationFrame(predict);
    }

    // Load the model
    loadModel();

});