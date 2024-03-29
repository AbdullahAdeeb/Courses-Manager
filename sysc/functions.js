var coursesArray= new Object();
var checkedCourses=[];
var standing = 1;
var major;
var registerCourses = [];
var registerElectives =  new Object();


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
            var coursesArrayString = request.responseText;
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
	 request.send("typeofrequest=getSatisfiedCourses&major="+this.major+"&checkedCourses="+JSON.stringify(this.checkedCourses)+"&registerCourses="+JSON.stringify(this.registerCourses)+"&standing="+this.standing);
}

///////////////////////////////////
/// FUNCTIONS TO BUILD THE TABLE //
///////////////////////////////////
function addCourses(arr){
    this.coursesArray = arr;
	for(var i = 0; i < arr.length; i++){
		a = arr[i];
        if(a.CRSE_ID.indexOf('COMP') != -1 || a.CRSE_ID.indexOf('ENGE') != -1){
            addElective(a.YEAR,a.TERM,a.CRSE_ID)
        }else{
            addCourse(a.YEAR,a.TERM,a.CRSE_ID,a.info[0].CATALOG_TITLE);  //(year,sem,name,desc)
        }
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

function addElective(year,sem,name){
	var yearElement = getYearElement(year);
	
	// get the new course from the template
	var newCourse = document.getElementById("elective").cloneNode(true); //change this later to get specific course i.e"sysc"
	newCourse.setAttribute("id",name.replace(" ","_"));
	newCourse.getElementsByClassName("courseTitle")[0].innerHTML = name;
	newCourse.getElementsByClassName("courseDescription")[0].innerHTML = "Elective course";
    newCourse.getElementsByClassName("courseLink")[0].setAttribute("href","javascript:displayElectivesInfo('"+name+"')");
    newCourse.getElementsByClassName("showElectives")[0].setAttribute("href","javascript:displayElectivesInfo('"+name+"')");
	
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



//////////////////////////////////////////////
/// COURSE STATE AND MANIPULATION FUNCTIONS///
//////////////////////////////////////////////
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

function disableCourseElement(name){
    if(name.indexOf("COMP") != -1 || name.indexOf("ENGE") != -1)return;
    
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
    if(name.indexOf("COMP") != -1 || name.indexOf("ENGE") != -1)return;
    
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

function displayCourseInfo(name){
    var course = getCourseFromArray(name);
    var info ="<br>";
    for(var i = 0; i < course.info.length; i++){
        info += "<b><br>Catalog Title:</b> "+course.info[i].CATALOG_TITLE+
            "<br><b>Room Cap:</b> "+course.info[i].ROOM_CAP+
            "<br><b>Pre-requisits:</b> "+course.prereq.PRE_TEXT+
            "<br><b>DAYS:</b> "+course.info[i].DAYS+
            "<br><b>TIME:</b> "+course.info[i].START_TIME+" - "+course.info[i].END_TIME+
            "<hr>";
        
    }
    
    document.getElementById("courseInfoTitle").innerHTML = name;
    document.getElementById("courseInfo").innerHTML = info;
}

function displayElectivesInfo(name){
    document.getElementById("courseInfoTitle").innerHTML = name;

    var course = getCourseFromArray(name);
    document.getElementById("courseInfo").innerHTML = "<br>";

    var noneRadio = document.createElement("INPUT");
    noneRadio.setAttribute("type", "radio");
    noneRadio.setAttribute("name",name);
    noneRadio.setAttribute("onclick","onElectiveSelect('"+name+"',this);");
    noneRadio.setAttribute("value","none");
    noneRadio.setAttribute("checked",true);
    document.getElementById("courseInfo").appendChild(noneRadio);
    document.getElementById("courseInfo").innerHTML += "<b>None</b><br><hr>";
    
    var isSet = false;
    if(registerElectives[name] != undefined){
        isSet = true;
    }
    for(var i = 0; i < course.info.length; i++){
        var mRadio = document.createElement("INPUT");
        mRadio.setAttribute("type", "radio");
        mRadio.setAttribute("name",name);
        mRadio.setAttribute("onclick","onElectiveSelect('"+name+"',this);");
        mRadio.setAttribute("value",course.info[i].SUBJ+' '+course.info[i].CRSE);
        if(registerElectives[name] == course.info[i].SUBJ+' '+course.info[i].CRSE){
            mRadio.setAttribute("checked",true);
        }
        document.getElementById("courseInfo").appendChild(mRadio);
        var info =
            "<b>"+course.info[i].SUBJ+' '+course.info[i].CRSE+"</b>"+
            "<br><b>Description:</b> "+course.info[i].CATALOG_TITLE+
            "<hr>";
        document.getElementById("courseInfo").innerHTML += info;

    }

}



/////////////////////////////////////
////HANDLERS FOR USER INTERACTIONS///
/////////////////////////////////////
//Handler method when check box is check/unchecked
//It will update the list checkedCourses
function onCourseChecked(n){
	if(registerCourses.indexOf(n)!=-1){
		alert("Can't be done with a course you're regisrering in");
		document.getElementById(n.replace(" ","_")).getElementsByClassName("courseCheckbox")[0].checked=false;
		return;
	}
    var id = n.replace(" ","_");
    var courseElem = document.getElementById(id);
    var checkBox = courseElem.getElementsByClassName("courseCheckbox")[0];
    
    var index = this.checkedCourses.indexOf(n);
    if(checkBox.checked && index == -1){
        this.checkedCourses.push(n)
    }else if(!checkBox.checked && index != -1){
        this.checkedCourses.splice(index,1);
    }

    getEnabledCourses();
}

function onRegisterChecked(name){

	if(checkedCourses.indexOf(name)!=-1){
		alert("Can't register in done course");
		document.getElementById(name.replace(" ","_")).getElementsByClassName("registerCheckbox")[0].checked=false;
		return;
	}
    var term = document.getElementById("regTerm").value;
    var course = getCourseFromArray(name);
    for(var i = 0 ; i < course.info.length;i++){
        if(course.info[i].TERM_OFFERED == term){
            var index = this.registerCourses.indexOf(name);
            if(index == -1){
                this.registerCourses.push(name)
            }else{
                this.registerCourses.splice(index,1);
            }
            getEnabledCourses();
            return true;
        }
    }
    // uncheck the registeration box as courses is not available
    alert("course is not available in the term selected");
    var course = document.getElementById(name.replace(" ","_"));
    var regBox = course.getElementsByClassName("registerCheckbox")[0];
    regBox.checked =false;
    return false;
    
}

function onElectiveSelect(name, courseRadio){
    console.log(name);
    var elemID = name.replace(" ","_");
    if(courseRadio.value == 'none'){
        document.getElementById(elemID).getElementsByClassName("registerCheckbox")[0].checked = false;
        delete registerElectives[name];
        
    }else{
        for(var key in registerElectives){
            if(registerElectives[key].indexOf(courseRadio.value) != -1){
                alert("This elective is already registered in another term");
                displayElectivesInfo(name);
                return;
            }
        }
        document.getElementById(elemID).getElementsByClassName("registerCheckbox")[0].checked = true;
        registerElectives[name] = courseRadio.value;
    }
}

function onStandingChange(value){
	this.standing = value;
    var yearElem;
    for(var i=1; i<value; i++){
        yearElem = getYearElement(i);
        var checkboxes = yearElem.getElementsByClassName("courseCheckbox");
        for(j=0; j<checkboxes.length;j++){
            checkboxes[j].checked = true;
            checkboxes[j].onchange();
        }
    }
    for(var i=value; i<5; i++){
        yearElem = getYearElement(i);
        checkboxes = yearElem.getElementsByClassName("courseCheckbox");
        for(j=0; j<checkboxes.length;j++){
            checkboxes[j].checked = false;
            checkboxes[j].onchange();
        }
    }
    onCourseChecked();
}

function onclickNextButton(){
    var term = document.getElementById("regTerm").value;
//    var registerCourses = []; 
//	for (var y=1; y<=4;y++){
//		var checkedRegister=getYearElement(y).getElementsByClassName("registerCheckbox");
//		for(var j=0; j<checkedRegister.length;j++){
//			if(checkedRegister[j].checked){                 //check the courses that the user marked as check
//			var registeredCourse=checkedRegister[j].parentNode.getAttribute('id').replace("_"," ");
//                registerCourses.push(registeredCourse);
//            }
//	   }
//	}
    
    //add the selected for registeration electives to the register courses list
    for(var name in registerElectives){
        registerCourses.push(registerElectives[name]);
    }
    
    if(registerCourses.length ==0){
        alert('no courses selected\n please check the courses to register in.');
        return;
    }    
    window.location='view2.php?regCourses='+JSON.stringify(registerCourses)+"&term="+term;
}

function onTermChange(){
	regsiterCourses=[];
    var regBox = document.getElementsByClassName("registerCheckbox");
    for (var i=0; i<regBox.length;i++){
        regBox[i].checked = false;
	}
}