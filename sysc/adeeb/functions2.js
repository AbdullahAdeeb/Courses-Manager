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
//			onloadTimeTable(timeTables[0]);

		}else if(request.readyState == 0){
			alert("Error Connecting to the server, Refresh maybe!");
		}	
	}
	request.send("typeofrequest=getTimeTable&registeredCourses="+JSON.stringify(regCourses)+"&term="+term);
}

function displayTimeTable(){
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
                row += "<td class='courseCell'><p></p></td>";
            }else{
                row += "<td class='courseCell'>"+slot+"</td>";
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
