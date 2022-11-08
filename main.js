import "./style.css";
// import imageSrc from "/src/test.jpg";
import imageSrc from "/src/test2.jpeg";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 450;

const image = new Image();
image.crossOrigin = "Anonymous";
image.src = imageSrc;

image.addEventListener("load", function () {
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // PART 2 && PART 3

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let particalArray = [];
  const numberOfParticles = 7000;

  let mappedImages = [];

  for (let y = 0; y < canvas.height; y++) {
    let row = [];
    for (let x = 0; x < canvas.width; x++) {
      const red = scannedImage.data[y * 4 * scannedImage.width + (x * 4)];
      const green = scannedImage.data[y * 4 * scannedImage.width + (x * 4 + 1)];
      const blue = scannedImage.data[y * 4 * scannedImage.width + (x * 4 + 2)];
      const brightness = calculateRelativeBrightness(red, green, blue);

      const cell = [
        brightness,
        `rgb(${red},${green},${blue})`
      ];

      row.push(cell);
    }
    mappedImages.push(row);
  }

  function calculateRelativeBrightness(red, green, blue) {
    return (
      Math.sqrt(
        (red * red) * 0.299 +
        (green * green) * 0.587 +
        (blue * blue) * 0.114
      ) / 100
    );
  }

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = 0;
      this.speed = 0;
      this.velocity = Math.random() * 0.5;
      this.size = Math.random() * 1.5 + 1;
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);
      this.angle = 0;
    }

    update() {
      this.position1 = Math.floor(this.y);
      this.position2 = Math.floor(this.x);

      if((mappedImages[this.position1]) && (mappedImages[this.position1][this.position2])) {
        this.speed = mappedImages[this.position1][this.position2][0]
      }

      let movement = (2.5 - this.speed) + this.velocity
      
      this.angle+=this.speed/10;

      this.y += movement + Math.sin(this.angle) * 7;
      this.x += movement + Math.cos(this.angle) * 1;

      if (this.y >= canvas.height) {
        this.y = 0;
        this.x = Math.random() * canvas.width;
      }
      if (this.x >= canvas.width) {
        this.x = 0;
        this.y = Math.random() * canvas.height;
      }
    }

    draw() {
      ctx.beginPath();
      if((mappedImages[this.position1]) && (mappedImages[this.position1][this.position2])) {
        ctx.fillStyle = mappedImages[this.position1][this.position2][1];
      }
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    for (let i = 0; i < numberOfParticles; i++) {
      particalArray.push(new Particle());
    }
  }

  init();

  function animate() {
    // ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.05;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.2;

    for (let i = 0; i < particalArray.length; i++) {
      particalArray[i].update();
      ctx.globalAlpha = particalArray[i].speed * 0.5;
      particalArray[i].draw();
    }

    requestAnimationFrame(animate);
  }

  animate();

  // PART 1

  // const scannedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // const scannedData = scannedImage.data

  // for (let i = 0; i < scannedData.length; i += 4) {
  //   const total = scannedData[i] + scannedData[i+1] + scannedData[i+2]
  //   const averageColorValue = total/3

  //   scannedData[i] = averageColorValue
  //   scannedData[i+1] = averageColorValue
  //   scannedData[i+2] = averageColorValue
  // }
  // scannedImage.data.set(scannedData)

  // ctx.putImageData(scannedImage, 0, 0)
});
