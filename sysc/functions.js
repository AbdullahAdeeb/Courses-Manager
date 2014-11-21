var coursesArrayString="";
var coursesArray=[];
var checkedCourses=[];
var registerCourses=[];
var standing = 1;
var major;

///////////////////////////////////
/// FUNCTIONS TO BUILD THE TABLE //
///////////////////////////////////
function getYearElement(year){
    if(year == 1){
		return document.getElementById('first');
	}else if(year == 2){
		return document.getElementById('second');
	}else if(year == 3){
		return document.getElementById('third');
	}else if(year == 4){
		return document.getElementById('fourth');
	}
    alert("wrong year was searched");
}

function addCourses(arr){
    this.coursesArray = arr;
	for(var i = 0; i < arr.length; i++){
		a = arr[i];
        addCourse(a.YEAR,a.TERM,a.CRSE_ID,a.info[0].CATALOG_TITLE);  //(year,sem,name,desc)
	}
}

function addCourse(year,sem,name,desc){
	var yearElement = getYearElement(year);
	
	// get the new course from the template
	var newCourse = document.getElementById("sysc").cloneNode(true); //change this later to get specific course i.e"sysc"
	newCourse.setAttribute("id",name.replace(" ","_"));
	newCourse.getElementsByClassName("courseTitle")[0].innerHTML = name;
	newCourse.getElementsByClassName("courseDescription")[0].innerHTML = desc;
    newCourse.getElementsByClassName("courseLink")[0].setAttribute("href","javascript:displayCourseInfo('"+name+"')");
    newCourse.getElementsByClassName("courseCheckbox")[0].setAttribute("onchange","onCourseChecked('"+name+"')");
    newCourse.getElementsByClassName("registerCheckbox")[0].setAttribute("onchange","onRegisterChecked('"+name+"')");
	
	var courses;
	if(sem == 'F'){
		courses = yearElement.getElementsByClassName("F")[0].getElementsByClassName("courses")[0];
		courses.appendChild(newCourse);
	}else if(sem == 'W' ){
		courses = yearElement.getElementsByClassName("W")[0].getElementsByClassName("courses")[0];
		courses.appendChild(newCourse);
	}else{
		alert("course without a term");
	}	
}




////////////////////////////////////////
/// AJAX FUNCTIONs FOR GRABING COURSES///
///////////////////////////////////////
function getCoursesFromDB(major){
    this.major = major;
	request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			// console.log(JSON.parse(request.responseText));
            coursesArrayString = request.responseText;
			addCourses(JSON.parse(coursesArrayString)); // to grab all the courses and their info
            getEnabledCourses();        // to enable/disable courses according to prerequsites 
		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	request.send("typeofrequest=getCourses&major="+major);
}

//refresh all courses by enabling and disabling
function getEnabledCourses(){
    request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
//			console.log(JSON.parse(request.responseText));
            updateCourses(JSON.parse(request.responseText))
		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	 request.send("typeofrequest=getSatisfiedCourses&major="+this.major+"&checkedCourses="+JSON.stringify(checkedCourses)+"&standing="+this.standing);
}

function onclickNextButton(){
    var term = document.getElementById("regTerm").value;
	for (var y=1; y<=4;y++){
		var checkedRegister=getYearElement(y).getElementsByClassName("registerCheckbox");
		for(var j=0; j<checkedRegister.length;j++){
			if(checkedRegister[j].checked){                 //check the courses that the user marked as check
			var registeredCourse=checkedRegister[j].parentNode.getAttribute('id').replace("_"," ");
			this.registerCourses.push(registeredCourse);
            }
	   }
	}
	request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			var timeTable = request.responseText;
//            window.location='view2.php?timeTable='+timeTable;
		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	request.send("typeofrequest=getTimeTable&registeredCourses="+JSON.stringify(registerCourses)+"&term="+term);
}

