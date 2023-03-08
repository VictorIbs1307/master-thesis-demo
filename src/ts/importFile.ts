export function importFileInit(imageRowSlice: HTMLInputElement) {
    const input = document.querySelector('input[type=file]') as HTMLInputElement;
    input.addEventListener('change', function(evt) {
        const source = (evt.target as HTMLInputElement).files![0];
        const image = new Image();

        image.onload = function() {
            imageRowSlice.max = String(image.height);
            drawFrame(this as HTMLImageElement | HTMLVideoElement);
        }
        image.onerror = function() {
            console.log("error loading image!");
        }
        window.URL.revokeObjectURL(image.src);
        image.src = window.URL.createObjectURL(source);
    }, false);
}


function drawFrame(source: HTMLImageElement | HTMLVideoElement) {
    var MAX_WIDTH = 800;
    var MAX_HEIGHT = 800;
    var width, height;
    if ('naturalWidth' in source) { // Check if source is an HTMLImageElement
        width = source.naturalWidth;
        height = source.naturalHeight;
      } else { // Otherwise, assume source is an HTMLVideoElement
        width = source.videoWidth;
        height = source.videoHeight;
      }

    // Change the resizing logic
    if (width > height) {
        if (width > MAX_WIDTH) {
            height = height * (MAX_WIDTH / width);
            width = MAX_WIDTH;
        }
    } else {
        if (height > MAX_HEIGHT) {
            width = width * (MAX_HEIGHT / height);
            height = MAX_HEIGHT;
        }
    }

    const canvas = document.getElementById("Mycanvas") as HTMLCanvasElement;
    const context = canvas.getContext("2d");
    const canvas2 = document.getElementById("ProcessCanvas") as HTMLCanvasElement;
    const context2 = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;
    context.drawImage(source, 0, 0, width, height);
    canvas2.width = width
    canvas2.height = height;
    context2.drawImage(source, 0, 0, width, height);
}