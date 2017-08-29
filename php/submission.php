<?php
/*$title = filter_input(INPUT_POST, 'title', FILTER_SANITIZE_STRING);
$product = filter_input(INPUT_POST, 'product', FILTER_SANITIZE_STRING);
if(!$product || !$title){
    echo 'no file';
    exit;
}*/
$appData = json_decode($_POST['appData'], true);

$answer = array('description'=> $appData['description'], 'folder' => $appData['folder'], "version"=>$appData['version']);
if(!empty($appData["appID"])){
    $answer["appID"] = $appData["appID"];
}else $answer["appID"] = rand();

$json = json_encode( $answer );
echo $json;
//var_dump($appData);
