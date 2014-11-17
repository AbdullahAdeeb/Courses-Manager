<?php
require_once("db.php");
$db = new database();
$request_type = $_POST['typeofrequest'];



if($request_type == "login"){
		$login = $_POST['login'];
		$password = $_POST['password'];
		$major = $_POST['major'];
		//start cookie here... no need to send major in header just put it in a cookie session
		header("Location: coursestable.php?major=".$major);

}
//fullname = CRSE_ID + name e.g) ELEC 2501
// it is retrieved from db in on line 52
function getCourseInfo($fullname){
	global $db;
	$dept = explode(" ",$fullname)[0];
	$idnum = explode(" ",$fullname)[1];
    
    //Query the general course information i.e. timing and capacity
	$sql="SELECT * FROM courses where SUBJ LIKE '".$dept."' AND CRSE=".$idnum." AND INSTR_TYPE LIKE 'LEC'" ;
	$resultInfo = $db->execute($sql);
    if(sizeof($resultInfo) == 0){
        $resultInfo[0]="Unable to find course info";
    }
    return $resultInfo;
}

function getCourseLabs($fullname){
	global $db;
	$dept = explode(" ",$fullname)[0];
	$idnum = explode(" ",$fullname)[1];
    
    //Query the general course information like LABS
	$sql="SELECT * FROM courses where SUBJ LIKE '".$dept."' AND CRSE=".$idnum." AND INSTR_TYPE LIKE 'LAB'" ;
	$resultInfo = $db->execute($sql);
    if(sizeof($resultInfo) == 0){
        $resultInfo[0]="Unable to find course info";
    }
    return $resultInfo;
}

function getCoursePrereq($fullname){
    global $db;
    //Query the pre-requisites information for the course
	$sql="SELECT * FROM prereq where CRSE LIKE '".$fullname."'" ;
    $resultprereq = $db->execute($sql);
    
    //if there is no pre requisites defined for the course; return empty line
    if(sizeof($resultprereq) == 0){
        $resultprereq[0]['PRE_TEXT']="Course has no prerequisites";
    }
    
    return $resultprereq[0];
}

if($request_type == "getCourses"){
	$major = $_POST['major'];
	$sql="SELECT * FROM ".$major;//Get all the courses from DATABASE not table (doesnt make sense that its from DATABASE and not table)
	$courses = $db->execute($sql);
	
	// $jcourses= json_encode($courses);
	$allCoursesInfo = array();
	foreach($courses as &$c){
		$fullname = $c['CRSE_ID'];
		$info = getCourseInfo($fullname);//get all
		$labs=getCourseLabs($fullname);
        $prereq = getCoursePrereq($fullname);
        
        $c['info']=$info;
        $c['prereq']=$prereq;
		$c['labs']=$labs;
        $allCoursesInfo[] = $c; //only what I want I disregard everything else (extract only what I need) allCoursesInfo has info,prereq  (array of arrays)
	}

	echo json_encode($allCoursesInfo); //from server to file must do json encode (in server) in client json(parse)
	
}

// // FOR TESTING ONLY
$request_type = $_GET['typeofrequest'];
if($request_type == "test"){
	$major = "sysc";
	$sql="SELECT * FROM ".$major;
	$courses = $db->execute($sql);
	
	// $jcourses= json_encode($courses);
	$allCoursesInfo = array();
	foreach($courses as &$c){
		$fullname = $c['CRSE_ID'];
		$info = getCourseInfo($fullname);
		if(sizeof($info)==0){ // if course is not found in the big course table
			$allCoursesInfo[] = $c;
		}else{
			$allCoursesInfo[] = array_merge($c,$info);
		}
	}

	echo json_encode($allCoursesInfo);
	
}

?>
