// app.js -- all the javascript logic

/*
TODO:
- hookup input layer
- add gamepad
- add keyboard
- add touch events
*/

var canvas, ctx, startTime, imgTiles, imgSprites, map = [];
var TILE_SOURCE_SIZE = 32;
var TILE_DEST_SIZE = 48;
var NUM_SPRITES_PER_ROW = 4;  // spritesheet has 4 characters wide, each having 3x4 frames 32x32px
var NUM_SPRITE_FRAMES = 3; // each character position has three positions
var TIME_PER_FRAME = 100; // in milliseconds
var SPRITE_DIRECTION = {
  DOWN: 0,
  LEFT: 1,
  RIGHT: 2,
  UP: 3,
};
var spriteX = 2, spriteY = 2;

//=========================================================//

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function linearTween(currTime, start, delta, duration) {
  // Taken from http://upshots.org/actionscript/jsas-understanding-easing
  // Example: currTime = 0.2 seconds, duration = 1 second, start = 50px, delta = 150px
  // call linearTween(200 /* ms */, 50 /* px */, 150 /* px */, 1000 /* ms */)
  // will return (50 + (0.2) * 150) = 50 + 30 = 80px
  return start + (currTime / duration) * delta;
}

function drawSprite(personIdx, direction, tick) {
  // Draw a sprite
  var personStartX = (personIdx % NUM_SPRITES_PER_ROW) * (TILE_SOURCE_SIZE * NUM_SPRITE_FRAMES);
  var personStartY = ~~(personIdx / NUM_SPRITES_PER_ROW) * TILE_SOURCE_SIZE;
  var directionYOffset = direction * TILE_SOURCE_SIZE;
  // There are three distinct frames for each direction; the middle one is used twice
  var frames = [0, 1, 2, 1];
  var frame = frames[~~((tick % (frames.length * TIME_PER_FRAME)) / TIME_PER_FRAME)];
  var frameXOffset = frame * TILE_SOURCE_SIZE;
  ctx.drawImage(imgSprites, 
    personStartX + frameXOffset, personStartY + directionYOffset, TILE_SOURCE_SIZE, TILE_SOURCE_SIZE,
    spriteX * TILE_DEST_SIZE, spriteY * TILE_DEST_SIZE, TILE_DEST_SIZE, TILE_DEST_SIZE
  );
}

function draw(tick) {
  // Clear background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the map
  ctx.imageSmoothingEnabled = false;
  map.forEach(function(tile) {
    var sourceX = tile.tileX * TILE_SOURCE_SIZE;
    var sourceY = tile.tileY * TILE_SOURCE_SIZE;
    var destX = tile.x * TILE_DEST_SIZE;
    var destY = tile.y * TILE_DEST_SIZE;
    ctx.drawImage(imgTiles,
      sourceX, sourceY, TILE_SOURCE_SIZE, TILE_SOURCE_SIZE,
      destX, destY, TILE_DEST_SIZE, TILE_DEST_SIZE
    );
  });

  // Draw a sprite
  drawSprite(2, SPRITE_DIRECTION.DOWN, tick);
}

function update(tick) {
  // check input
  /*

    
  */
}

function loop() {
  if (startTime !== undefined) {
    var tick = new Date().valueOf() - startTime;
    update(tick);
    draw(tick);
    requestAnimationFrame(loop);
  }
}

function onKeyDown(e) {
  // if (e.which === 40 /* down */) {}
  return false;
}

function startGame() { startTime = new Date().valueOf(); loop(); }
function endGame() { startTime = undefined; }

function loadTiles() {
  return new Promise(function(resolve, reject) {
    imgTiles = new Image();
    imgTiles.onload = resolve;
    imgTiles.onerror = reject;
    imgTiles.src = './tileset_32x32.png';    
  });
}

function loadMap() {
  return fetch('./simple_island.json')
    .then(function(data){
      return data.json()
        .then(function(mapData) { map = mapData; });
    });
}

function loadSprites() {
  return new Promise(function(resolve, reject) {
    imgSprites = new Image();
    imgSprites.onload = resolve;
    imgSprites.onerror = reject;
    imgSprites.src = './spritesheet.png';    
  });
}

window.onload = function() {
  console.log('Map Explore');
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Boot the game
  Promise
    .all([
      loadTiles(),
      loadMap(),
      loadSprites()
    ])
    .then(startGame);
}