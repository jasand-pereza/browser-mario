

$(function() {

  mario = $('#mario');
  $('#underworld-music')[0].play();

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

  (function countDown(time) {
    var time_left = (time) ? time : 30000;
    setTimeout(function(){
    $('#underworld-music').remove();
    $('#underworld-music-countdown')[0].play();
    setTimeout(function(){
      $('#underworld-music-countdown').remove();
      $('#mario-end')[0].play();
      mario.addClass('crouching').stop().animate({ 'top' : 100, 'height': 0 }, 200);
      setTimeout(function(){ levelJumpMe(); }, 2500)
    }, 20000)
    },time_left)
  })();

  
  function blockEffects(block, key) {
    if (block.bBreakable != "noBreak") {
      block.breaksMe(block, key);
    } else if(block.kind == "coin-block") {
      block.bumpsMe(block);
      block.spawnCoin(block);
    } else {
      block.bumpsMe(block);
    }
  }
  
  /* scans interactions with objects in the global space */
  function globalBlockScanner() {
    var testHit2 = setInterval(function() {
      if (globalBlockCount > 0) {        
        for (i = 0; i < globalBlockCount; i++) {          
          if (blockOfBlocks[i].hitsMe(mario, $('.' + blockOfBlocks[i].generalType + ':eq(' + i + ')'))) {
            blockEffects(blockOfBlocks[i], i);
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

  function levelJumpMe() {
    setTimeout(function() {
      if(history.state == null) history.pushState('prev_visit');
      window.location = (Boolean(infinite_loop)) ? document.URL : warp_url;
    }, 100);
  }

  var fall_pipe_inc = 0;
  function transPipe(pT) {
    var tpD = pT.position().top;
    var fall_point = (is_warp_url) ? 216 : 300;
    $('embed').remove();
    $('#sfx-pipe')[0].play();
    mario.css('z-index', '-100');
    mario.addClass('crouching');
    mario.stop().animate({
      'top': tpD
    }, 1000, function() {
      mario.removeClass('crouching');
      if(fall_pipe_inc > 0) { 
        levelJumpMe(); return;
      } else {
        fall_pipe_inc++; 
      }
      
      mario.animate({
        'left': 500,
        'top': history.state == "prev_visit" ? 300 : 20
      }, 1, function() {
        mario.animate({
          'top': fall_point
        }, 300, function() {
          mario.css('z-index', 201);
        });
      });

    });
  }
  
  (function warpUrl() {
    if(!is_warp_url) return false;
    
    if(history.state == 'prev_visit') {
      mario.css({ 'left' : 500 });
      globalBlockScanner();
      transPipe(mario);
      return;
    }
    mario.css({ 'top' : -50, 'left' : 428 });
    globalBlockScanner();
    transPipe(mario);
  })();
  
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
        mario.removeClass('runningRight');
        mario.removeClass('standingLeft');
        mario.addClass('standingRight');
        
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
        mario.removeClass('standingRight')
        mario.removeClass('jumpRight');
        mario.removeClass('jumpLeft');
        mario.addClass('standingLeft');
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
