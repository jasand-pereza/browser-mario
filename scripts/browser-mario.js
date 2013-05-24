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

$(function() {

  /*creates a block element
  Arguments: width, height, left, top, breakable, kind, other arguments */
  function BlockElement(w, h, l, t, b, kind, otherArgs) {
    var tempBlock = document.createElement('div');
    var pipeTop, vertPipe;
    this.bWidth = w;
    this.bHeight = h;
    this.bLeft = l;
    this.bTop = t;
    this.generalType = 'blockElement';
    if (otherArgs) this.otherOptions = otherArgs;
    b ? this.bBreakable = 'breakable' : this.bBreakable = 'noBreak';
    this.b_type = (typeof kind == 'undefined') ? ' ' : ' ' + kind + ' ';
    this.thisId = 'bE_' + globalBlockCount;
    tempBlock.setAttribute('id', 'bE_' + globalBlockCount);

    if (demoMode) {
      switch (kind) {
      case 'brick-block':
        tempBlock.setAttribute('class', this.generalType + this.b_type + this.bBreakable + ' ground');
        tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
        break;
      case 'pipe':
        tempBlock.setAttribute('class', this.generalType + ' vert_pipe_whole' + ' ground');
        tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
        pipeTop = document.createElement('div');
        vertPipe = document.createElement('div');
        pipeTop.setAttribute('class', 'pipe_top');
        vertPipe.setAttribute('class', 'vert_pipe');
        break;
      }
    } 
    
    /* adds the block to the DOM */
    this.createBlock = function() {
      globalBlockCount++;
      return document.body.appendChild(tempBlock);
    }

    /* adds a pipe block to the DOM */
    this.createPipe = function() {
      globalBlockCount++;
      document.body.appendChild(tempBlock);
      tempBlock.appendChild(pipeTop);
      tempBlock.appendChild(vertPipe);
    }

    /* checks if there is a collision */
    this.isCollision = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      if ((this.a.offset().top >= this.b.offset().top + this.b.height()) && ((this.a.offset().left + this.a.width()) >= this.b.offset().left) && (this.a.offset().left <= (this.b.offset().left + this.b.width()))) {
        truthValue = true;
      }
      return truthValue;
    }
    
    /* vertical space */
    this.enterVSpace = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      if (((this.a.offset().left + this.a.width()) >= this.b.offset().left) && (this.a.offset().left <= (this.b.offset().left + this.b.width()))) {
        truthValue = true;
      }
      return truthValue;
    }

    /* detects edge of block */
    this.isEdge = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      if ((((this.a.offset().left + this.a.width()) < this.b.offset().left) && (this.a.offset().left > (this.b.offset().left + this.a.width()))) || (this.a.offset().left > this.b.offset().left + this.b.width() && (this.a.offset().left < (this.b.offset().left + this.b.width()) + this.a.width()))) {
        truthValue = true;
      }
      return truthValue;
    }

    /* touches outside of block */
    this.outsideTouch = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      if (((this.a.offset().left + this.a.width()) >= this.b.offset().left) && (this.a.offset().left <= (this.b.offset().left + this.b.width()))) {
        if (((this.a.offset().left + this.a.width()) >= this.b.offset().left)) {
          this.a.stop().animate({
            left: (this.b.offset().left - this.a.width() - 3)
          }, 10);
          lastInc = 0;
        }

        truthValue = true;
      }
      return truthValue;
    }

    /* assign spacial coordinates function*/
    this.assignSpacialCoord = function() {
      $('.ground').each(function(e) {
        spacialCoord[e] = {
          'from': $(this).position().left,
          'to': $(this).position().left + $(this).width()
        }
      });
    }

    /* spacial Looper */
    this.spacialLooper = function(spObj) {
      var truthTable = [];
      var ultimateTruth = true;
      for (a in spObj) {
        if ((((mario.offset().left + (mario.width() - 5)) >= (spObj[a]['from'])) && ((mario.offset().left - 5) <= spObj[a]['to']))) {
          truthTable[a] = false;
        } else {
          truthTable[a] = true;
        }
      }
      for (i = 0; i < truthTable.length; i++) {
        if (truthTable[i] == false) {
          ultimateTruth = false;
        }
      }
      return ultimateTruth;
    }

    /* detects if object is between two points */
    this.isBetween = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      if (((this.a.offset().left) > this.b.offset().left) && ((this.a.offset().left + this.a.width()) < (this.b.offset().left + this.b.width()))) {
        truthValue = true;
      }
      return truthValue;
    }

    /* detects if object is on top of another */
    this.onTop = function(m, block) {
      this.a = m;
      this.b = block;
      var truthValue;
      onTopOf = block;
      if ((this.a.offset().top - this.a.height() + 5) < this.b.offset().top) truthValue = true;
      return truthValue;
    }

    /* if collision do things */
    this.hitsMe = function(m, block) {
      var hit = false;
      if (this.isCollision(m, block)) {
        if (this.bBreakable != "noBreak") {
          this.breaksMe(block);
        } else {
          this.bumpsMe(block);
        }
        hit = true;
      }
      return hit;
    }

    /* bumps the block */
    this.bumpsMe = function(block) {
      this.shake(block);
      $('embed').remove();
      $('#sfx-bump')[0].play();
    }

    /* shakes block that have been hit */
    this.shake = function(block) {
      var toMoveUp = this.bTop + 6;
      var toMoveDown = this.bTop - 3;
      block.delay(150).animate({
        'top': toMoveDown
      }, 10, function() {
        block.animate({
          'top': toMoveUp
        }, 10)
      });
    }

    /* kills the block */
    this.breaksMe = function(block) {
      this.shake(block);
      var $thisParent = this;
      $('embed').remove();
      $('#sfx-brick-break')[0].play();
      this.spawnBricks(block);
      setTimeout(function() {
        globalBlockCount--;
        $thisParent.eraseBlockDOM(block);
      }, 200);
    }

    /* removes the block from the DOM */
    this.eraseBlockDOM = function(block) {
      block.remove();
      this.assignSpacialCoord();
    }

    /* spawn brick after break */
    this.spawnBricks = function(block) {
      var miniPosX = block.position().left;
      var miniPosY = block.position().top;
      var i = 0;
      var x, y;
      $('.mini_brick').css({
        'top': miniPosY,
        'left': miniPosX
      });
      $('.mini_brick').show();
      $('.mini_brick').each(function(e) {
        var $this = $(this)
        var minBlockInt = setInterval(function() {
          if (i <= 5) {
            x = i * Math.random(10) * -50;
            y = Math.pow(i, 4) * 4;
            $this.css({
              'left': miniPosX - x,
              'top': miniPosY + y
            });
            i += 0.1;
          }
        }, 100);
      });
    }
  }

  /* Mario Jump function */
  function mJump(direction) {
    var iInc = 0;
    if (meJumpInt) clearInterval(meJumpInt);
    var xA;
    var xY = 5;
    direction == 'right' ? xA = 5 : xA = -5;

    function killJumpProg() {
      jumpInProgress = false;
      mario.removeClass('runningRight');
      mario.removeClass('runningLeft');
    }
    
    var meJumpInt = setInterval(function() {
      iInc++;
      xpos += xA;
      ypos -= xY;
      direction == 'right' ? mario.addClass('jumpRight') : mario.addClass('jumpLeft');
      mario.css({
        'left': xpos,
        'top': ypos
      });
      if (iInc == 20) {
        xA = xA;
        xY = -(xY)
      }
      if (iInc == 40) {
        xA = xA * .5;
        xY = 0;
      }
      if (iInc == 60) {
        clearInterval(meJumpInt);
        iInc = 0;
        lastInc = 0;
        mario.removeClass('jumpRight');
        mario.removeClass('jumpLeft');
        killJumpProg.call();
      }
    }, 10);
  }

  /* scans interactions with objects in the global space */
  function globalBlockScanner() {
    var testHit2 = setInterval(function() {
      if (globalBlockCount > 0) {
        for (i = 0; i < globalBlockCount; i++) {
          if (blockOfBlocks[i].hitsMe(mario, $('.' + blockOfBlocks[i].generalType + ':eq(' + i + ')'))) {
            clearInterval(testHit2);
          } else if ((blockOfBlocks[i].enterVSpace(mario, $('.ground:eq(' + i + ')'))) && (blockOfBlocks[i].onTop(mario, $('.ground:eq(' + i + ')')))) {
            currentPlane = $('.ground:eq(' + i + ')').offset().top - mario.height();
            mario.css({
              'top': currentPlane
            });
            clearInterval(testHit2);
          } else {
            clearInterval(testHit2);
          }
        }
      }
    }, 10);
  }

  function activePipeCheck() {
    if (checkLevelInt == undefined) var checkLevelInt = setInterval(function() {
      for (i = 0; i < $('.vert_pipe_whole').length; i++) {
        if ((downKeyPressed) && (currentPlane < levelfloor) && (blockOfBlocks[i].onTop(mario, $('.vert_pipe_whole:eq(' + i + ')'))) && blockOfBlocks[0].isBetween(mario, $('.vert_pipe_whole:eq(' + i + ')'))) {
          transPipe($('.vert_pipe_whole:eq(' + i + ')'));
          clearInterval(checkLevelInt);
        }
      }
    }, 100)
  }

  function searchAndCreate() {
    $('.blockElement').each(function(i) {
      $this = $(this);
      var w = $this.width();
      var h = $this.height();
      var t = $this.offset().top;
      var l = $this.offset().left;
      var b = ($this.hasClass('breakable') ? true : false);
      var k = ($this.hasClass('brick-block') ? 'brick-block' : '');
      k = ($this.hasClass('vert_pipe_whole') ? 'vert_pipe_whole' : k = k);

      blockOfBlocks[i] = new BlockElement(w, h, t, l, b, k);
      globalBlockCount++;
    });
  }

  if (demoMode) {
    blockOfBlocks[0] = new BlockElement(40, 40, 400, 111, true, 'brick-block');
    blockOfBlocks[0].createBlock();
    blockOfBlocks[1] = new BlockElement(40, 40, 440, 111, true, 'brick-block');
    blockOfBlocks[1].createBlock();
    blockOfBlocks[2] = new BlockElement(40, 40, 28, 166, false, 'brick-block');
    blockOfBlocks[2].createBlock();
    blockOfBlocks[3] = new BlockElement(40, 40, 100, 166, true, 'brick-block');
    blockOfBlocks[3].createBlock();
    blockOfBlocks[4] = new BlockElement(40, 40, 800, 166, false, 'brick-block');
    blockOfBlocks[4].createBlock();
    blockOfBlocks[5] = new BlockElement(100, 91, 600, 266, false, 'pipe');
    blockOfBlocks[5].createPipe();
    blockOfBlocks[6] = new BlockElement(100, 91, 400, 266, false, 'pipe');
    blockOfBlocks[6].createPipe();
    blockOfBlocks[7] = new BlockElement(100, 91, 200, 266, false, 'pipe');
    blockOfBlocks[7].createPipe();
  }
  if (levelRenderer) {
    searchAndCreate();
  }
  blockOfBlocks[0].assignSpacialCoord(); /* updates spacial coordinates*/

  var mario = $('#mario');
  var xposLeft;
  var inc = 0;
  var lastInc = 0;
  var timeDirPos = new Array();
  var incMe = 0;
  var directionPosition = 'right';
  var doneMoving = true;
  var screenLoop = true;

  /* detect direction */
  function lastDirTime() {
    incMe++;
    timeDirPos[incMe] = mario.offset().left;
    return timeDirPos[incMe - 1];
  }

  /* if set, mario will warp to the other side of the screen when traveling */
  function screenLooper() {
    if (screenLoop) {
      if (mario.offset().left < -(10)) {
        mario.css('left', $('html').width() - 10)
      } else if (mario.offset().left > $('html').width() + 10) {
        mario.css('left', -20);
      }
    }
  }

  function levelJumpMe(pT) {
    if (pT.attr('id') == "bE_7") setTimeout(function() {
      window.location = "http://responsive.vermilion.com/?framework=skeleton"
    }, 500);
    if (pT.attr('id') == "bE_6") setTimeout(function() {
      window.location = "http://responsive.vermilion.com/?framework=foundation"
    }, 500);
    if (pT.attr('id') == "bE_5") setTimeout(function() {
      window.location = "http://responsive.vermilion.com/?framework=bootstrap"
    }, 500);
  }

  function transPipe(pT) {
    tpD = pT.position().top;
    $('embed').remove();
    $('#sfx-pipe')[0].play();
    mario.css('z-index', '-100');
    mario.addClass('crouching');
    mario.stop().animate({
      'top': tpD
    }, 1000, function() {
      mario.removeClass('crouching');
      if (levelJump == true) {
        mario.stop();
        mario.remove();
        levelJumpMe(pT);
      }
      mario.animate({
        'left': 500,
        'top': 20
      }, 1, function() {
        mario.animate({
          'top': 300
        }, 300, function() {
          mario.css('z-index', 201);
        });
      });

    });
  }

  function alwaysCheckfunction() {
    var ac = setInterval(function() {
      acInc++;
      if (blockOfBlocks[0].spacialLooper(spacialCoord) && jumpInProgress == false) {
        mario.css('top', 300);
      }
      if (acInc == 500) {
        clearInterval(acInc);
        acInc = 0;
      };
    }, 100)
  }

  $('body').keydown(function(event) {
    if (acInc == 0) alwaysCheckfunction();
    event.preventDefault();
    screenLooper();
    xpos = mario.offset().left;
    ypos = mario.offset().top;
    tempDirPost = lastDirTime();
    if (event.which == 39 && jumpInProgress == false) {
      doneMoving = false;
      directionPosition = 'right';
      mario.removeClass('jumpRight');
      mario.addClass('runningRight');
      mario.removeClass('runningLeft');
      mario.stop().animate({
        'left': (xpos += 10 + (inc / 9))
      }, 300 - inc, function() {
        doneMoving = true;
        mario.removeClass('jumpRight');
        mario.removeClass('jumpLeft');
  
      });
      if (inc < 200) inc += 50;
      lastInc = inc;
      jumpInProgress = false;
    } else if (event.which == 37 && jumpInProgress == false) {

      doneMoving = false;
      directionPosition = 'left';
      mario.removeClass('jumpRight');
      mario.addClass('runningLeft');
      mario.removeClass('runningRight');
      mario.stop().animate({
        'left': (xpos -= 10 + (inc / 9))
      }, 300 - inc, function() {
        doneMoving = true;
        mario.removeClass('jumpRight');
        mario.removeClass('jumpLeft');
      });
      if (inc < 200) inc += 50;
      lastInc = inc;
      jumpInProgress = false;
    }
    if (event.which == 32) {
      $('embed').remove();
      $('#sfx-jump')[0].play();
      if (lastInc > 150) { /* if the speed is great enough to run and jump */
        if (xpos >= tempDirPost && jumpInProgress == false) {
          jumpInProgress = true;
          doneMoving = false;
          globalBlockScanner();
          mJump('right');
        } else if (xpos <= tempDirPost && jumpInProgress == false) {
          jumpInProgress = true;
          doneMoving = false;
          globalBlockScanner();
          mJump('left');
        }
      } else if (directionPosition == 'right' && doneMoving == true && jumpInProgress == false) { /* jump facing right without running */
        jumpInProgress = true;
        globalBlockScanner();
        mario.addClass('jumpRight');
        mario.stop().animate({
          'top': ypos -= 100
        }, 100, function() {
          mario.stop().animate({
            'top': currentPlane
          }, 300, function() {
            mario.removeClass('jumpRight');
            mario.removeClass('jumpLeft');
            jumpInProgress = false;
          });
        });
      } else if (directionPosition == 'left' && doneMoving == true && jumpInProgress == false) { /* jump facing left without running */ 
        jumpInProgress = true;
        globalBlockScanner();
        mario.addClass('jumpLeft');
        mario.stop().animate({
          'top': ypos -= 100
        }, 100, function() {
          mario.stop().animate({
            'top': currentPlane
          }, 300, function() {
            mario.removeClass('jumpLeft');
            mario.removeClass('jumpRight');
            jumpInProgress = false;
          });
        });
      }
    }
    if (event.which == 40) {
      mario.addClass('crouching');
      downKeyPressed = true;
      activePipeCheck();
    }
  });

  $('body').keyup(function(event) {
    event.preventDefault();
    if (event.which == 39 && jumpInProgress == false && mario.offset().top == currentPlane) {
      inc = 0;
      mario.removeClass('runningRight');
      mario.removeClass('runningLeft');
      mario.removeClass('standingLeft');
      if (lastInc > 150) {
        mario.animate({
          'left': xpos += 90
        }, {
          'step': function() {
            if (mario.offset().top != currentPlane) $(this).stop();
            lastInc = 0;
          }
        }, 400, function() {
          lastInc = 0;
        });
      }
    } else if (event.which == 37 && jumpInProgress == false) {
      inc = 0;
      mario.removeClass('runningLeft');
      mario.removeClass('runningRight');
      mario.addClass('standingLeft');
      if (lastInc > 150) {
        mario.animate({
          'left': xpos -= 90
        }, {
          'step': function() {
            if (mario.offset().top != currentPlane) $(this).stop();
            lastInc = 0;
          }
        }, 400, function() {
          lastInc = 0;
        });
      }
    }
    if (event.which == 40) {
      downKeyPressed = false;
      mario.removeClass('crouching');
    }
  });
});
