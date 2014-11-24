<?php

?>

<html>
    <head>
    </head>
    <body>
        <h1 id="whateverID"></h1>
        
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