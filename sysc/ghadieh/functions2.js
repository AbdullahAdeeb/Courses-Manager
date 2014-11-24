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
    
    console.log(timeTables);
    document.body.innerHTML = timeTables;
}