<?php
$file = filter_input(INPUT_POST, 'file', FILTER_SANITIZE_STRING);
//$width =filter_input(INPUT_POST, 'width', FILTER_SANITIZE_NUMBER_INT);
if(!$file){
    echo 'no file';
    exit;
}

$operations = json_decode($_POST['data'], true);
/*echo 'file: '.$file;
echo '<br />pdf width: '.$width;
var_dump($operations);*/
if(!$operations){
    echo 'file not edit';exit;
}

require_once('FPDF/fpdf.php'); 
require_once('FPDI/fpdi.php'); 
$pdf = new FPDI();

$pageNum = $pdf->setSourceFile('pdfFiles/'.$file); 
if(!$pageNum){
    echo 'pdf no exist'; exit;
}
for($i =1; $i<=$pageNum; $i++){
    $pdf->AddPage(); 
    $tplIdx = $pdf->importPage($i);
    $pdf->useTemplate($tplIdx, 0, 0, 0, 0, true); 
    
    /*if(!isset($scale)) {
        $tPos = $pdf->getTemplateSize ($tplIdx);
        $scale = $tPos['w']/$width;
    }*/
    foreach ($operations as $key => $value) {
        if($key=="appendTextOperations"){
        //var_dump($value);
            $arrlength=count($value);
            for($x=0;$x<$arrlength;$x++){
                $textEdit = $value[$x];
                if($textEdit['page']==$i){
                    //var_dump($textEdit);
                    $width = $textEdit['pw'];
                    $tPos = $pdf->getTemplateSize ($tplIdx);
                    $scale = $tPos['w']/$width;
                    $position = $textEdit["position"];                 //var_dump($position);
                    $style = $textEdit["style"];                    //var_dump($style);
                    $font= $style['bold']?'B':'';
                    if($style['italic']) $font = $font.'I';
                    $fontfamily = $style['font']=="times_roman"? 'times':'helvetica';
                    $pdf->setFont($fontfamily, $font, $style['fontSize']); 
                    //list($r, $g, $b) = sscanf($style['color'], "#%02x%02x%02x"); 
                    $rgb = $style['color'];
                    $pdf->SetTextColor($rgb[0],$rgb[1],$rgb[2]);
                    $pdf->setXY($position['x']*$scale, $position['y']*$scale);
                    $pdf->Write($style['fontSize']/2, $textEdit['text']);
                }
            }
        }else if($key=="linkOperations"){
            $arrlength=count($value);
            for($x=0;$x<$arrlength;$x++){
                $linkEdit = $value[$x];
                if($linkEdit['page']==$i){//if(!$linkEdit['uri']) break;
                   //var_dump($linkEdit);
                    $width = $linkEdit['pw'];
                    $tPos = $pdf->getTemplateSize ($tplIdx);
                    $scale = $tPos['w']/$width;
                   $box = $linkEdit['boundingBox'];
                   //$pdf->SetFillColor(0,0,0);
                   $pdf->setXY($box['left']*$scale, $box['top']*$scale);
                   //$pdf->Rect($box['left']*$scale, $box['top']*$scale, $box['width']*$scale, $box['height']*$scale, 'D' );
                   //$url = $linkEdit['uri'];
                   $url = $linkEdit['tpage']>1 ? ($linkEdit['uri'].'#page='.$linkEdit['tpage']) : $linkEdit['uri'];
                   $link = $url; 
                   $pdf->SetFont('Times');
                   $pdf->Cell($box['width']*$scale, $box['height']*$scale, '               ', 1, 0, 'R', false, $link);
                   //$pdf.Write(8, $linkEdit['uri']);
                } 
                /*if($linkEdit['uri']==$i){
                    $pdf->setLink($link);
                }*/
            }
        
        }
    }
}

$fileName = 'dn_'.rand().'.pdf'; 
$pdf->Output('pdfFiles/'.$fileName, 'F');
echo $fileName;