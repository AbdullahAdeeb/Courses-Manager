<?php
//print 'server<br>';  //testing
require_once("Database.php");
require_once("TimeTable.php");

$db = new Database();


/////////////////////////////////////////////////
/////            Request Handlers           ////
////////////////////////////////////////////////
$request_type = $_POST['typeofrequest'];

if($request_type == "login"){
		$login = $_POST['login'];
		$password = $_POST['password'];
		$major = $_POST['major'];
		//start session here... no need to send major in header just put it in a session
		header("Location: view1.php?major=".$major);

}

if($request_type == "getCourses"){
	$major = $_POST['major'];
    $courses = $db->getCourses($major);
    
    
	$allCoursesInfo = array();
	foreach($courses as $c){
		$fullname = $c['CRSE_ID'];
		$info = $db->getCourseInfo($fullname);
        $prereq = $db->getCoursePrereq($fullname);
        
        $c['info']=$info;
        $c['prereq']=$prereq;
        $allCoursesInfo[] = $c;
	}
	echo json_encode($allCoursesInfo);
}

if($request_type == "getSatisfiedCourses"){

    $major = $_POST['major'];
    $coursesArray = $db->getCourses($major);

    $enabledCouses = array();
    $checkedCourses = json_decode($_POST['checkedCourses']);
    for($c = 0; $c < sizeof($coursesArray);$c++){
        $name = $coursesArray[$c]["CRSE_ID"];
        if(!in_array($name,$checkedCourses)){     // false: course is unchecked
            //validate it's prereq with the checkedcourses
             
            $sat = isCourseSatisfied($name,$checkedCourses);
            if($sat){
                array_push($enabledCouses,$name);
            }else{
            }
        }else{ // True: course is in checkedCourses.. make sure it's enabled
            array_push($enabledCouses,$name);
        }
        
    }
    echo json_encode($enabledCouses);
}


////// START: Testing variables//////
$request_type = "getTimeTable";
//$r="[\"ECOR 1010\",\"MATH 1004\",\"MATH 1104\",\"PHYS 1003\",\"SYSC 1005\"]";
$r="[\"SYSC 4602\",\"ELEC 2501\",\"ELEC 4705\"]";

$t = 'F';
//////// END: Testing variables////////

if($request_type == "getTimeTable"){
    $term = $t; //$_POST['term'];
    $reg = json_decode(  $r); //$_POST['registeredCourses']);
    
    $coursesTimes = array();
    for($i = 0 ; $i < sizeof($reg); $i++){
        $times = $db->getCourseTimes($reg[$i],$term);
        $coursesTimes[$reg[$i]] = $times;
    }
//    print_r($coursesTimes);
//    $tt = new TimeTable();
//    $tt->buildTimeTables($coursesTimes);
//    echo 'tel7as 6eez ghadia';
    
    
}


///////////////////////////////////////////////
//                  FUCNTIONS               ///
///////////////////////////////////////////////

function isPreqYearSat($courseName){
    global $db;
	$prereq = $db->getCoursePrereq($courseName);
	$prereqYear = trim($prereq['PRE_YEAR']);
	
		//$preYear = (float)$prereqYear;		
	if ($prereqYear <= $yearStand){
			return true;
		}else{
            return fales;
        }
}


// checks the courses prerequisite courses
// return true: if all course prerequisities are met. return false otherwise.
function isCourseSatisfied($courseName,$checkedCourses){
    global $db;
	$prereq = $db->getCoursePrereq($courseName);
    if(!isPreqYearSat($courseName)){
        return false;
    }
    if(($prereq["PRE_CRSE"] == undefined || $prereq["PRE_CRSE"] == '')){
        return True;
    }else{
        
        $preCrse = $prereq["PRE_CRSE"];            //parse the PRE_CRSE first 
        $preCrse = str_replace('(','',$preCrse);$preCrse = str_replace(')','',$preCrse);
        $preAnd = explode(' and ',$preCrse);    //get AND prerequisites
        $sat = True;   
        for($i = 0; $i< sizeof($preAnd); $i++){
            $preOR = explode(' or ',$preAnd[$i]);      //get OR prerequisites
            for($j=0; $j < sizeof($preOR); $j++){
                if(in_array($preOR[$j],$checkedCourses)){  // one of the OR is found
                    break;
                }
                if($j == (sizeof($preOR)-1)){
                   $sat = False;
                }
            }
            if($sat == False){
                return False;
            }
        }
    }
    return True;
}


	



// // FOR TESTING ONLY
//$request_type = $_GET['typeofrequest'];
//if($request_type == "test"){
//	$major = "sysc";
//	$sql="SELECT * FROM ".$major;
//	$courses = $db->execute($sql);
//	
//	// $jcourses= json_encode($courses);
//	$allCoursesInfo = array();
//	foreach($courses as &$c){
//		$fullname = $c['CRSE_ID'];
//		$info = getCourseInfo($fullname);
//		if(sizeof($info)==0){ // if course is not found in the big course table
//			$allCoursesInfo[] = $c;
//		}else{
//			$allCoursesInfo[] = array_merge($c,$info);
//		}
//	}
//
//	echo json_encode($allCoursesInfo);
//	
//}



?>
