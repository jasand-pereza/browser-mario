 var globalBlockCount = 0;
 var blockOfBlocks = [];
 var jumpInProgress = false;
 currentPlane = 300;
 var levelfloor = 300;
 
 $(function () {
 	/* creates a block element*/
 	/* Arguments: width, height, left, top, breakable */
 	function BlockElement(w, h, l, t, b) {
 		var tempBlock = document.createElement('div');
 		this.bWidth = w;
 		this.bHeight = h;
 		this.bLeft = l;
 		this.bTop = t;
 		b ? this.bBreakable = 'breakable' : this.bBreakable = 'noBreak';
 		this.thisId = 'bE_' + globalBlockCount;
 		tempBlock.setAttribute('id', 'bE_' + globalBlockCount);
 		tempBlock.setAttribute('class', 'blockElement ' + this.bBreakable);
 		tempBlock.setAttribute('style', 'top:' + this.bTop + 'px; left:' + this.bLeft + 'px; width:' + this.bWidth + 'px; height:' + this.bHeight + 'px;');
 		
    
    /* adds the block to the DOM */
 		this.createBlock = function () {
 			globalBlockCount++;
 			return document.body.appendChild(tempBlock);
 		}
 		
    
    /* checks if there is a collision */
 		this.isCollision = function (m, block) {
 			this.a = m;
 			this.b = block;
 			var truthValue;
 			if ((this.a.offset().top >= this.b.offset().top + this.b.height()) && ((this.a.offset().left + this.a.width()) >= this.b.offset().left) && (this.a.offset().left <= (this.b.offset().left + this.b.width()))) {
 				truthValue = true;
 			}
 			return truthValue;
 		}
 		
    
    /* detects edge of block */
 		this.isEdge = function (m, block) {
 			this.a = m;
 			this.b = block;
 			var truthValue;
 			if (((this.a.offset().left + this.a.width()) < this.b.offset().left) || ((this.a.offset().left) > (this.b.offset().left + this.b.width()))) {
 				truthValue = true;
 			}
 			return truthValue;
 		}
 		
    
    /* detects if object is between two points */
 		this.isBetween = function (m, block) {
 			this.a = m;
 			this.b = block;
 			var truthValue;
 			if (((this.a.offset().left) > this.b.offset().left) && ((this.a.offset().left + this.a.width()) < (this.b.offset().left + this.b.width()))) {
 				truthValue = true;
 			}
 			return truthValue;
 		}
 		
    
    /* detects if object is on top of another */
 		this.onTop = function (m, block) {
 			this.a = m;
 			this.b = block;
 			var truthValue;
 			if ((this.a.offset().top + this.a.height()) >= this.b.offset().top) truthValue = true;
 			return truthValue;
 		}
 		
    
    /* if collision do things */
 		this.hitsMe = function (m, block) {
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
 		this.bumpsMe = function (block) {
 			this.shake(block);
 			$('embed').remove();
 			$('body').append('<embed src="sfx/bump.wav" autostart="true" hidden="true" loop="false">');
 		}
 		
    
    /* shakes block that have been hit */
 		this.shake = function (block) {
 			var toMoveUp = this.bTop + 6;
 			var toMoveDown = this.bTop - 3;
 			block.delay(150).animate({
 				'top': toMoveDown
 			}, 10, function () {
 				block.animate({
 					'top': toMoveUp
 				}, 10)
 			});
 		}
 		
    
    /* kills the block */
 		this.breaksMe = function (block) {
 			this.shake(block);
 			var $thisParent = this;
 			$('embed').remove();
 			$('body').append('<embed src="sfx/brickbreak.wav" autostart="true" hidden="true" loop="false">');
 			this.spawnBricks(block);
 			setTimeout(function () {
 				globalBlockCount--;
 				$thisParent.eraseBlockDOM(block);
 			}, 200);
 		}
 		
    
    /* removes the block from the DOM */
 		this.eraseBlockDOM = function (block) {
 			block.remove();
 		}
 		
    
    /* spawn brick after break */
 		this.spawnBricks = function (block) {
 			var miniPosX = block.position().left;
 			var miniPosY = block.position().top;
 			var i = 0;
 			var x, y;
 			$('.mini_brick').css({
 				'top': miniPosY,
 				'left': miniPosX
 			});
 			$('.mini_brick').show();
 			$('.mini_brick').each(function (e) {
 				var $this = $(this)
 				var minBlockInt = setInterval(function () {
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
 			MARIO.removeClass('runningRight');
 			MARIO.removeClass('runningLeft');
 		}
 		var meJumpInt = setInterval(function () {
 			iInc++;
 			xpos += xA;
 			ypos -= xY;
 			//console.log(iInc);
 			direction == 'right' ? MARIO.addClass('jumpRight') : MARIO.addClass('jumpLeft');
 			MARIO.css({
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
 				MARIO.removeClass('jumpRight');
 				MARIO.removeClass('jumpLeft');
 				killJumpProg.call();
 			}
 		}, 10);
 	}
 
 
 	/* scans interactions with objects in the global space */
 	function globalBlockScanner() {
 		var testHit2 = setInterval(function () {
 			if (globalBlockCount > 0) {
 				for (i = 0; i < globalBlockCount; i++) {
 					console.log(i);
 					if (blockOfBlocks[i].hitsMe(MARIO, $('.blockElement:eq(' + i + ')'))) {
 						clearInterval(testHit2);
 					} else {
 						clearInterval(testHit2);
 					}
 					if (blockOfBlocks[i].onTop(MARIO, $('.vert_pipe_whole')) && (blockOfBlocks[i].isCollision(MARIO, $('.vert_pipe_whole')))) {
 						currentPlane = $('.vert_pipe_whole').offset().top - MARIO.height();
 						MARIO.css({
 							'top': currentPlane
 						});
 						console.info(currentPlane);
 						clearInterval(testHit2);
 					}
 				}
 			}
 		}, 10);
 	}

 	
  function levelSwitch() {
 		if (checkLevelInt == undefined) var checkLevelInt = setInterval(function () {
 			if (currentPlane < levelfloor && blockOfBlocks[0].isEdge(MARIO, $('.vert_pipe_whole'))) {
 				console.info('is edge sat');
 				MARIO.stop().animate({
 					'top': levelfloor
 				}, 10, function () {
 					currentPlane = 300;
 				});
 				clearInterval(this.checkLevelInt);
 			}
 		}, 100)
 	}

 	
  function activePipeCheck() {
 		if (checkLevelInt == undefined) var checkLevelInt = setInterval(function () {
 			if (currentPlane < levelfloor && blockOfBlocks[0].isBetween(MARIO, $('.vert_pipe_whole'))) {
 				transPipe($('.vert_pipe_whole'));
 				clearInterval(checkLevelInt);
 			}
 		}, 100)
 	}
 	
  
  blockOfBlocks[0] = new BlockElement(40, 40, 300, 160, true);
 	blockOfBlocks[0].createBlock();
 	blockOfBlocks[1] = new BlockElement(40, 40, 400, 160, true);
 	blockOfBlocks[1].createBlock();
 	blockOfBlocks[2] = new BlockElement(40, 40, 500, 160, false);
 	blockOfBlocks[2].createBlock();
 	blockOfBlocks[3] = new BlockElement(40, 40, 600, 160, true);
 	blockOfBlocks[3].createBlock();
 	blockOfBlocks[4] = new BlockElement(80, 78, 700, 130, false);
 	blockOfBlocks[4].createBlock();
 	
  var MARIO = $('#mario');
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
 		timeDirPos[incMe] = MARIO.offset().left;
 		return timeDirPos[incMe - 1];
 	}
 	
  
  /* if set, mario will warp to the other side of the screen when traveling */
 	function screenLooper() {
 		if (screenLoop) {
 			if (MARIO.offset().left < -(10)) {
 				MARIO.css('left', $('html').width() - 10)
 			} else if (MARIO.offset().left > $('html').width() + 10) {
 				MARIO.css('left', -20);
 			}
 		}
 	}

 	
  function transPipe(pT) {
 		tpD = pT.position().top;
 		$('embed').remove();
 		$('body').append('<embed src="sfx/smb_pipe.wav" autostart="true" hidden="true" loop="false">');
 		MARIO.css('z-index', '-100');
 		MARIO.addClass('crouching');
 		MARIO.stop().animate({
 			'top': tpD
 		}, 1000, function () {
 			MARIO.removeClass('crouching');
 			MARIO.css('z-index', 100);
 			MARIO.animate({
 				'left': 500,
 				'top': 20
 			}, 1, function () {
 				MARIO.animate({
 					'top': 300
 				}, 300);
 			});
 		});
 	}
 
 
 	$('body').keydown(function (event) {
 		event.preventDefault();
 		screenLooper();
 		levelSwitch();
 		xpos = MARIO.offset().left;
 		// console.info('marios x pos = '+xpos+' Marios last x pos = '+lastDirTime());
 		ypos = MARIO.offset().top;
 		tempDirPost = lastDirTime();
 		if (event.which == 39 && jumpInProgress == false) {
 			doneMoving = false;
 			directionPosition = 'right';
 			MARIO.removeClass('jumpRight');
 			MARIO.addClass('runningRight');
 			MARIO.removeClass('runningLeft');
 			MARIO.stop().animate({
 				'left': (xpos += 10 + (inc / 9))
 			}, 300 - inc, function () {
 				doneMoving = true;
 				MARIO.removeClass('jumpRight');
 				MARIO.removeClass('jumpLeft');
 			});
 			if (inc < 200) inc += 50;
 			lastInc = inc;
 			jumpInProgress = false;
 		} else if (event.which == 37 && jumpInProgress == false) {
 			doneMoving = false;
 			directionPosition = 'left';
 			MARIO.removeClass('jumpRight');
 			MARIO.addClass('runningLeft');
 			MARIO.removeClass('runningRight');
 			MARIO.stop().animate({
 				'left': (xpos -= 10 + (inc / 9))
 			}, 300 - inc, function () {
 				doneMoving = true;
 				MARIO.removeClass('jumpRight');
 				MARIO.removeClass('jumpLeft');
 			});
 			if (inc < 200) inc += 50;
 			lastInc = inc;
 			jumpInProgress = false;
 		}
 		if (event.which == 32) {
 			$('embed').remove();
 			$('body').append('<embed src="sfx/smb_jump-super.wav" autostart="true" hidden="true" loop="false">');
 			if (lastInc > 150) /* if the speed is great enough to run and jump */
 			{
 				//console.info('150 yes');
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
 			} else if (directionPosition == 'right' && doneMoving == true && jumpInProgress == false) /* jump facing right without running */
 			{
 				jumpInProgress = true;
 				globalBlockScanner();
 				console.info('trying to jump in place');
 				MARIO.addClass('jumpRight');
 				MARIO.animate({
 					'top': ypos -= 100
 				}, 100, function () {
 					MARIO.stop().animate({
 						'top': currentPlane
 					}, 300, function () {
 						MARIO.removeClass('jumpRight');
 						MARIO.removeClass('jumpLeft');
 						jumpInProgress = false;
 					});
 				});
 			} else if (directionPosition == 'left' && doneMoving == true && jumpInProgress == false) /* jump facing left without running */
 			{
 				jumpInProgress = true;
 				globalBlockScanner();
 				MARIO.addClass('jumpLeft');
 				MARIO.stop().animate({
 					'top': ypos -= 100
 				}, 100, function () {
 					MARIO.stop().animate({
 						'top': currentPlane
 					}, 300, function () {
 						console.info('removing jumpleft class');
 						MARIO.removeClass('jumpLeft');
 						MARIO.removeClass('jumpRight');
 						jumpInProgress = false;
 					});
 				});
 			}
 		}
 		if (event.which == 40) {
 			MARIO.addClass('crouching');
 			activePipeCheck();
 		}
 	});
 	
  
  $('body').keyup(function (event) {
 		event.preventDefault();
 		//console.log(MARIO.offset().top);
 		if (event.which == 39 && jumpInProgress == false && MARIO.offset().top == currentPlane) {
 			inc = 0;
 			MARIO.removeClass('runningRight');
 			MARIO.removeClass('runningLeft');
 			MARIO.removeClass('standingLeft');
 			if (lastInc > 150) {
 				MARIO.animate({
 					'left': xpos += 90
 				}, {
 					'step': function () {
 						if (MARIO.offset().top != currentPlane) $(this).stop();
 						lastInc = 0;
 					}
 				}, 400, function () {
 					lastInc = 0;
 				});
 			}
 		} else if (event.which == 37 && jumpInProgress == false) {
 			inc = 0;
 			MARIO.removeClass('runningLeft');
 			MARIO.removeClass('runningRight');
 			MARIO.addClass('standingLeft');
 			if (lastInc > 150) {
 				MARIO.animate({
 					'left': xpos -= 90
 				}, {
 					'step': function () {
 						if (MARIO.offset().top != currentPlane) $(this).stop();
 						lastInc = 0;
 					}
 				}, 400, function () {
 					lastInc = 0;
 				});
 			}
 		}
 		if (event.which == 40) {
 			MARIO.removeClass('crouching');
 		}
 	});
 });