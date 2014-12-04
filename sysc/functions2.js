var tableNum = 0;
var allTimeTables = [];

function getTimeTables(regCourses,term){
	request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
            allTimeTables = JSON.parse(request.responseText);
            displayTimeTable();

		}else if(request.readyState == 0){
            document.getElementById("spinner").style.display = "none";
			alert("Error Connecting to the server, Refresh maybe!");
            document.getElementById("tableNum").innerHTML = "ERROR: Try refreshing";

		}	
	}
    request.timeout = 5000;
    request.ontimeout=function(){
        document.getElementById("spinner").style.display = "none";
        document.getElementById("tableNum").innerHTML = "No conflict Free time tables were resolved<br>Try again with other courses";
        alert("No conflict Free time tables were resolved\nTry again with other courses");

        
    }
	request.send("typeofrequest=getTimeTable&registeredCourses="+JSON.stringify(regCourses)+"&term="+term);
}

function displayTimeTable(){
    document.getElementById("spinner").style.display = "none";
    if(this.allTimeTables.length == 0 ){
        document.getElementById("tableNum").innerHTML = "No conflict Free time tables were resolved<br>Try again with other courses";
        return;
    }
    var table = this.allTimeTables[this.tableNum];
    var dayKey = Object.keys(table);
    document.getElementById("tableNum").innerHTML = "Table "+(this.tableNum+1)+ " of "+ this.allTimeTables.length;
    document.getElementById("tableDisplay").innerHTML ="<tr class='DaysRow'><th></th><th>Monday</th><th>Tuesday</th><th>Wednesday</th><th>Thursday</th><th>Friday</th></tr>";
    
   
    for(var h=8.5; h<=20.5; h+=0.5){ //timetable[i].length to get all the times for every day
        var row = "<tr>";
        round = Math.floor(h);
        row+="<th class='timeCell'>"+round.toString()+":"+((h-round)*(6)).toString()+"0</th>"
        for(var i = 0 ; i < dayKey.length ; i++){
            var slot = table[dayKey[i]][h.toString()];
            if(slot == false){
                row += "<td class='courseCell'><p></p><br><p></p></td>";
            }else{
                row += "<td class='courseCell'>"+slot.name+"<br>ID:"+slot.Id+"</td>";
            }
        }
        row += "</tr>";
        document.getElementById("tableDisplay").innerHTML += row;
    }
}

function onNextTable(){
    if(this.tableNum < this.allTimeTables.length-1){
        this.tableNum++;
    }else{
        this.tableNum = 0;
    }
    displayTimeTable();
}

function onPrevTable(){
    if(this.tableNum > 0){
        this.tableNum--;
    }else{
        this.tableNum = this.allTimeTables.length-1;
    }
    displayTimeTable();
}

function registerTable(){
    var IDs = [];
    var table = allTimeTables[tableNum];
    for(var key in table){
        var day = table[key]; 
        for(var keyy in day){
            var slot = day[keyy];
            if(IDs.indexOf(slot.Id) == -1 && slot.Id > 0){
                IDs.push(slot.Id);
            }
        }
    }
    
    
    // send the list of CRN IDs to Server for registeration
    request = new XMLHttpRequest();
	request.open("POST","server.php" ,true);
	request.setRequestHeader("content-type", "application/x-www-form-urlencoded");	
	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
            if(request.responseText != "DONE"){
                alert("unable to register in course(porbably full):\n"+request.responseText);
            }else{
                alert("All courses were succefully registered");
            }
		}else if(request.readyState == 0){
            alert("unable to register courses");

		}	
	}
	request.send("typeofrequest=registerTable&coursesIDs="+JSON.stringify(IDs));
    
}
