
<html v=2>
 <link rel="stylesheet" type="text/css" href="styles.css">
<head>
<title>Courses Table</title>
</head>
<body>
    <?php

        $major = $_GET['major'];
        if($major ==""){
            echo "<h1>Illegal Access to the page</h1>";
            echo "<p>Please go back to the index page and try again.</p>";
        }else{
            
    ?>
    
	<div class="controlBlock">
        <div>
            <h3>Select your year standing:</h3>
            <select name="standing" id="standing" onchange="onStandingChange(this.value)">
                <option value="1">First Year</option>
                <option value="2">Second Year</option>
                <option value="3">Third Year</option>
                <option value="4">Fourth Year</option>
            </select> 
        </div>
        <div>
            <h3>Term to register in:</h3>
            <select name="regTerm" id="regTerm" onchange="onTermChange();">
                <option value="F">Fall Term</option>
                <option value="W">Winter Term</option>
            </select> 
        </div>
        <button class="nextButton" onclick="onclickNextButton()">Next</button> 
	</div>
    
    <div class="viewBlock">
        <h1>Courses Table</h1>
        <div class="table" >
            <div class="year" id="first">
                <h2><center>First year</center></h2>
                <div class="column F">
                    <h2>Fall</h2>
                    <ul class="courses">
                    </ul>
                </div>
                <div class="column W">
                    <h2>Winter</h2>
                    <ul class="courses">
                    </ul>
                </div>
            </div>
            <div class="year" id="second">
                <h2><center>Second year</center></h2>
                <div class="column F">
                    <h2>Fall</h2>
                    <ul class="courses">
                    </ul>
                </div>
                <div class="column W">
                    <h2>Winter</h2>
                    <ul class="courses">
                    </ul>
                </div>
            </div>
            <div class="year" id="third">
                <h2><center>Third year</center></h2>
                <div class="column F">
                    <h2>Fall</h2>
                    <ul class="courses">
                    </ul>
                </div>
                <div class="column W">
                    <h2>Winter</h2>
                    <ul class="courses">
                    </ul>
                </div>
            </div>
            <div class="year" id="fourth">
                <h2><center>Fourth year</center></h2>
                <div class="column F">
                    <h2>Fall</h2>
                    <ul class="courses">
                    </ul>
                </div>
                <div class="column W">
                    <h2>Winter</h2>
                    <ul class="courses">
                    </ul>
                </div>
            </div>    
        </div>
        <div class="rightSidebar">
            <h2 id="courseInfoTitle">Course Info</h2>
            <p id="courseInfo">Click on course for details</p>
        </div>
    </div>
<!--	<hr>-->
 	<ul class="template" style="display:none;">
		<li class="course sysc enabled" id="sysc">
            <a class="courseLink" href="#"><h4 class="courseTitle">course name</h4></a>
            <p class="courseDescription"></p>
            <input class="courseCheckbox" type="checkbox" name="courseCheckbox">Done<br>
            <input class="registerCheckbox" type="checkbox" name="registerCheckbox">Register
        </li>
		<li class="course elec" id="elec">
            <h3 class="courseDescription">course name</h3>
            <p class="courseTime"></p>
            <input type="checkbox" name="courseTaken">Done</li>
	</ul>
	
	<script src="functions.js"></script>
	<script>
		var cc;
		window.onload = function(){
			courses = getCoursesFromDB("<?php echo $major;?>");

		}
	</script>
	<?php
     }//Else end 
    ?>
</body>
    
</html>
