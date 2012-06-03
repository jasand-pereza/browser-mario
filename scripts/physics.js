var m_gravity = 0.04;
var mx_int_speed =0;
var mx;
var mx_inc = 40;
var mx_inc_cap =150;
var m_temp_int;
var mx_friction = -140;

function m_ani(obj) {
  var obj_height = obj.height();
  if(mx_inc == 0) mx_int_speed = mx_inc_cap * m_gravity;
  if(mx_inc < mx_inc_cap) {
    mx = -(mx_inc - (350 - obj_height));
    newSpeed = Math.abs(mx_int_speed * m_gravity);
    console.log((Math.abs(mx/(mx_inc * m_gravity)))-mx_friction);
    setTimeout(function(){obj.css({'top' : (Math.abs(mx/(mx_inc * m_gravity)))-mx_friction}),newSpeed });
    mx_inc++;
    if(mx_inc < mx_inc_cap) mx_int_speed--;
  }
  if(mx_inc == mx_inc_cap) clearInterval(m_temp_int);
 
}

function m_jump(obj) {
 m_temp_int = setInterval(function(){ m_ani(obj) },mx_int_speed)
}


/* from fast to slow to very fast very quick to slight bounce */