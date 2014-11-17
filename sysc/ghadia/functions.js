var coursesArray=[];
var checkedCourses=[];
var standing = 1;
var schedule = "<br>";

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
    updateCourses();
}


////////////////////////////////////////
/// AJAX FUNCTION FOR GRABING COURSES///
///////////////////////////////////////
function getCoursesFromDB(major){
	request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			// console.log(JSON.parse(request.responseText));
			addCourses(JSON.parse(request.responseText))
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
function isCourseSatisfied(name){
    var course = getCourseFromArray(name);
    var prereq = course.prereq;
    if(prereq.PRE_CRSE == undefined || prereq.PRE_CRSE == ""){ // course has no prerequisites
        return true;
    }else{  // course has prerequisites and must be compared to checked
        var preCrse = prereq.PRE_CRSE;            //parse the PRE_CRSE first 
        preCrse = preCrse.replace("(",""); preCrse = preCrse.replace(")","");  // remove brackets
        var preAnd = preCrse.split(" and ");    //get AND prerequisites
        var sat = true;
        
        for (var i = 0; i< preAnd.length; i++){    
            var preOR =  preAnd[i].split(" or ");     //get OR prerequisites
            for(var j=0;j<preOR.length;j++){
                if(checkedCourses.indexOf(preOR[j]) != -1){   // one of the OR is found
                    break;
                }
                if(j == preOR.length-1){
                    sat = false;
                }
            }
            if(sat == false){
                return false;
            } 
        }
    }
    return true;

}

//refresh all courses by enabling and disabling
function updateCourses(){
    for(var i=0;i<this.coursesArray.length;i++){
        name = getCourseNameFromArray(i);
        if(this.checkedCourses.indexOf(name) == -1 ){ // true: course is unchecked
            //validate it's prereq with the checkedcourses
            var sat = isCourseSatisfied(name);
            if(sat){
                //enable the course
//                alert(i+">>"+name+">>"+sat);
                enableCourseElement(name);
            }else{
                disableCourseElement(name);
            }
        }else{ // false: course is checked.. make sure it's enabled
            enableCourseElement(name);
        }
    }
}

function courseAvailable(name, days){
return true;}
/*
*info[0] = title; info[1]=courseNumber; info[2]=days; info[3]=endtime; info[4]=typeOfCourse;
*info[5]=id; info[6]=roomCapacity; info[7]=section; info[8]=startTime; info[9]=courseName; info[10]=TermOffered

CATALOG_TITLE: "Comm. Skills for Eng. Students"
CRSE: "2100"
DAYS: "W"
END_TIME: "1725"
INSTR_TYPE: "LEC"
Id: "620"
ROOM_CAP: "42"
SEQ: "A"
START_TIME: "1435"
SUBJ: "CCDP"
TERM_OFFERED: "F
*/
	/*var course = getCourseFromArray(name);
	var roomCapacity = parseInt(course.info[ROOM_CAP]);
	var day = course.info['DAYS'];
	day = day.split("");
	var startTime = pasreInt(courses.info["START_TIME"]);
	var endTime = parseInt(courses.info["END_TIME"]);
	
	 if (roomCapacity != 0)
	{
		for ( i = startTime; i < endTime; i+=30){
			//var temptime = i;
			if (days
		}
	}else {
		return false;
	} 
};*/


/////////////////////////////////////
////HANDLERS FOR USER INTERACTIONS///
/////////////////////////////////////
function onAddToRegisterationList(name){
	// Variable that will hold all the courses that were registered in
	var registeredCourses = [];
	// 2 variables that will create the timetable
	var days= {/*'m':'','t':'','w':'','th':'','f':''*/};
	var time = {};
	time['830'] = '';
	for ( i = 835; i < 2105; i+=30){
		time[i.toString()] = '0';
	};
	days['m'] = time;
	days['t'] = time;
	days['w'] = time;
	days['th'] = time;
	days['f'] = time;
    alert(name+" >> being implemented");
		
	// checking if the user meets the required standing year
	if ( isCourseSatisfied(name))
	{
	alert('in the if statement');
		// retrieving one course at a time
		var course = getCourseFromArray(name);
		// HAVING A PROBLEM IN RETREIVING ROOM CAPACITY AND DAY FROM COURSE//********************************************************************************/
		//var roomCapacity = parseInt(course.info['ROOM_CAP']);
		var roomCapacity = course.info['ROOM_CAP'];
		var day = course.info['DAYS'];
		alert('day is ' + day);
		//var days = day.split('');
		alert('room capacity ' + roomCapacity);
		// checking available time and capacity
		if (courseAvailable (name)){	
			schedule += course.CRSE_ID + ";";
			registeredCourses.push(course);
			document.getElementById("coursesRegistered").innerHTML = schedule;
		}
	}else{
		alert("You do not meet the minimum year standing!");
	};
	/*
	These don't work
	//alert ("arr[0] >>"+arr[0]);
	//alert ("arr['CRSE_ID'] >>"+arr[CRSE_ID]);
	alert ("arr[0].CRSE_ID>>"+arr[0].CRSE_ID);
	*/
	/*
	coursesArray[0]
	Object {CRSE_ID: "CCDP 2100", YEAR: "2", TERM: "F", info: Array[26], prereq: Object}
	coursesArray[0].CRSE_ID
	"CCDP 2100"
	*/
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
    this.checkedCourses=[]
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