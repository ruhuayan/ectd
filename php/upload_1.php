<?php
session_start();
if(!isset($_SESSION['user'])) header("Location: login_1.php");
//echo $_SESSION['user'];
if ( !empty( $_FILES ) ) {
    $tempPath = $_FILES[ 'fileToUpload' ][ 'tmp_name' ];
    //$uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    $uploadPath = $_SERVER['DOCUMENT_ROOT'] ."/pdfEditor/uploads/". $_FILES[ 'fileToUpload' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );

    $answer = array('fid'=>rand(), 'filename'=> $_FILES[ 'fileToUpload' ][ 'name' ]);
    $json = json_encode( $answer );

    echo $json;

} else {
    //echo 'No files';
}
?>
<!DOCTYPE html>
<html>
    <head>
  <title>Bootstrap Example</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.4/angular.min.js"></script>
  <script src="../../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js"></script>
</head>
<body ng-app="MetronicApp">

<!--<form action="upload_1.php" method="post" enctype="multipart/form-data">

    <input type="file" name="fileToUpload" id="fileToUpload">
    <input type="submit" value="Upload" name="submit">
</form>-->
<div class="row" ng-controller="FileUploadCtrl" nv-file-drop="" uploader="uploader" filters="queueLimit, customFilter">
    
    <div class="col-md-7">
        <!-- BEGIN: ACCORDION DEMO -->
        <div class="portlet light bordered">
            <div class="portlet-title">
                <div class="caption font-green-sharp">
                    <i class="icon-settings font-green-sharp"></i>
                    <span class="caption-subject bold uppercase">Upload queue</span>
                    <span class="caption-helper">Queue length: {{ uploader.queue.length }} of Maximum 10 files</span>
                </div>
                
            </div>
            <div class="portlet-title">
                <div class="caption font-green-sharp">
                    <input type="file" nv-file-select="" uploader="uploader" accept="application/pdf" multiple />
                </div>
            </div>
            <div class="portlet-body">
                <div class="table-scrollable table-scrollable-borderless">
                    <table class="table table-hover table-light">
                        <thead>
                            <tr class="uppercase">
                                <th width="50%">Name</th>
                                <th ng-show="uploader.isHTML5">Size</th>
                                <th ng-show="uploader.isHTML5">Progress</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="item in uploader.queue">
                                <td>
                                    <strong>{{ item.file.name }}</strong>
                                </td>
                                <td ng-show="uploader.isHTML5" nowrap>{{ item.file.size/1024/1024|number:2 }} MB</td>
                                <td ng-show="uploader.isHTML5">
                                    <div class="progress progress-sm" style="margin-bottom: 0;">
                                        <div class="progress-bar progress-bar-info" role="progressbar" ng-style="{ 'width': item.progress + '%' }"></div>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <span ng-show="item.isSuccess" class="text-success">
                                        <i class="glyphicon glyphicon-ok"></i>
                                    </span>
                                    <span ng-show="item.isCancel" class="text-info">
                                        <i class="glyphicon glyphicon-ban-circle"></i>
                                    </span>
                                    <span ng-show="item.isError" class="text-danger">
                                        <i class="glyphicon glyphicon-remove"></i>
                                    </span>
                                </td>
                                <td nowrap>
                                    <button type="button" class="btn btn-success btn-xs" ng-click="item.upload()" ng-disabled="item.isReady || item.isUploading || item.isSuccess">
                                        <span class="glyphicon glyphicon-upload"></span> Upload </button>
                                    <button type="button" class="btn btn-warning btn-xs" ng-click="item.cancel()" ng-disabled="!item.isUploading">
                                        <span class="glyphicon glyphicon-ban-circle"></span> Cancel </button>
                                    <button type="button" class="btn btn-danger btn-xs" ng-click="removeUpFile(item)">
                                        <span class="glyphicon glyphicon-trash"></span> Remove </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div>
                    <p>Queue progress:</p>
                    <div class="progress progress-sm" style="">
                        <div class="progress-bar progress-bar-info" role="progressbar" ng-style="{ 'width': uploader.progress + '%' }"></div>
                    </div>
                </div>
                <button type="button" class="btn btn-success btn-s" ng-click="uploader.uploadAll()" ng-disabled="!uploader.getNotUploadedItems().length">
                    <span class="glyphicon glyphicon-upload"></span> Upload all </button>
                <button type="button" class="btn btn-warning btn-s" ng-click="uploader.cancelAll()" ng-disabled="!uploader.isUploading">
                    <span class="glyphicon glyphicon-ban-circle"></span> Cancel all </button>
                <button type="button" class="btn btn-danger btn-s" ng-click="removeQueue(uploader.queue)" ng-disabled="!uploader.queue.length">
                    <span class="glyphicon glyphicon-trash"></span> Remove all </button>
            </div>
            
            <div class="portlet-body upload-result-files" ><div id="uploadFileTree"> </div> 
            </div>
        </div>
        <!-- END: ACCORDION DEMO -->
    </div>
</div>
<script>
    var MetronicApp = angular.module("MetronicApp", []);
    MetronicApp.controller('FileUploadCtrl', function ($scope, FileUploader){
        var uploader = $scope.uploader = new FileUploader(
        {
            url: 'upload_1.php'
        });
        // FILTERS
        uploader.filters.push(
        {
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options)
            {
                return this.queue.length < 10;
            }
        });
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options)
        {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem)
        {
            console.info('onAfterAddingFile', fileItem);
        };
     
        uploader.onCompleteItem = function(fileItem, response, status, headers)
        {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function()
        {
            console.info('onCompleteAll');
        };
        console.info('uploader', uploader);
    });
</script>
</body>
</html>