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
    #pipe-stack {
      position: absolute;
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
    #levelmap{
      position: absolute;
      background-color: #FFF;
      width:100%;
      height:100%;
      z-index: -100;
    }
    form {
      position: absolute;
    }
    </style>
  <!--  ====================== styles ========================= -->
  <link rel="stylesheet" href="themes/base/jquery.ui.all.css">
<link rel="stylesheet" type="text/css" href="styles/browser-mario.css">
    <script type="text/javascript" src="scripts/jquery-1.7.2.min.js"></script>
 	<script src="scripts/ui/jquery.ui.core.js"></script>
 	<script src="scripts/ui/jquery.ui.position.js"></script>
 <script src="scripts/ui/jquery.ui.widget.js"></script>
 	<script src="scripts/ui/jquery.ui.mouse.js"></script>
	<script src="scripts/ui/jquery.ui.draggable.js"></script>
	<script src="scripts/ui/jquery.ui.droppable.js"></script>
  <script src="scripts/ui/jquery.ui.resizable.js"></script>
  <script src="scripts/level-creation-script.js"></script>
 
</head>
<body>
   <div id="levelmap"></div>
    <form>
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
      <input type="submit"  id="level-submit" name="submitLevel"/>
    </form>
    <div id="brick-pile"></div>
    <div id="pipe-stack"></div>
    <div id="trash"></div>
    <div id="ground">
</div>
</body>
</html>
