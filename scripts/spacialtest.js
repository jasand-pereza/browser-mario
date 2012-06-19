
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
  
  
  function global_scanner() {
    
    for(i=0; i < lA.length; i++) {
      
      
      isTop(lA[i][h], );
      isOutsideTouch();
      isBetween();
    }
  }
  
  function master_animator() {
    
    
    
  }