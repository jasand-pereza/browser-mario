
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
  (b) ? this.bBreakable = 'breakable' : this.bBreakable = 'noBreak';
  this.b_type = (typeof kind == 'undefined') ? ' ' : ' ' + kind + ' ';
  this.thisId = 'bE_' + globalBlockCount;
  tempBlock.setAttribute('id', 'bE_' + globalBlockCount);

  if (demoMode) {
    switch (kind) {
    case 'brick-block':
      tempBlock.setAttribute('class', this.generalType + this.b_type + this.bBreakable + ' ground');
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
      break;
    case 'coin-block':
      tempBlock.setAttribute('class', this.generalType + this.b_type + this.bBreakable + ' ground');
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
      break;
    case 'pipe':
      tempBlock.setAttribute('class', this.generalType + ' vert_pipe_whole' + ' ground');
      style_transform = (typeof otherArgs != "undefined") ? '-webkit-transform: rotate(' + otherArgs.angle + 'deg)' : '';
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;' + style_transform);
       
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
        'to': $(this).position().left + $(this).width(),
        'vert_top' : $(this).position().top,
        'vert_bottom' : $(this).position().top + $(this).height()
      }
    });
  }

  /* spacial Looper */
  this.spacialLooper = function(spObj) {
    var truthTable = [];
    var ultimateTruth = true;
    for (a in spObj) {
      if ((((mario.offset().left + (mario.width() - 5)) >= (spObj[a]['from'])) && ((mario.offset().left - 5) <= spObj[a]['to'])) && mario.offset().top < spObj[a]['vert_bottom']) {
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
    if (this.isCollision(m, block) &&  block[0].getAttribute('class').search('vert_pipe_whole') == -1) {
      if (this.bBreakable != "noBreak") {
        this.breaksMe(block);
      } else if(kind == "coin-block") {
        this.bumpsMe(block);
        this.spawnCoin(block);
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
  
  this.spawnCoin = function(block) {
    $('body').append('<div class="coin"></div>');
    $('.coin').css({
      'left' : block.position().left,
      'top'  : block.position().top
    });
    $('#coin-fx')[0].play();
    $('.coin').animate({
      'top' : $('.coin').position().top - 100,
      'opacity' : 0.4
    }, 500, function() { $('.coin').remove(); })
    
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
