function getTimeTables(regCourses,term){

	request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			var timeTables = JSON.parse(request.responseText);
            displayTimeTables(timeTables);

		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	request.send("typeofrequest=getTimeTable&registeredCourses="+JSON.stringify(regCourses)+"&term="+term);
}

function displayTimeTables(timeTables){
    /// SHABKA PUT YOUR CODE TO DISPLAY THE TABLE HERE :D 
    console.log(timeTables);
    document.body.innerHTML = timeTables;
}

//timetable;
//////////////////////////////////////////////////////////////////////////////////////function to pad and show 00
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
///////////////////////////////////////////////////////////////////////////////////////
var classTimes;// variable to store all the class times and then use it to ultimately fill the table with classes

function onloadTimeTable(timetable){
	var minutes=true;
	var j=30;
    //window.onload
	//alert(timetable);
	document.getElementById("schedule").innerHTML="<table id=\"tableDisplay\" border=\"1\"></table>";//create a table with id tableDisplay then fill it up with rows and columns
	
	document.getElementById("tableDisplay").innerHTML="<tr><td></td><td width=\"50\" id=\"M\">Monday</td><td width=\"50\" id=\"T\">Tuesday</td><td width=\"50\">Wednesday</td><td width=\"50\">Thursday</td><td width=\"50\">Friday</td></tr>";
	for(i=8; i<=22; i++){
	if(minutes==true){
	document.getElementById("tableDisplay").innerHTML+=
	"<tr><td class=\"classTime\" width=\"50\">"+i+":"+j+"</td><td></td><td></td><td></td><td></td><td></td></tr>";
	//------------------------------------------------------> displays 2 tables must make it one table
	
	j=pad(0,2);// j=00 now
	minutes=false;
	} else{
	document.getElementById("tableDisplay").innerHTML+=
	"<tr><td class=\"classTime\" width=\"50\">"+i+":"+j+"</td><td></td><td></td><td></td><td></td><td></td></tr>";
	j=30;
	minutes=true;
	i--;
	}
	
	}
	 classTimes=document.getElementsByClassName("classTime");
}