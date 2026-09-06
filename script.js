const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";

let model;

async function loadModel() {
    model = await tmImage.load(modelURL, metadataURL);
    console.log("AI model loaded!");
}

navigator.mediaDevices.getUserMedia({ video: true });

loadModel();