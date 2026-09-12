document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("camera");
    const button = document.getElementById("startCamera");
    const result = document.getElementById("result");

    const modelURL = "./Model/model.json";
    const metadataURL = "./Model/metadata.json";

    let model = null;

    // Check that the HTML elements actually exist
    if (!video || !button || !result) {
        console.error("Could not find one or more HTML elements.");
        return;
    }

    // Load the AI model
    async function loadModel() {
        try {
            result.textContent = "Loading AI model...";

            model = await tmImage.load(modelURL, metadataURL);

            console.log("AI model loaded!", model);
            result.textContent = "AI model loaded! Start the camera.";

        } catch (error) {
            console.error("MODEL LOAD ERROR:", error);
            result.textContent = "Error loading AI model. Check the console.";
        }
    }

    // Start the camera
    button.addEventListener("click", async () => {

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "environment"
                    }
                }
            });

            video.srcObject = stream;

            // Wait until the camera actually has video data
            await video.play();

            result.textContent = "Camera started! Identifying waste...";

            // Make sure the AI model is ready
            if (!model) {
                result.textContent = "AI model is still loading...";
                return;
            }

            predict();

        } catch (error) {
            console.error("CAMERA ERROR:", error);
            result.textContent = "Camera error. Check the console.";
        }
    });

    // Ask the AI what it sees
    async function predict() {

        if (!model) {
            console.error("Prediction attempted before model loaded.");
            return;
        }

        try {

            const predictions = await model.predict(video);

            console.log("Predictions:", predictions);

            // Start with the first prediction
            let bestPrediction = predictions[0];

            // Find the prediction with the highest probability
            for (let i = 1; i < predictions.length; i++) {

                if (
                    predictions[i].probability >
                    bestPrediction.probability
                ) {
                    bestPrediction = predictions[i];
                }
            }

            const percentage =
                (bestPrediction.probability * 100).toFixed(1);

            result.textContent =
                `${bestPrediction.className} — ${percentage}%`;

            // Predict again on the next animation frame
            requestAnimationFrame(predict);

        } catch (error) {

            console.error("PREDICTION ERROR:", error);
            result.textContent = "Prediction error. Check the console.";

        }
    }

    // Load the model when the webpage opens
    loadModel();

});