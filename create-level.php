<!DOCTYPE>
<html>
<head>
  <title>Browser Mario - Create Level</title>
  
  <link rel="stylesheet" href="scripts/ui/jquery.ui.all.css">
  <link rel="stylesheet" type="text/css" href="styles/create-level.css">
  <link rel="stylesheet" type="text/css" href="styles/browser-mario.css">
  
  <script type="text/javascript" src="scripts/jquery-1.7.2.min.js"></script>
 	<script type="text/javascript" src="scripts/ui/jquery.ui.core.js"></script>
 	<script type="text/javascript" src="scripts/ui/jquery.ui.position.js"></script>
  <script type="text/javascript" src="scripts/ui/jquery.ui.widget.js"></script>
 	<script type="text/javascript" src="scripts/ui/jquery.ui.mouse.js"></script>
	<script type="text/javascript" src="scripts/ui/jquery.ui.draggable.js"></script>
	<script type="text/javascript" src="scripts/ui/jquery.ui.droppable.js"></script>
  <script type="text/javascript" src="scripts/ui/jquery.ui.resizable.js"></script>
  <script type="text/javascript" src="scripts/level-creation-script.js"></script>
</head>

<body>
<div id="levelmap"></div>
  <form id="create-form">
    <label>Add</label>
    <select id="create-block-menu">
      <option>bricks -breakable</option>
      <option>bricks -no break</option>
      <option>bricks -coin box</option>
      <option>pipe</option> 
    </select>
  </form>
  
  <form id="levelexport" action="render-level.php" method="post">
    <input id="leveldata" type="hidden" name="leveldata"/>
    <input type="submit"  id="level-submit" name="submitLevel" value="play level"/>
  </form>
  
  <div id="brick-pile"></div>
  <div id="pipe-stack"></div>
  <div id="trash"></div>
  <div id="ground"></div>
</div>

</body>
</html>