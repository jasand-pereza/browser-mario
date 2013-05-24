<!DOCTYPE html>
<html>
<head>
  <title>Browser Mario</title>
  <script type="text/javascript">
    var demoMode=false;
    var levelJump = false;
    var levelRenderer = true;
  </script>
  <script type="text/javascript" src="scripts/jquery-1.7.2.min.js"></script>
  <script type="text/javascript" src="scripts/browser-mario.js"></script>
  <link rel="stylesheet" type="text/css" href="styles/browser-mario.css">
</head>

<audio id="sfx-jump">
  <source src="sfx/jump.wav" type="audio/wav">
</audio>
<audio id="sfx-bump">
  <source src="sfx/bump.wav" type="audio/wav">
</audio>
<audio id="sfx-brick-break">
  <source src="sfx/brick-break.wav" type="audio/wav">
</audio>
<audio id="sfx-pipe">
  <source src="sfx/pipe.wav" type="audio/wav">
</audio>
<body>
<legend id="controls">
  <ul>
    <li>Walk/Run left and right: &harr; </li>
    <li>Crouch: &darr;  </li>
    <li>Jump: spacebar </li>
  </ul>
</legend>

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
$levelData = removeSlashes($_POST['leveldata']);
?>

<?php echo $levelData; ?>

<div id="mario"></div>
<div id="ground"></div>

</body>
</html>