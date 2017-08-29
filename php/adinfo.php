<?php
$appData = json_decode($_POST['appData'], true);
//$m1 = json_decode($_POST['m1'], true);
//echo 'userName: '.$userName . ' '. $pass;
if(!$appData){
    exit();
}
var_dump($appData);

/*$regional = fopen('../pdfFiles/us-regional.xml', 'w') or die('unable to open file');
$txt = '<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE fda-regional:fda-regional SYSTEM "http://www.accessdata.fda.gov/static/eCTD/us-regional-v3-3.dtd">
<?xml-stylesheet href="http://www.accessdata.fda.gov/static/eCTD/us-regional.xsl" type="text/xsl"?>
<fda-regional:fda-regional dtd-version="3.3" xmlns:fda-regional="http://www.ich.org/fda" xmlns:xlink="http://www.w3c.org/1999/xlink">
  <admin>
    <applicant-info>'."\n";

$txt .= '<id>'.$appData['appID'].'</id>'."\n";
$txt .='<company-name>'.$appData['companyName'].'</company-name>'."\n";
$txt .='<submission-description>'.$appData['description'].'</submission-description><applicant-contacts><applicant-contact>'."\n";
$txt .='<applicant-contact-name applicant-contact-type="fdaact3"></applicant-contact-name>'."\n";
$txt .='<telephones><telephone telephone-number-type="fdatnt1">3016777737</telephone></telephones>'."\n";
$txt .='<emails><email>admin@humphriespcc.com</email></emails> </applicant-contact></applicant-contacts>'."\n";
$txt .=' </applicant-info></admin>'."\n";
$txt .='</fda-regional:fda-regional>';

fwrite($regional, $txt);
fclose($regional);*/
//var_dump($m1)
?>
