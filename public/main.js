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

function isEdgeClipped (data, getNextIndex) {
  var index = getNextIndex();
  while (false !== index ) {
    if (data[index + 3] > 0) {
      return [
        data[index],
        data[index + 1],
        data[index + 2],
        data[index + 3]
      ];
    }
    index = getNextIndex(index);
  }
  return false;
}

function walkHorizontallyFn (start, imgData) {
  return function (index) {
    var nextIndex, end;
    end = start + (imgData.width * 4);
    nextIndex = (index || start) + 4;
    return nextIndex < end && nextIndex;
  };
}

function walkVerticallyFn (start, imgData) {
  return function (index) {
    var end, nextIndex;
    end = start + imgData.height * imgData.width * 4;
    nextIndex = (index || start) + (imgData.width * 4);
    return nextIndex < end && nextIndex;
  };
}

function populateEdges (img) {
  var bottomLeft, context, imgData, topRight;

  canvas = document.createElement('canvas');

  canvas.height = img.naturalHeight;
  canvas.width = img.naturalWidth;
  context = canvas.getContext('2d');

  context.drawImage(img, 0, 0);
  imgData = context.getImageData(0, 0, canvas.width, canvas.height);

  bottomLeft = (img.naturalHeight - 1) * (img.naturalWidth - 1) * 4;
  topRight = (img.naturalWidth - 1) * 4;

  return {
    top: isEdgeClipped(imgData.data, walkHorizontallyFn(0, imgData)),
    bottom: isEdgeClipped(imgData.data, walkHorizontallyFn(bottomLeft, imgData)),
    left: isEdgeClipped(imgData.data, walkVerticallyFn(0, imgData)),
    right: isEdgeClipped(imgData.data, walkVerticallyFn(topRight, imgData))
  };
};

IMAGES.forEach(function (src) {
  var img = new Image();
  console.log('processing image ' + src);
  img.onload = function () {
    var edges = populateEdges(img);
    Object.keys(edges).forEach(function (edge) {
      var styleProp = 'border-' + edge + '-color';
      if (edges[edge]) {
        img.style[styleProp] = 'rgba(' +
          edges[edge][0] + ', ' +
          edges[edge][1] + ', ' +
          edges[edge][2] + ', ' +
          edges[edge][3] +
        ')';
      }
    });
    container.appendChild(img);
    console.log('done ' + img.naturalWidth + 'x' + img.naturalHeight);
  }
  img.src = src;
});
