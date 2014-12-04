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
//////////////////////////////////////////////////////////////////////////////////////function to pad and show 00
//function pad(n, width, z) {
//  z = z || '0';
//  n = n + '';
//  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
//}
///////////////////////////////////////////////////////////////////////////////////////
//var classTimes;// variable to store all the class times and then use it to ultimately fill the table with classes

//var tt;
//function onloadTimeTable(timetable){
//	var minutes=true;
//	var j=30;
//    //window.onload
//	//alert(timetable);
//	document.getElementById("schedule").innerHTML="<table id=\"tableDisplay\" border=\"1\"></table>";//create a table with id tableDisplay then fill it up with rows and columns
//	
//	document.getElementById("test").innerHTML=timetable.M;// THIS IS FOR TESTING ONLY
//	// console.log(timetable.M["8.5"]); //I'm accessing an object inside M which is inside timetable.
//	console.log(timetable.M);
//	
//	document.getElementById("tableDisplay").innerHTML="<tr><td></td><td width=\"50\" id=\"M\">Monday</td><td width=\"50\" id=\"T\">Tuesday</td><td width=\"50\">Wednesday</td><td width=\"50\">Thursday</td><td width=\"50\">Friday</td></tr>";
//	for(i=8; i<=22; i++){
//	if(minutes==true){
//	document.getElementById("tableDisplay").innerHTML+=
//	"<tr><td class=\"classTime\" width=\"50\">"+i+":"+j+"</td><td></td><td></td><td></td><td></td><td></td></tr>";
//	//------------------------------------------------------> displays 2 tables must make it one table
//	
//	j=pad(0,2);// j=00 now
//	minutes=false;
//	} else{
//	document.getElementById("tableDisplay").innerHTML+=
//	"<tr><td class=\"classTime\" width=\"50\">"+i+":"+j+"</td><td></td><td></td><td></td><td></td><td></td></tr>";
//	j=30;
//	minutes=true;
//	i--;
//	}
//	
//	}
//	
//     ////////////////////////////////////////////////////////////////////////////////////// fill table with the actual courses
//    var days = Object.keys(timetable);
//    for(var d=0;d<=days.length;d++){
//        var youm = timetable[days[d]];
//        for(j=8.5; j<=20.5; j++){ //timetable[i].length to get all the times for every day
//            var slot = youm[j.toString()];
//            console.log(slot);
//
//        }
//	//var num=i;
//	//var stringTime=console.log(timetable.M[num.toString()]);
//	
//	}
//	
//	 classTimes=document.getElementsByClassName("classTime");
//}