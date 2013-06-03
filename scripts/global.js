var demoMode=true;
var levelJump = false;
var is_warp_url = false;
var infinite_loop =false;
var warp_url = "./"
var globalBlockCount = 0;
var blockOfBlocks = [];
var jumpInProgress = false;
var currentPlane = 300;
var levelfloor = 300;
var onTopOf;
var spacialCoord = new Array()
var onGround;
var downKeyPressed = false;
var acInc = 0;
var docURL = document.URL;
var levelRenderer;
var xposLeft;
var inc = 0;
var lastInc = 0;
var timeDirPos = new Array();
var incMe = 0;
var directionPosition = 'right';
var doneMoving = true;
var screenLoop = true;
var mario = null;

$(function(){
  blockOfBlocks.push(new BlockElement(40, 40, 679, 164, false, 'coin-block'));
  blockOfBlocks.push(new BlockElement(40, 40, 149, 164, false, 'brick-block'));
  blockOfBlocks.push(new BlockElement(40, 40, 300, 164, true, 'brick-block'));
  blockOfBlocks.push(new BlockElement(40, 40, 340, 164, true, 'brick-block'));
  blockOfBlocks.push(new BlockElement(100, 91, 469, 266, false, 'pipe'));

  var otherArgs = {};
  otherArgs.angle = 180;

  blockOfBlocks.push(new BlockElement(100, 91, 469, -26, false, 'pipe', otherArgs));
  blockOfBlocks.push(new BlockElement(273, 40, 820, 277, false, 'brick-block'));
  blockOfBlocks.push(new BlockElement(40, 40, 949, 150, false, 'coin-block'));
 
  if (levelRenderer) {
    searchAndCreate();
  }
  blockOfBlocks[0].assignSpacialCoord(); /* updates spacial coordinates*/
})