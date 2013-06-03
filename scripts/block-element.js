
/*creates a block element
Arguments: width, height, left, top, breakable, kind, other arguments */
function BlockElement(w, h, l, t, b, kind, otherArgs) {
  var tempBlock = document.createElement('div');
  var pipeTop, vertPipe;
  this.bWidth = w;
  this.bHeight = h;
  this.bLeft = l;
  this.bTop = t;
  this.kind = kind;
  this.generalType = 'blockElement';
  if (otherArgs) this.otherOptions = otherArgs;
  (b) ? this.bBreakable = 'breakable' : this.bBreakable = 'noBreak';
  this.b_type = (typeof kind == 'undefined') ? ' ' : ' ' + kind + ' ';
  this.thisId = 'bE_' + globalBlockCount;
  tempBlock.setAttribute('id', 'bE_' + globalBlockCount);
  
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
  
  switch (kind) {
    case 'brick-block':
      tempBlock.setAttribute('class', this.generalType + this.b_type + this.bBreakable + ' ground');
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
      this.createBlock();
    break;
    case 'coin-block':
      tempBlock.setAttribute('class', this.generalType + this.b_type + this.bBreakable + ' ground');
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
      this.createBlock();
    break;
    case 'pipe':
      tempBlock.setAttribute('class', this.generalType + ' vert_pipe_whole' + ' ground');
      style_transform = (typeof otherArgs != "undefined") ? '-webkit-transform: rotate(' + otherArgs.angle + 'deg)' : '';
      tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;' + style_transform);
      pipeTop = document.createElement('div');
      vertPipe = document.createElement('div');
      pipeTop.setAttribute('class', 'pipe_top');
      vertPipe.setAttribute('class', 'vert_pipe');
      this.createPipe();
    break;
  }

  this.get_spacial_info = function($obj) {
    if(!$obj instanceof jQuery) $obj = $('#' + $obj.thisId);
    return { 
     't' : $obj.offset().top,
     'l' : $obj.offset().left, 
     'w' : $obj.width(), 
     'h' : $obj.height() 
    };
  }

  /* checks if there is a collision */
  this.isCollision = function(m, block) {
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    if ((a.t >= b.t + b.h) && ((a.l + a.w) >= b.l) && (a.l <= (b.l + b.w))) {
      return true;
    }
  }
  
  /* vertical space */
  this.enterVSpace = function(m, block) {
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    if (((a.l + a.w) >= b.l) && (a.l <= (b.l + b.w))) {
      return true;
    }
  }

  /* detects edge of block */
  this.isEdge = function(m, block) {
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    if ((((a.l + a.w) < b.l) && (a.l > (b.l + a.w))) || (a.l > b.l + b.w && (a.l < (b.l + b.w) + a.w))) {
      return true;
    }
  }

  /* touches outside of block */
  this.outsideTouch = function(m, block) {
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    if (((a.l + a.w) >= b.l) && (a.l <= (b.l + b.w))) {
      if (((a.l + a.w) >= b.l)) {
        this.a.stop().animate({
          left: (b.l - a.w - 3)
        }, 10);
        lastInc = 0;
      }
      return true;
    }
  }

  /* assign spacial coordinates function*/
  this.assignSpacialCoord = function() {
    var parent = this;
    $('.ground').each(function(e) {
      var $o = parent.get_spacial_info($(this));
      spacialCoord[e] = {
        'from': $o.l,
        'to': $o.l + $o.w,
        'vert_top' : $o.t,
        'vert_bottom' : $o.t + $o.h
      }
    });
  }

  /* spacial Looper */
  this.spacialLooper = function(spObj) {
    var truthTable = [];
    var ultimateTruth = true;
    m = this.get_spacial_info(mario);
    for (a in spObj) {
      if ((((m.l + (m.w - 5)) >= (spObj[a]['from'])) && ((m.l - 5) <= spObj[a]['to'])) && m.t < spObj[a]['vert_bottom']) {
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
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    if (((a.l) > b.l) && ((a.l + a.w) < (b.l + b.w))) {
      return true;
    }
  }

  /* detects if object is on top of another */
  this.onTop = function(m, block) {
    var a = this.get_spacial_info(m);
    var b = this.get_spacial_info(block);
    onTopOf = block;
    if ((a.t - a.h + 5) < b.t) return true;
  }

  /* if collision do things */
  this.hitsMe = function(m, block) {
    if (this.isCollision(m, block) &&  block[0].getAttribute('class').search('vert_pipe_whole') == -1) {
      return true;
    }
    return false;
  }

  /* bumps the block */
  this.bumpsMe = function(block) {
    this.shake(block);
    $('embed').remove();
    $('#sfx-bump')[0].pause();
    $('#sfx-bump')[0].currentTime = 0;
    $('#sfx-bump')[0].play();
  }

  /* shakes block that have been hit */
  this.shake = function(block) {
    var toMoveUp = this.bTop + 6;
    var toMoveDown = this.bTop - 3;
    $block = $('#' + block.thisId);
    
    $block 
    .delay(150)
    .animate({
       'top': toMoveDown
    }, 10, 
    function() {
     $block.animate({
        'top': toMoveUp
      }, 10)
    });
  }

  /* kills the block */
  this.breaksMe = function(block, key) {
    this.shake(block);
    var $thisParent = $('#' + block.thisId);
    $('#sfx-brick-break')[0].pause();
    $('#sfx-brick-break')[0].currentTime = 0;
    $('#sfx-brick-break')[0].play();
    this.spawnBricks($thisParent, key);
  }

  /* removes the block from the DOM */
  this.eraseBlockDOM = function(block) {
    $('#' + block.thisId).remove();
    this.assignSpacialCoord();
  }
  
  this.spawnCoin = function(block) {
    $block = $('#' + block.thisId);
    $('body').append('<div class="coin"></div>');
    $('.coin').css({
      'left' : $block.position().left,
      'top'  : $block.position().top
    });
    $('#coin-fx')[0].pause();
    $('#coin-fx')[0].currentTime = 0;
    $('#coin-fx')[0].play();
    $('.coin').animate({
      'top' : $('.coin').position().top - 100,
      'opacity' : 0.4
    }, 500, function() { $('.coin').remove(); })
    
  }
  
  /* spawn brick after break */
  this.spawnBricks = function($block, key) {
    var miniPosX = $block.position().left;
    var miniPosY = $block.position().top;
  
    var i = 0;
    var x, y;
    $('.mini_brick').css({
      'top': miniPosY,
      'left': miniPosX
    });
    $('.mini_brick').show();
    $block.remove();
      blockOfBlocks.splice(key, 1);
          globalBlockCount--;
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
