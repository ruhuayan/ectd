(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('MediaUploadController', MediaUploadController);

    MediaUploadController.$inject = ['$rootScope', '$scope', '$http','$state', 'settings', '$cookies', '$window', 'mediaApiService'];

    function MediaUploadController($rootScope, $scope, $state,$http, settings, $cookies, $window, mediaApiService) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode 'fileUpload'
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });
        var userData = JSON.parse($cookies.get('globals'));

        var medialist = {};


        // initController();


        function initController() {
            loadMediaList();
        }

        function loadMediaList() {
            mediaApiService.GetMediaList(userData)
                .then(function(data) {
                    $rootScope.medialist = data;
                    console.log(data);
                });

        }
     /*  $scope.uploadFile = function(file) {
             var uploadUrl ='http://192.168.88.187:8080/ecvcms/a/medias/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken;
     */   //    fileUpload.uploadFileToUrl(file,uploadUrl);
            //console.log(file);
           /* mediaApiService.CreateMedia(userData, file)
                .then(function(data, status) {
                    // $rootScope.medialist = data;
                    console.log(status);
                });*/
           
         //   }



       // };

        $scope.reset = function() {
            $scope.file ='';
            $scope.resetDropzone();
        };


    /*    $(document).ready(function() {
            Dropzone.autoDiscover = false;
            $("#file-form").dropzone({
                paramName: 'file',
                clickable: true,
                maxFilesize: 1,
                uploadMultiple: false,
                autoProcessQueue: false,
                accept: function(file, done) {
                    var reader = new FileReader();
                    reader.onload = handleReaderLoad;
                    reader.readAsDataURL(file);

                    function handleReaderLoad(evt) {
                        document.getElementById("id_base64_data")
                            .setAttribute('value', evt.target.result);
                        document.getElementById("id_base64_name")
                            .setAttribute('value', file.name);
                        document.getElementById("id_base64_content_type")
                            .setAttribute('value', file.type);
                        var form = $('#file-form');
                            $.pjax( {
                                 method: "POST",
                                 container: "#pjax-container", 
                                 timeout: 2000,
                                 url: "/upload/",
                                 data: form.serialize(),
                             });
                        console.log(file);
                       $scope.uploadFile(file);
                        //console.log(evt.target.result);
                    }
                    done();
                },
            });
        });*/

   $scope.uploadFile = function(){
               var file = $scope.file;
               
               //console.log('file is ' );
               console.log(file);
               
            /*   var uploadUrl ='http://192.168.88.187:8080/ecvcms/a/medias/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken;*/

            //  fileUpload.uploadFileToUrl(file,uploadUrl);
            if( file != undefined && file != null){
                console.log(file);
           mediaApiService.CreateMedia(userData, file)
                .then(function(response) {
                    // $rootScope.medialist = data;
                    console.log(response);
                     toastr.success('Successfully uploaded the image');
                });
            }else{
                console.log("upload image");
                toastr.warning('Select the image to upload');
                
            }
   };



    }

})();