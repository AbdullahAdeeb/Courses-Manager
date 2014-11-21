<?php
$timeTable=$_GET['timeTable'];
?>

<html>
    <head>
    </head>
    <body>
        <h1 id="whateverID"></h1>
        
        <script src="functions2.js"></script>
        <script>
            window.onload = function(){
			courses = onloadTimeTable("<?php echo $timeTable;?>");

		  }
        </script>
    </body>
</html>