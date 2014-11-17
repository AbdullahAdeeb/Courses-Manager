<?php

$major = $_GET['major'];

?>
<html>
 <link rel="stylesheet" type="text/css" href="styles.css">
<head>
<title>Courses Table</title>
</head>
<body>
<h1>Courses Table</h1>
	<br>
	<div>Select your year standing:
		<select name="standing" id="standing" onchange="onStandingChange(this.value)">
			<option value="1">First Year</option>
			<option value="2">Second Year</option>
			<option value="3">Third Year</option>
			<option value="4">Fourth Year</option>
		</select>
	</div>
	<br>
    <div class="viewBlock">
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
		<div class="schedule">
		<ul id="coursesRegistered">
			<li>a</li>
		</ul>
	</div>
    </div>
	<hr>
 	<ul class="template" style="display:none;">
		<li class="course sysc enabled" id="sysc"><a class="courseLink" href="#"><h3 class="courseTitle">course name</h3></a><p class="courseDescription"></p><input class="courseCheckbox" type="checkbox" name="courseCheckbox">Done</li>
		<li class="course elec" id="elec"><h3 class="courseDescription">course name</h3><p class="courseTime"></p><input type="checkbox" name="courseTaken">Done</li>
	</ul>
	
	
	
	<script src="functions.js"></script>
	<script>
		var cc;
		window.onload = function(){
			courses = getCoursesFromDB("<?php echo $major;?>");

		}
	</script>
	

	
</body>
</html>