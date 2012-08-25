
var lA = new Array()
var lAlength = lA.length;



function get_level_area() {
	
	$('div').each(function(i){
    
    $this = $(this);
    w = $this.width();
    h = $this.height();
    l = $this.offset().left;
    r = $this.offset().left + w;
    t = $this.offset().top;
    b = $this.offset().top + h;
    
		lA[i] = new Array();
    lA[i]['h'] = new Array();
    lA[i]['v'] = new Array();
    
    lA[i]['h'][0] = l;
    lA[i]['h'][1] = r;
    
    lA[i]['v'][0] = t;
    lA[i]['v'][1] = b;
  
    
	});
}
  get_level_area();
  console.info(lA)
  
  
  
  /*
  
  function global_scanner() {
    
    for(i=0; i < lA.length; i++) {
      
      
   
    }
  }
  
  
  */



/*
animation['x']=new Array();
animation['y']=new Array();
animation['d']=new Array();
animation['d'][0]=start;
animation['x'][0]=0;
*/
$(function(){
var MARIO = $('#mario');
$.fn.maxSpeed = 5;

$.fn.getMaxSpeed = function() {
  return this.maxSpeed;
}
MARIO.getMaxSpeed = function() {
  return this.maxSpeed;
}

$.fn.growMe = function() {
 return $(this).css({'top': 400});
}

jQuery.fx.interval = 10;
var gkeyinc=0;

function c(i) {
  console.info(i);
}

var animation = new Array();
xFrames = 30;

function dirChange(num, dir) {
  dir = ((dir == 'r') ? num : -(num));
  return dir;
}



function walk(dir, keyed) {
  
  var x, y, cp, d, i, n;
  n = MARIO.getMaxSpeed();
  
  if(keyed >= n) {
    x = MARIO.offset().left + (dirChange(n, dir));
    y = MARIO.offset().top;
    cp = MARIO.offset().left;
    d = 0;
    i = 100;
  }
  else if(keyed < n && keyed > 0) {
    x = MARIO.offset().left + (dirChange(keyed, dir));
    y = MARIO.offset().top;
    cp = MARIO.offset().left;
    d = 0;
    i = 100;
  }
  master_animator(MARIO, Array(x, y, cp, d, i));
  
}


function incObject(id) {
  this.incMe = 0;
  this.incIt = function(){
    this.incMe++;
  }
  this.reset = function() {
    this.incMe=0;
  }
  this.getInc = function () {
    return this.incMe;
  }
}

aniIncObj = new incObject('aniIncObj');


$(document).keydown(function(e){
  var incIt=0;
  if(e.which==39) {
    gkeyinc++;
    aniIncObj.incIt();
    walk('r', (aniIncObj.getInc()));
  }
  if(e.which==37) {
    walk('l', aniIncObj.getInc());
    gkeyinc++;
  }
});

var aniRunning =false;
var clearIt = false;

function master_animator(obj,aniParams) {
 
    this.tempX        =     aniParams[0];
    this.tempY        =     aniParams[1];
    this.currentPos   =     aniParams[2]
    this.tempI        =     aniParams[4];
    this.cp           =     this.currentPos;
    this.ib           =     0;
    this.inc2=0;
    $this = this;
    c(aniParams);
    if(gkeyinc > 0 && aniRunning == false) {
        this.aint = setInterval(function(){
          if(cp < tempI) {
            aniRunning = true;
            obj.css({
              'left' : this.tempX++,
              'top'  : this.tempY
            });
            ib+=10;
            c(this.ib); 
          } else { clearInterval(aint); this.tempI = 0; this.ib = 0; }
        },100);
    }
}
   
    
});
/*
var start = new Date().getTime();

function startRound() {
  master_animator($('#mario'));
 start = new Date().getTime();
}
*/

 // var mouseInc=0;
  
  

  
  /*
  $(do`ment).bind('mousemove',function(e){
           var endTime = new Date();
           animation['x'][mouseInc]=e.pageX
           animation['y'][mouseInc]=e.pageY
           animation['d'][mouseInc+1] = (endTime.getTime() - start);
           if(animation['d'][mouseInc+1] > 4000) startRound();
           mouseInc++;
});
  */

    
