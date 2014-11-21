<?php
echo 'hello world';
class Timetable{
    public $allTabels = array(); // an array of all the conflect free tables
    function __construct(){
        $this->allTabels = array();
        echo 'fuck you';

    }
    
    // Build a timetable from the giver list of courses in a specific term.
    // the function will check the courses times and come up with a conflict free time table
    public function buildTimeTables($courses){
//        $t = $this->buildEmptyTimeTable();
//        $this->buildTable($t,$courses);
//        $this->getUniqueSolutions($this->allTabels);
//        echo PHP_EOL.PHP_EOL.'Solutions count='.sizeof($this->allTabels).PHP_EOL;
//        print_r($this->allTabels);
    }
    
    //recursive backtracking function
    private function buildTable($table,$courses){ 
//        print_r($courses);
        echo '---------------------------------------'.PHP_EOL;
        echo '$courses>'.sizeof($courses).PHP_EOL;
        if(sizeof($courses) != 0){
            foreach ($courses as $name => $course){                             
                $lectures = $this->getLectures($course);
//                $found = False;
                echo '    $course>'.$name.PHP_EOL;
//                echo '    $lectures>'.sizeof($lectures).PHP_EOL;
                for($l = 0; $l < sizeof($lectures); $l++){
                    $lecture = $lectures[$l];
                    echo '           $lecture>'.$lecture['Id'];
//                    print_r($table);
                    if($this->isTimeAvailable($table,$lecture)){
                        echo '   :: true>'.PHP_EOL;

////                        $labs = $this->getLabs($courses,$lecture); 
//                        // TODO: check if one of the labs is also avaiable before adding
//                        $found = True;
                        $newTable = $table;
                        $this->addToTable($newTable,$lecture);
                        
                        $coursesLeft = $courses;
                        unset($coursesLeft[$name]);
                        
                        $this->buildTable($newTable,$coursesLeft);
                        echo '         <<backtrack'.PHP_EOL;
                    }else{
                        echo '   :: false>'.PHP_EOL;
                        continue;
                    }
                }
//                if(!$found){
//                    // course could not be fit into the table, no point of continuing
//                    return False;
//                }
                
                
                
            }
        }else{ // No more courses to add, a solution is found; save it and backtrack for other solutions
            $this->allTabels[] = $table;
            echo '>>>>IM HEREE'.PHP_EOL;
            return True;
        }
        echo '>>>>Done one loop'.PHP_EOL;
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
        
        $start[orig] = $session['START_TIME'] - 5;     // rounding to half hours by taking 5 min
        $end[orig] = $session['END_TIME'] + 5;     // rounding to half hours by adding 5 min
        
        // convert minutes to hours for start time
        $start[hours] = floor($start[orig]/100) + ($start[orig]%100)/60;
        $end[hours] = floor($end[orig]/100) + ($end[orig]%100)/60;
            
        $days = str_split($session['DAYS']);
        
//        echo 'Add id ='.$session['Id'].PHP_EOL;
//        print_r($days);
//        echo $start[hours] .'-'. $end[hours].PHP_EOL;
            
        for ($i = 0; $i < sizeof($days); $i++){
            for($t = $start[hours] ; $t < $end[hours]; $t+=0.5){
                $table[$days[$i]][strval($t)] = $session['Id']; // set time slot to full=True
            }     
        }    
    }
    
    // return true if course time is available
    // return false if course time is NOT available
    private function isTimeAvailable($table,$session){
        $start[orig] = $session['START_TIME'] - 5;     // rounding to half hours by taking 5 min
        $end[orig] = $session['END_TIME'] + 5;     // rounding to half hours by adding 5 min
        
        // convert minutes to hours for start time
        $start[hours] = floor($start[orig]/100) + ($start[orig]%100)/60;
        $end[hours] = floor($end[orig]/100) + ($end[orig]%100)/60;
        
        $days = str_split($session['DAYS']);
        for ($i = 0; $i < sizeof($days); $i++){
            for($t = $start[hours] ; $t < $end[hours]; $t+=0.5){
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
    
    private function getUniqueSolutions(&$array){
        
        for ($i = 0; $i < sizeof($array) - 1; $i++){
            for ($j = $i+1; $j < sizeof($array); $j++){
                if(sizeof(array_diff($array[$i],$array[$j])) == 0){
                    // arrays are identical
                    unset($array[$i]);
                    echo '('.$i.'-'.$j.')';
//                    if($i != 0){
//                        $i--;
//                    }
                }
            }
        }
    } 
}
?>