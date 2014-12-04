<?php
//$timeTableString=$_GET['timeTable'];
//$timeTable=json_decode($timeTableString);


?>


<html>
    <head>
        <style>
            #tableNav{
                display:block;
                width= 100%;
                text-align: center;
            }
            #tableNav a, h5{
                display:inline;
            }   
            #tableDisplay{
                width: 96%;
                margin-left: 2%;
                margin-right: 2%;
                margin-top: 20px;
                margin-bottom: 20px;
                border: 1px solid black;
            }
            .courseCell{
                border: 0px;
                background-color: rgba(0, 0, 0, 0.3);
            }
            th{
                
                background-color: rgb(80, 255, 188);
            }
            img{
                display:block;
                margin-left : auto;
                margin-right : auto;
            }
            button{
                display:block;
                margin-left:auto;
                margin-right:auto;
            }
        </style>
    </head>
    <body>
        <div id="schedule" name="schedule">
            <div id="tableNav"style="display:block">
                <a class="prevBtn" style="float:left;" href="javascript:onPrevTable();">Previous Table</a>
                <h5 id="tableNum"> Loading...</h5>
                <a class="nextBtn" style="float:right;" href="javascript:onNextTable();" >Next Table</a>
            </div>
            <button onclick="registerTable();">Register</button>

            <img id="spinner" src="spinner.gif">
            <table id="tableDisplay" border="1">
            </table>
        </div>	

        <div id="test" name="test">

        </div> 
        <script src="functions2.js"></script>
        <script> 
             window.onload = function(){
                var reg = <?php echo $_GET['regCourses'];?> ;
                var term = "<?php echo $_GET['term']; ?>" ;
                getTimeTables(reg,term);
              }       
        </script>  
       
    </body>
</html>