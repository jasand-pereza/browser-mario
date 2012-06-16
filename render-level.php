<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd"
    >
<html lang="en">
<head>
    <title>Bounce HTML</title>
    <style>
    .blockElement{
        width:200px;
        height:100px;
        position:absolute;
        display:block;
        cursor:pointer;
        }
    #brick-pile {
      position: absolute;
      width:40px;
      height:40px;
      z-index: 200;
      background-image: url('graphics/brickbrown.png');
      background-repeat: repeat;
    }
    #trash {
      width:50px;
      height:50px;
      background-image: url('graphics/trash.png');
      background-repeat: no-repeat;
      position: absolute;
      top:20px;
      right:20px;
    }
    </style>
  <!--  ====================== styles ========================= -->

<link rel="stylesheet" type="text/css" href="styles/browser-mario.css">

<!--
====================== scripts ========================= -->
<script type="text/javascript">
  var demoMode=false;
  var levelJump = false;
  var levelRenderer = true;
</script>
<script type="text/javascript" src="scripts/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="scripts/browser-mario.js"></script>
 

 
</head>
<body>
<div id="mario">
</div>
<div class="mini_brick">
</div>
<div class="mini_brick">
</div>
<div class="mini_brick">
</div>
<div class="mini_brick">
</div>
<div id="ground">
</div>
<?php
function removeSlashes($a) {
  $pat = array();
  $pat[0] = '/\=\\\/i';
  $pat[1] ='/\\\/i';
  $replacement = array();
  $replacement[0] ="=";
  $replacement[1] = "";
  return preg_replace($pat,$replacement,$a);
}
$levelData= removeSlashes($_POST['leveldata']);
?>

 <?php echo $levelData; ?>

</body>
</html>
