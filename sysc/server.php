<?php
require_once("db.php");
$db = new database();
$request_type = $_POST['typeofrequest'];


///////////////////////////////////////////////
//                  FUCNTIONS               ///
///////////////////////////////////////////////

function getCourses($m){
    global $db;
    $sql="SELECT * FROM ".$m;
	$c = $db->execute($sql);
    return $c;
}

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

function isCourseSatisfied($courseName,$checkedCourses){
	$prereq = getCoursePrereq($courseName);
    if($prereq["PRE_CRSE"] == undefined || $prereq["PRE_CRSE"] == ''){
        return True;
    }else{
        
        $preCrse = $prereq["PRE_CRSE"];            //parse the PRE_CRSE first 
        $preCrse = str_replace('(','',$preCrse);$preCrse = str_replace(')','',$preCrse);
        $preAnd = explode(' and ',$preCrse);    //get AND prerequisites
        $sat = True;   
//        print_r($checkedCourses);
        for($i = 0; $i< sizeof($preAnd); $i++){
            $preOR = explode(' or ',$preAnd[$i]);      //get OR prerequisites
            for($j=0; $j < sizeof($preOR); $j++){
//                echo $preOR[$j];
                if(in_array($preOR[$j],$checkedCourses)){  // one of the OR is found
//                    echo 'found';
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



/////////////////////////////////////////////////
/////            Request Handlers           ////
////////////////////////////////////////////////
$request_type = $_POST['typeofrequest'];

if($request_type == "login"){
		$login = $_POST['login'];
		$password = $_POST['password'];
		$major = $_POST['major'];
		//start cookie here... no need to send major in header just put it in a cookie session
		header("Location: coursestable.php?major=".$major);

}

if($request_type == "getCourses"){
	$major = $_POST['major'];
    $courses = getCourses($major);
    
	$allCoursesInfo = array();
	foreach($courses as &$c){
		$fullname = $c['CRSE_ID'];
		$info = getCourseInfo($fullname);
        $prereq = getCoursePrereq($fullname);
        
        $c['info']=$info;
        $c['prereq']=$prereq;
        $allCoursesInfo[] = $c;
	}
	echo json_encode($allCoursesInfo);
}
////$request_type = "getSatisfiedCourses";
if($request_type == "getSatisfiedCourses"){

    $major = $_POST['major'];
    $coursesArray = getCourses($major);

    $enabledCouses = array();
    ////////////
    //UNCOMMENT THIS PART needs checkedCourses and coursesArray
    $checkedCourses = json_decode($_POST['checkedCourses']);
    for($c = 0; $c < sizeof($coursesArray);$c++){
        $name = $coursesArray[$c]["CRSE_ID"];
        if(!in_array($name,$checkedCourses)){     // false: course is unchecked
            //validate it's prereq with the checkedcourses
             
            $sat = isCourseSatisfied($name,$checkedCourses);
//            echo $name.'('.$sat.') :: ';
            if($sat){
//                echo $sat." :: ";
                array_push($enabledCouses,$name);
            }else{
//                echo $sat." >> ";
            }
        }else{ // True: course is in checkedCourses.. make sure it's enabled
            array_push($enabledCouses,$name);
//            echo 'coursesArray='.$name;
        }
        
    }
    echo json_encode($enabledCouses);
}
    ///////////////////////////
//    JS PART
//        if(this.checkedCourses.indexOf(name) == -1 ){ // True: course is unchecked
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
//}
	



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
