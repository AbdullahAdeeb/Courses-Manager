<?php
//echo 'Database<br>';
class Database{

	function __construct(){
		$host="localhost";
		$user="sysc";
		$password="syscpass";
		$db = "sysc";

		$this->connection = new mysqli($host, $user, $password, $db);

		if ($this->connection->connect_errno){
			echo "Failed to connect to MySQL: " . $this->connection->connect_error;
		}	
	}

	function execute($sql){
        //	 echo	$sql; // FOR TESTING ONLY
		 if($result = $this->connection->query($sql)){
			$rows = array();
			while($r = $result->fetch_assoc()) {
				$rows[] = $r;
			}
			return $rows;
		 }else{//we have an error, return the error message for the query
			return $this->connection->error;
		 }
	}
    
    function getCourses($m){
        $sql="SELECT * FROM ".$m;
        $c = $this->execute($sql);
        return $c;
    }

    // return only lecture times
    function getCourseInfo($fullname){

        $dept = explode(" ",$fullname)[0];
        $idnum = explode(" ",$fullname)[1];

        //Query the general course information i.e. timing and capacity
        $sql="SELECT * FROM courses where SUBJ LIKE '".$dept."' AND CRSE=".$idnum." AND INSTR_TYPE LIKE 'LEC'" ;
        $resultInfo = $this->execute($sql);
        if(sizeof($resultInfo) == 0){
            $resultInfo[0]="Unable to find course info";
        }
        return $resultInfo;
    }


    
    // param: course names
    // return: list of lectures and labs with their times 
    function getCourseTimes($fullname,$term){

        $dept = explode(" ",$fullname)[0];
        $idnum = explode(" ",$fullname)[1];

        //Query the general course information i.e. timing and capacity
        $sql="SELECT * FROM courses where SUBJ LIKE '".$dept."' AND CRSE=".$idnum." AND TERM_OFFERED LIKE '".$term."'";
        $resultInfo = $this->execute($sql);   
        if(sizeof($resultInfo) == 0){
            $resultInfo[0]="error";
        }
        print_r($resultprereq);
        return $resultInfo;
    }
    
    
    function getCoursePrereq($fullname){

        //Query the pre-requisites information for the course
        $sql="SELECT * FROM prereq where CRSE LIKE '".$fullname."'" ;
        $resultprereq = $this->execute($sql);

        //if there is no pre requisites defined for the course; return empty line
        if(sizeof($resultprereq) == 0){
            $resultprereq[0]['PRE_TEXT']="Course has no prerequisites";
        }
        
        return $resultprereq[0];
    }

    //increment the reg_count of a course $name in the parameters
    // return true upon successful registeration; false otherwise;
    function registerInCourse($courseID){
        //incremeant reg_count when course is not full
        if(!$this->isCourseFull($courseID)){
            $sql = "UPDATE courses SET REG_COUNT = REG_COUNT + 1 WHERE Id=".$courseID;
            $resultInfo = $this->execute($sql);
            return true;
        }
        return false;
    }
    
    // checkes if a course capacity is full by using room_cap - reg_count
    // true: course is full
    // false: course is not full
    function isCourseFull($courseID){
        $sql="SELECT * FROM courses where Id =".$courseID;
        $resultInfo = $this->execute($sql);
        $cap = $resultInfo['ROOM_CAP'];
        $reg = $resultInfo['REG_COUNT'];
        
        // when cap is zero it means there is no limit on the course, and always not full
        // when the registeration didn't reach the cap, then there is spots left for registeration
        if($cap == 0 || ($cap-$reg)==0){ 
            return false; // course not full
        }
        return true;    // course is full
    }
}
?>
