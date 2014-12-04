<?php
class Timetable{
    public $allTabels = array(); // an array of all the conflect free tables
    function __construct(){
        $this->allTabels = array();

    }
    

    
    // Build a timetable from the giver list of courses in a specific term.
    // the function will check the courses times and come up with a conflict free time table
    public function buildTimeTables($courses){
//        print_r($courses);
        $t = $this->buildEmptyTimeTable();
//        uasort($courses,array("Timetable","cmp")); // sort the courses from the course with the least sections (lectures + labs)

        $this->buildTable($t,$courses);
//        echo PHP_EOL.PHP_EOL.'Solutions count='.sizeof($this->allTabels).PHP_EOL;
//        print_r($this->allTabels);
        echo json_encode($this->allTabels);
    }
    
    //recursive backtracking function
    private function buildTable($table,$courses){ 
//        print_r($courses);
//        echo '---------------------------------------'.PHP_EOL;
//        echo '$courses>'.sizeof($courses).PHP_EOL;
        
        if(sizeof($courses) != 0){          // condition to stop recursing and return
            foreach ($courses as $name => $course){     // try out every course left (lecture+lab), if non fit then backtrack                           
                $lectures = $this->getLectures($course);        // get only the course lecture sections
//                echo '    $course>'.$name.PHP_EOL;
//                echo '    $lectures>'.sizeof($lectures).PHP_EOL;
                for($le = 0; $le < sizeof($lectures); $le++){      //tryout every lecture section
                    $lecture = $lectures[$le];
//                    echo '           $lecture>'.$lecture['Id'];
//                    print_r($table);
                    if(!$this->isSessionFull($lecture) && $this->isTimeAvailable($table,$lecture)){
//                        echo '   :: true>'.PHP_EOL;
                        $newTable = $table;
                        $this->addToTable($newTable,$lecture);
                        
                        $labs = $this->getSectionLabs($this->getLabs($course),$lecture);  // get only the labs/tut for the lecture section                        
                        if(sizeof($labs) ==0){      //if acourse doesn't have labs/tut then just add the lecture
                            $coursesLeft = $courses;
                            unset($coursesLeft[$name]);
                            $this->buildTable($newTable,$coursesLeft);
                        }else{
                            for($la = 0; $la < sizeof($labs); $la++){  // tryout every lab for the registered lecture
                                if(!$this->isSessionFull($labs[$la]) && $this->isTimeAvailable($newTable,$labs[$la])){
                                    $anotherTable = $newTable;
                                    $this->addToTable($anotherTable,$labs[$la]);
                                    $coursesLeft = $courses;
                                    unset($coursesLeft[$name]);
                                    $this->buildTable($anotherTable,$coursesLeft);
                                } //end if labAvailable
                                if(sizeof($this->allTabels) >= 10){ //limit the solutions to 10 only
                                    return;
                                }
                            }// end for labs
                        }
                        
//                        echo '         <<backtrack'.PHP_EOL;
                    }// end if lectureAvailable 
                }               
            }
        }else{ // No more courses to add, a solution is found; save it and backtrack for other solutions
            if($this->isTableNew($table)){
                $this->allTabels[] = $table;
//                echo sizeof($this->allTabels);
            }
//            echo '>>>>IM HEREE'.PHP_EOL;
            return True;
        }
//        echo '>>>>Done one loop'.PHP_EOL;
        return False;
    }
    

    // fill a 2d table with false
    // false is empty.. true is filled
    private function buildEmptyTimeTable(){
        $halfs =array();
        for($h = 8.5; $h<21;$h+=0.5){
            $halfs[strval($h)] = False;
        }
        $t['M'] = $halfs;
        $t['T'] = $halfs;
        $t['W'] = $halfs;
        $t['R'] = $halfs;
        $t['F'] = $halfs;
        return $t;
    }
    
//    set time slot in a table to True
    private function addToTable(&$table,$session){
        if(!$this->isTimeAvailable($table,$session)){
            return False;
        }
        
        $start['orig'] = $session['START_TIME'] - 5;     // rounding to half hours by taking 5 min
        $end['orig'] = $session['END_TIME'] + 5;     // rounding to half hours by adding 5 min
        
        // convert minutes to hours for start time
        $start['hours'] = floor($start['orig']/100) + ($start['orig']%100)/60;
        $end['hours'] = floor($end['orig']/100) + ($end['orig']%100)/60;
            
        $days = str_split($session['DAYS']);
        
//        echo 'Add id ='.$session['Id'].PHP_EOL;
//        print_r($days);
//        echo $start['hours'] .'-'. $end['hours'].PHP_EOL;
            
        for ($i = 0; $i < sizeof($days); $i++){
            for($t = $start['hours'] ; $t < $end['hours']; $t+=0.5){
                $table[$days[$i]][strval($t)] = $session['Id']; // set time slot to full=True
            }     
        }    
    }
    
