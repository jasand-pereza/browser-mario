var blockOfBlocks=[];
var bobinc =0;
var currentBrick;




$(function(){
  
  var brickPileX = $('#brick-pile').offset().left;
  var brickPileY = $('#brick-pile').offset().top;
  
  $('#create-block-menu').change(function() {
    var selected = $(this).find('option:selected').val();
    getBlock(selected);
  });
  
  $('.blockElement').live('mousedown', function(event){
     if(currentBrick.offset().left > ($('#brick-pile').offset().left + $('#brick-pile').width())) {
      getBlock('bricks -breakable');  
  }
  var $thisBlock = $(this);
     
        if(event.altKey) {
            
             $thisBlock.clone().attr({'id':'bE_' + bobinc}).appendTo('#levelmap').addClass('clone');
             clone = $('.clone');
             blockOfBlocks[bobinc] = new BlockElement(clone.width(),clone.height(),clone.offset().left + 100,clone.offset().top + 100,true,'brick-block');
             console.info(blockOfBlocks[bobinc]);
        }
 
  });
  
  function process_completed(){
    $('*').remove('.ui-resizable-handle, .ui-resizable-s');
    $('*').removeClass('ui-resizable');
    $('*').removeClass('ui-draggable');
    
  }
  
  $('#level-submit').click(function(e){
    e.preventDefault();
   
   process_completed();
   
   var levelhtml = $('#levelmap').html();
    
    
    levelhtml =String(levelhtml);
    console.info(levelhtml);

   $('#leveldata').val(levelhtml);
   $('#levelexport').submit();
    
  });
  

  
  $('#trash').droppable({
    drop: function(event, ui) {
      ui.draggable.remove();
    }
  });
  function initiateFirstofEach() {
     blockOfBlocks[bobinc] = new BlockElement(40,40,brickPileX,brickPileY,true,'brick-block');
     blockOfBlocks[bobinc].createBlock();
     currentBrick = blockOfBlocks[bobinc-1].getId();
     currentBrick.resizable();
     currentBrick.draggable();
  }
 
  
  function getBlock(selected) {
      var $this = null;
    switch(selected) {
      case 'bricks -breakable':
        blockOfBlocks[bobinc] = new BlockElement(40,40,brickPileX,brickPileY,true,'brick-block');
        blockOfBlocks[bobinc].createBlock();
        $this = blockOfBlocks[bobinc-1].getId();
        $this.draggable();
        $this.resizable();
      break;
      
      case 'pipe' :
        blockOfBlocks[bobinc] = new BlockElement(100,91,0,0,false,'pipe');
        blockOfBlocks[bobinc].createPipe();
        $this = blockOfBlocks[bobinc-1].getId();
        $this.find('.vert_pipe').resizable({handles: "s"});
        $this.draggable();
        
      break;
    }
    var currentBrick = $this;
  }
   initiateFirstofEach();
});



function BlockElement(w, h, l, t, b, kind, otherArgs) {
         var tempBlock = document.createElement('div');
         $this = this;
         $thisObject = null;
         var pipeTop, vertPipe;
         this.bWidth = w;
         this.bHeight = h;
         this.bLeft = l;
         this.bTop = t;
         this.generalType = 'blockElement';
         if (otherArgs) this.otherOptions = otherArgs;
         b ? this.bBreakable = 'breakable' : this.bBreakable = 'noBreak';
         this.b_type = (typeof kind == 'undefined') ? ' ' : ' ' + kind + ' ';
         this.thisId = '#bE_' + bobinc;
         tempBlock.setAttribute('id', 'bE_' + bobinc);
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
         
         /* adds the block to the DOM */
         this.createBlock = function () {
            document.getElementById('levelmap').appendChild(tempBlock);
            $thisObject = $($this.thisId);
            bobinc++;
         }
         
         /* adds a pipe block to the DOM */
         this.createPipe = function () {
            document.getElementById('levelmap').appendChild(tempBlock);
            tempBlock.appendChild(pipeTop);
            tempBlock.appendChild(vertPipe);
            $thisObject = $($this.thisId);
            bobinc++;
         }
         this.getId = function() {
           return $thisObject;
        
         }
         
}