const video = document.getElementById("video");

function startWebcam() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();

        startBarcodeScanner();
      })
      .catch((error) => {
        console.error("Error accessing the webcam:", error);
        alert("Could not access the webcam. Please allow camera permissions.");
      });
  } else {
    alert("Your browser does not support accessing the webcam.");
  }
}

function startBarcodeScanner() {
  Quagga.init(
    {
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: video, 
        constraints: {
          width: 400,
          height: 300,
          facingMode: "environment", 
        },
      },
      decoder: {
        readers: [
          "code_128_reader",
          "ean_reader",
          "ean_8_reader",
          "upc_reader",
          "upc_e_reader",
        ],
      },
    },
    function (err) {
      if (err) {
        console.error("QuaggaJS initialization failed:", err);
        alert("Failed to initialize barcode scanner.");
        return;
      }
      console.log("QuaggaJS initialized successfully.");
      Quagga.start(); 
    }
  );

  Quagga.onDetected((result) => {
    const code = result.codeResult.code;
    console.log("Barcode detected:", code);

    Quagga.stop();

    document.getElementById("barcode-name").value = code;
    document.getElementById("barcode-quantity").value = 1; 
    document.getElementById("barcode-price").value = 0.0;

    document.getElementById("barcode-form").style.display = "block";
  });
}

document.getElementById("start-scan").addEventListener("click", startWebcam);
