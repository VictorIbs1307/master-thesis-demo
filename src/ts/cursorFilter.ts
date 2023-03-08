
const canvas = document.getElementById('Mycanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

const canvas2 = document.getElementById('ProcessCanvas') as HTMLCanvasElement;
const ctx2 = canvas2.getContext('2d');

canvas.addEventListener('mousemove', (event) => {
  const x = event.offsetX;
  const y = event.offsetY;
  const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height);
  changePixelData(imageData, x, y, 10);
  ctx2.putImageData(imageData, 0, 0);
});

function changePixelData(imageData: ImageData, x: number, y: number, radius: number) {
    for (let i = 0; i < imageData.data.length; i += 4) {
      const dx = x - (i / 4) % imageData.width;
      const dy = y - Math.floor((i / 4) / imageData.width);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius) {
        imageData.data[i] = Math.floor(Math.random() * 256); // red
        imageData.data[i + 1] = Math.floor(Math.random() * 256); // green
        imageData.data[i + 2] = Math.floor(Math.random() * 256); // blue
      }
    }
  }