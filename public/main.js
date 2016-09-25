var canvas, container, context, img, viewport;

var IMAGES = [
  'hefty-smurf-awkward.png',
  'hefty-smurf-biceps.png',
  'hefty-smurf-full.png',
  'hefty-smurf-hat.png',
  'hefty-smurf-shirt.png',
  'hefty-smurf-shoes.png'
];

viewport = document.body.getBoundingClientRect();
container = document.getElementById('container');

function pixelColor(pixel) {
  return {
    red: pixel & 255,
    green: (pixel >> 8) & 255,
    blue: (pixel >> 16) & 255,
    alpha: (pixel >> 24) & 255
  };
}

function isEdgeClipped (data, getNextIndex) {
  var index, pixel;
  index = getNextIndex();
  while (false !== index ) {
    pixel = pixelColor(data[index]);
    if (pixel.alpha > 0) {
      return pixel;
    }
    index = getNextIndex(index);
  }
  return false;
}

function walkHorizontallyFn (start, imgData) {
  return function (index) {
    var nextIndex, end;
    end = start + imgData.width;
    nextIndex = (index || start) + 1;
    return nextIndex < end && nextIndex;
  };
}

function walkVerticallyFn (start, imgData) {
  return function (index) {
    var end, nextIndex;
    end = start + imgData.height * imgData.width;
    nextIndex = (index || start) + imgData.width;
    return nextIndex < end && nextIndex;
  };
}

function populateEdges (img) {
  var bottomLeft, context, imgData, imgData8Bit, topRight;

  canvas = document.createElement('canvas');

  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  context = canvas.getContext('2d');

  context.drawImage(img, 0, 0);
  imgData8Bit = context.getImageData(0, 0, canvas.width, canvas.height);
  imgData = {
    data: new Uint32Array(imgData8Bit.data.buffer),
    height: imgData8Bit.height,
    width: imgData8Bit.width
  };

  bottomLeft = (img.naturalHeight - 1) * (img.naturalWidth);
  topRight = img.naturalWidth - 1;

  return {
    top: isEdgeClipped(imgData.data, walkHorizontallyFn(0, imgData)),
    bottom: isEdgeClipped(imgData.data, walkHorizontallyFn(bottomLeft, imgData)),
    left: isEdgeClipped(imgData.data, walkVerticallyFn(0, imgData)),
    right: isEdgeClipped(imgData.data, walkVerticallyFn(topRight, imgData))
  };
};

IMAGES.forEach(function (src) {
  var img = new Image();
  img.onload = function () {
    console.time('processing image ' + src);

    var edges = populateEdges(img);
    Object.keys(edges).forEach(function (edge) {
      var styleProp = 'border-' + edge + '-color';
      if (edges[edge]) {
        img.style[styleProp] = 'rgba(' +
          edges[edge].red + ', ' +
          edges[edge].green + ', ' +
          edges[edge].blue + ', ' +
          edges[edge].alpha +
        ')';
      }
    });

    console.timeEnd('processing image ' + src);
    console.log(img.width + 'x' + img.height);

    container.appendChild(img);
  }
  img.src = src;
});
