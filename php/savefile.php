<?php
$name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
$tempname = filter_input(INPUT_POST, 'tempname', FILTER_SANITIZE_STRING);
if(!$name || !$tempname){
    echo 'no file';
    exit;
}
//rename("pdfFiles/".$name, "pdfFiles/".$name);
rename("../pdfFiles/".$name, '../pdfFiles/new_'.rand().$name);
rename("../pdfFiles/".$tempname, "../pdfFiles/".$name);