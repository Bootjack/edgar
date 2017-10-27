function pixelColor(pixel) {
  return {
    red: pixel & 255,
    green: (pixel >> 8) & 255,
    blue: (pixel >> 16) & 255,
    alpha: (pixel >> 24) & 255
  };
}

function walkHorizontallyFn(start, imgData) {
  return function (index) {
    const end = start + imgData.width;
    const nextIndex = (index || start) + 1;
    return nextIndex < end && nextIndex;
  };
}

function walkVerticallyFn(start, imgData) {
  return function (index) {
    const end = start + imgData.height * imgData.width;
    const nextIndex = (index || start) + imgData.width;
    return nextIndex < end && nextIndex;
  };
}

function isEdgeClippedFn(data, options = {}) {
  return function (getNextIndex) {
    let pixel;
    let index = getNextIndex();
    const alphaThreshold = options.alphaThreshold || 0;
    while (false !== index) {
      pixel = pixelColor(data[index]);
      if (pixel.alpha > alphaThreshold) {
        return pixel;
      }
      index = getNextIndex(index);
    }
    return false;
  }
}

function populateEdges(options = {}) {
  return function(img) {
    const canvas = document.createElement('canvas');
    canvas.height = options.height || img.height;
    canvas.width = options.width || img.width;

    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imgData8Bit = context.getImageData(0, 0, canvas.width, canvas.height);
    const imgData = {
      data: new Uint32Array(imgData8Bit.data.buffer),
      height: imgData8Bit.height,
      width: imgData8Bit.width
    };

    const bottomLeft = (canvas.height - 1) * (canvas.width);
    const topRight = canvas.width - 1;

    const isEdgeClipped = isEdgeClippedFn(imgData.data, options);

    return {
      top: isEdgeClipped(walkHorizontallyFn(0, imgData)),
      bottom: isEdgeClipped(walkHorizontallyFn(bottomLeft, imgData)),
      left: isEdgeClipped(walkVerticallyFn(0, imgData)),
      right: isEdgeClipped(walkVerticallyFn(topRight, imgData))
    };
  };
}

export function testEdges(src, options) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.addEventListener('load', evt => resolve(populateEdges(options)(img)));
    img.addEventListener('error', evt => reject(img));
    img.src = src;
  });
}
