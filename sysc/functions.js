var coursesArrayString="";
var coursesArray=[];
var checkedCourses=[];
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

function addCourse(year,sem,name,desc){
	var yearElement = getYearElement(year);
	
	// get the new course from the template
	var newCourse = document.getElementById("sysc").cloneNode(true); //change this later to get specific course i.e"sysc"
	newCourse.setAttribute("id",name.replace(" ","_"));
	newCourse.getElementsByClassName("courseTitle")[0].innerHTML = name;
	newCourse.getElementsByClassName("courseDescription")[0].innerHTML = desc;
    newCourse.getElementsByClassName("courseLink")[0].setAttribute("href","javascript:displayCourseInfo('"+name+"')");
    newCourse.getElementsByClassName("courseCheckbox")[0].setAttribute("onchange","onCourseChecked('"+name+"')");
	
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

function addCourses(arr){
    this.coursesArray = arr;
	for(var i = 0; i < arr.length; i++){
		a = arr[i];
        addCourse(a.YEAR,a.TERM,a.CRSE_ID,a.info[0].CATALOG_TITLE);  //(year,sem,name,desc)
	}
//    updateCourses();
}


////////////////////////////////////////
/// AJAX FUNCTION FOR GRABING COURSES///
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
            updateCourses();        // to enable/disable courses according to prerequsites 
		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	request.send("typeofrequest=getCourses&major="+major);
}

//////////////////////////////////////////////
/// COURSE STATE AND MANIPULATION FUNCTIONS///
//////////////////////////////////////////////
function disableCourseElement(name){
    var course = document.getElementById(name.replace(" ","_"));
    course.className = course.className.replace("enabled","disabled");
    var cb = course.getElementsByClassName("courseCheckbox")[0];
    cb.checked =false;
    cb.disabled =true;
}

function enableCourseElement(name){
    var course = document.getElementById(name.replace(" ","_"));
    course.className = course.className.replace("disabled","enabled");
    var cb = course.getElementsByClassName("courseCheckbox")[0];
    cb.disabled =false;
}

function enableCourses(enabledCourses){
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

//returns true if all course pre-requisites are satisfied, false otherwise.
//function isCourseSatisfied(name){
//    var course = getCourseFromArray(name);
//    var prereq = course.prereq;
//    if(prereq.PRE_CRSE == undefined || prereq.PRE_CRSE == ""){ // course has no prerequisites
//        return true;
//    }else{  // course has prerequisites and must be compared to checked
//        var preCrse = prereq.PRE_CRSE;            //parse the PRE_CRSE first 
//        preCrse = preCrse.replace("(",""); preCrse = preCrse.replace(")","");  // remove brackets
//        var preAnd = preCrse.split(" and ");    //get AND prerequisites
//        var sat = true;
//        
//        for (var i = 0; i< preAnd.length; i++){    
//            var preOR =  preAnd[i].split(" or ");     //get OR prerequisites
//            for(var j=0;j<preOR.length;j++){
//                if(checkedCourses.indexOf(preOR[j]) != -1){   // one of the OR is found
//                    break;
//                }
//                if(j == preOR.length-1){
//                    sat = false;
//                }
//            }
//            if(sat == false){
//                return false;
//            } 
//        }
//    }
//    return true;
//}

//refresh all courses by enabling and disabling
function updateCourses(){
//    for(var i=0;i<this.coursesArray.length;i++){
//        name = getCourseNameFromArray(i);
//        if(this.checkedCourses.indexOf(name) == -1 ){ // true: course is unchecked
//            //validate it's prereq with the checkedcourses
//            var sat = isCourseSatisfied(name);
//            if(sat){
//                //enable the course
////                alert(i+">>"+name+">>"+sat);
//                enableCourseElement(name);
//            }else{
//                disableCourseElement(name);
//            }
//        }else{ // false: course is checked.. make sure it's enabled
//            enableCourseElement(name);
//        }
//    }
    
    request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
//			console.log(JSON.parse(request.responseText));
            enableCourses(JSON.parse(request.responseText))
		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	               request.send("typeofrequest=getSatisfiedCourses&major="+this.major+"&checkedCourses="+JSON.stringify(checkedCourses));
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
function onCourseChecked(){
    this.checkedCourses=[];
    for(var y=1;y <=4;y++){
        var checkboxes = getYearElement(y).getElementsByClassName("courseCheckbox");
        for(j=0; j<checkboxes.length;j++){
            if(checkboxes[j].checked){
            var n = checkboxes[j].parentNode.getAttribute('id').replace("_"," ");
            this.checkedCourses.push(n);
            } 
        }
    }
    updateCourses();
    
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