//////////////////////////////////////////////
/// COURSE STATE AND MANIPULATION FUNCTIONS///
//////////////////////////////////////////////
function disableCourseElement(name){
    var course = document.getElementById(name.replace(" ","_"));
    course.className = course.className.replace("enabled","disabled");
    var doneCB = course.getElementsByClassName("courseCheckbox")[0];
    var addCB = course.getElementsByClassName("registerCheckbox")[0];
    doneCB.checked =false;
    doneCB.disabled =true;
    addCB.checked =false;
    addCB.disabled =true;
}

function enableCourseElement(name){
    var course = document.getElementById(name.replace(" ","_"));
    course.className = course.className.replace("disabled","enabled");
    var doneCB = course.getElementsByClassName("courseCheckbox")[0];
    var addCB = course.getElementsByClassName("registerCheckbox")[0];
    
    doneCB.disabled =false;
    addCB.disabled =false;
}

function updateCourses(enabledCourses){
    for(j=0; j<coursesArray.length;j++){
        var name = getCourseNameFromArray(j)
        if(enabledCourses.indexOf(name) == -1){
            disableCourseElement(name);
        }else{
            enableCourseElement(name);
        }   
    }
}

//returns true if course is checked(taken), false otherwise.
function isCourseElementChecked(name){
    return document.getElementById(name.replace(" ","_")).getElementsByClassName("courseCheckbox")[0].checked;
}

function getCourseNameFromArray(index){
    return coursesArray[index]['CRSE_ID'];
}

function getCourseFromArray(name){
    for(var i = 0; i < coursesArray.length; i++){
		course = coursesArray[i];
        if (course['CRSE_ID']==name){
            return course;
        }
    }
    console.log("A course was not found in the list of courses!!");
    return "The course was not found in the list of courses!! Try clicking it again.";
}




/////////////////////////////////////
////HANDLERS FOR USER INTERACTIONS///
/////////////////////////////////////
function onAddToRegisterationList(name){
    alert(name+" >> not yet implemented");
}

function displayCourseInfo(name){
    var course = getCourseFromArray(name);
    var info ="<br>";
    for(var i = 0; i < course.info.length; i++){
        info += "<b><br>Catalog Title:</b> "+course.info[i].CATALOG_TITLE+
            "<br><b>Room Cap:</b> "+course.info[i].ROOM_CAP+
            "<br><b>Pre-requisits:</b> "+course.prereq.PRE_TEXT+
            "<br><b>DAYS:</b> "+course.info[i].DAYS+
            "<br><b>TIME:</b> "+course.info[i].START_TIME+" - "+course.info[i].END_TIME+
            "<button onclick=\'onAddToRegisterationList(\""+name+"\");\'>Add to regiseration list</button>"+
            "<hr>";
        
    }
    
    document.getElementById("courseInfoTitle").innerHTML = name;
    document.getElementById("courseInfo").innerHTML = info;
}

//Handler method when check box is check/unchecked
//It will refresh the list checkedCourses
function onCourseChecked(name){
    this.checkedCourses=[];
    for(var y=1;y <=4;y++){
        var checkboxes = getYearElement(y).getElementsByClassName("courseCheckbox");//returning an array of all the elements that have "courseCheckbox" in it
        for(j=0; j<checkboxes.length;j++){
            if(checkboxes[j].checked){ //**************************************** NOTE************************************************************* every checkbox input has .checked to see if its checked or not
            var n = checkboxes[j].parentNode.getAttribute('id').replace("_"," ");//cant put space in html so put _
            this.checkedCourses.push(n);
            } 
        }
    }
    getEnabledCourses();
}

function onRegisterChecked(name){
    alert("Implement me: check if course available in term selected");
}

function onStandingChange(value){
	this.standing = value;
    var yearElem;
    for(var i=1; i<value; i++){
        yearElem = getYearElement(i);
        var checkboxes = yearElem.getElementsByClassName("courseCheckbox");
        for(j=0; j<checkboxes.length;j++){
            checkboxes[j].checked = true;
        }
    }
    for(var i=value; i<5; i++){
        yearElem = getYearElement(i);
        checkboxes = yearElem.getElementsByClassName("courseCheckbox");
        for(j=0; j<checkboxes.length;j++){
            checkboxes[j].checked = false;
        }
    }
    onCourseChecked();
}