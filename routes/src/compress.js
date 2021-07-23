const fse = require('fs-extra')

const _generateRandomColorInt = () => {
  return [
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  ];
};

const _getRandomLinearBitmap = (width, height) => {
  const randomColorRGBInt = _generateRandomColorInt();
  let bitmap = [];
  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      bitmap.push(randomColorRGBInt[0]);
      bitmap.push(randomColorRGBInt[1]);
      bitmap.push(randomColorRGBInt[2]);
    }
  }

  return bitmap;
};

// Generates three horizontal color stripes
const _getThreeColorStripesBitmap = (width, height) => {
    const randomColorRGBInt1 = _generateRandomColorInt()
    const randomColorRGBInt2 = _generateRandomColorInt()
    const randomColorRGBInt3 = _generateRandomColorInt()

    let bitmap = [];
    for (let row = 0; row < Math.floor(height/3); row++) {
        for (let col = 0; col < width; col++) {
        bitmap.push(randomColorRGBInt1[0]);
        bitmap.push(randomColorRGBInt1[1]);
        bitmap.push(randomColorRGBInt1[2]);
        }
    }

    for (let row = Math.floor(height/3); row < Math.floor(2*height/3); row++) {
        for (let col = 0; col < width; col++) {
        bitmap.push(randomColorRGBInt2[0]);
        bitmap.push(randomColorRGBInt2[1]);
        bitmap.push(randomColorRGBInt2[2]);
        }
    }

    for (let row = Math.floor(2*height/3); row < height; row++) {
        for (let col = 0; col < width; col++) {
        bitmap.push(randomColorRGBInt3[0]);
        bitmap.push(randomColorRGBInt3[1]);
        bitmap.push(randomColorRGBInt3[2]);
        }
    }

  return bitmap;
}

const basicColors = [
  [0, 0, 0], //black
  [255, 255, 255], //white
  [255, 0, 0], //red
  [0, 255, 0], //green
  [0, 0, 255], //blue
  [255, 255, 0], //yellow
  [255, 0, 255], //pink
  [0, 255, 255], //cyan
];


const _compress = (bytes) => {
    //TODO: do something
    return bytes
}

// Assume that each entry can be in range of 0-255, so only 1 byte per entry
const _getSizeKB = (buffer) => {
    const bytes = Buffer.byteLength(buffer) * 1
    const kBytes = bytes/1024
    return kBytes
}

// contains a linear array of 1228800 entries (640x640xRGB pixels)
const randomStripesBitmap = _getThreeColorStripesBitmap(640, 640)

// the bitmap is now just byte data. You can imagine it is going to store more than pixel data there
const bytes = Buffer.from(randomStripesBitmap)
const compressedBytes = _compress(bytes)

console.log(`Size before compression: ${_getSizeKB(bytes)} KB; ${_getSizeKB(bytes)/1024} MB.`)
console.log(`Size after compression: ${_getSizeKB(compressedBytes)} KB; ${_getSizeKB(compressedBytes)/1024} MB`)
