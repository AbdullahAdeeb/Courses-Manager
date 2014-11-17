<?php
class database{
	
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
	// echo	$sql; // FOR TESTING ONLY
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
	
	// function getCourses($major){
		// $sql="SELECT * FROM ".$major;
		// return $this->execute($sql);
	// }
	
	// function getCourseInfo($dept,$id){
		// $sql="SELECT * FROM courses where SUBJ LIKE'".department."' AND CRSE=".idnum." AND INSTR_TYPE LIKE 'LEC'";
		// return execute($sql);
	// }
	
	function getError(){
		return mysqli_error($this->connection);
	}
}
?>
