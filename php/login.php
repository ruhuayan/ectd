<?php
$userName = filter_input(INPUT_POST, 'userName', FILTER_SANITIZE_STRING);
$pass = filter_input(INPUT_POST, 'pass', FILTER_SANITIZE_STRING);

if($userName) echo json_encode(array('userName'=>$userName));