    // return true if course time is available
    // return false if course time is NOT available
    private function isTimeAvailable($table,$session){
        $start['orig'] = $session['START_TIME'] - 5;     // rounding to half hours by taking 5 min
        $end['orig'] = $session['END_TIME'] + 5;     // rounding to half hours by adding 5 min
        
        // convert minutes to hours for start time
        $start['hours'] = floor($start['orig']/100) + ($start['orig']%100)/60;
        $end['hours'] = floor($end['orig']/100) + ($end['orig']%100)/60;
        
        $days = str_split($session['DAYS']);
        for ($i = 0; $i < sizeof($days); $i++){
            for($t = $start['hours'] ; $t < $end['hours']; $t+=0.5){
                if($table[$days[$i]][strval($t)] != False){
                    return False;
                }
            }     
        }
            
        return True;
    }
    
    // return on labs and tutorials from course sessions
    private function getLabs($sessions){
        $arr = array();
        for ($i = 0; $i < sizeof($sessions); $i++){
            if($sessions[$i]['INSTR_TYPE'] == 'LAB' || $sessions[$i]['INSTR_TYPE'] == 'TUT'){
                $arr[] = $sessions[$i];
            }            
        }
        return $arr;
    }
    
    private function getLectures($sessions){
        $arr = array();
        for ($i = 0; $i < sizeof($sessions); $i++){
            if($sessions[$i]['INSTR_TYPE'] == 'LEC'){
                $arr[] = $sessions[$i];
            }            
        }
        return $arr;
    }
    
    private function getSectionLabs($allLabs,$lecture){
        // if there is no labs,
        if(sizeof($allLabs) == 0){
            return $allLabs;
        }
        
        // if labs has no specific section(check for L in lab section)
        if(str_split($allLabs[0]['SEQ'])[0] == 'L'){
            return $allLabs;
        }
        
        $arr = array();
        for ($i = 0; $i < sizeof($allLabs); $i++){
            if(str_split($allLabs[$i]['SEQ'])[0] == $lecture['SEQ']){
                $arr[] = $allLabs[$i];
            }            
        }
        return $arr;
    }
    
    private function isTableNew($table){
        $all = $this->allTabels;
        $keys = array_keys($table);
        
        for ($i = 0; $i < sizeof($all); $i++){  
            $diff = array();
            for($j = 0; $j < sizeof($keys); $j++){
                $diff[] = array_diff($all[$i][$keys[$j]],$table[$keys[$j]]);
            }
            $unique = False;
            for($d=0;$d<sizeof($diff);$d++){
                if(sizeof($diff[$d]) != 0){
                    $unique = True;  
                }
            }
            if(!$unique){
                // an identical array exist
                return False;
            }
            
        }
        return True;
    }
    
    //compare function to be used for uksort() to sort courses array starting from course with less sections(lecture+labs) 
    private static function cmp($a,$b){
        $asize = sizeof($a);
        $bsize = sizeof($b);
        return ($asize < $bsize) ? -1 : 1;
    }
    
    // checkes if a course capacity is full by using room_cap - reg_count
    // true: course is full
    // false: course is not full
    function isSessionFull($session){
        $cap = $session['ROOM_CAP'];
        $reg = $session['REG_COUNT'];
        
        // when cap is zero it means there is no limit on the course, and always not full
        // when the registeration didn't reach the cap, then there is spots left for registeration
        if($cap == 0 || ($cap - $reg)>=0){ 
            return false; // course not full
        }
        return true;    // course is full
    }

}
?>