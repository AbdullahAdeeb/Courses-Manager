<?php
//$timeTableString=$_GET['timeTable'];
//$timeTable=json_decode($timeTableString);


?>


<html>
    <head>
    </head>
    <body>
       
	<div id="schedule" name="schedule">

	
	
	</div>	
			
		
		
		
	
		
		
	 
        <script src="functions2.js"></script>
        <script> 
             window.onload = function(){
                var reg = <?php echo $_GET['regCourses'];?> ;
                var term = "<?php echo $_GET['term']; ?>" ;
                getTimeTables(reg,term);
//            console.log(document.cookie);
              }       
        </script>  
       
    </body>
</html>