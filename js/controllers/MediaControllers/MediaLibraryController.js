(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('MediaLibraryController', MediaLibraryController);

    MediaLibraryController.$inject = ['$rootScope', '$scope', '$state', 'settings', '$cookies', '$window', 'mediaApiService'];

    function MediaLibraryController($rootScope, $scope, $state, settings, $cookies, $window, mediaApiService) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });
        var userData = JSON.parse($cookies.get('globals'));

        var medialist = {};

        var imageArray = [];
        var videoArray = [];
        var pdfArray = [];


        initController();

        $scope.tabName = "tab1";

        function initController() {
            loadMediaList();
        }

        function loadMediaList() {
            mediaApiService.GetMediaList(userData)
                .then(function(data) {
                    $rootScope.medialist = data;

                    //console.log(data);
                    data.forEach(function(item) {
                        if (item.contentType == 'image/jpeg' || item.contentType == 'image/png') {
                            imageArray.push(item);
                        } else if (item.contentType == 'application/pdf') {
                            pdfArray.push(item);
                        } else {
                            videoArray.push(item);
                        }
                    })
                    $scope.imagelist = imageArray;
                    $scope.videolist = videoArray;
                    $scope.pdflist = pdfArray;

                    console.log($scope.imagelist);
                    console.log(videoArray);
                });
            $scope.listFiltered = $rootScope.pdflist;
        }

        /*pdf search function */
        $scope.selectedTab = "tab1";
        $scope.tabselected = function(tab) {
            $scope.selectedTab = tab;
            console.log(tab);
        }

        /* */


        $scope.viewMedia = function(item) {
            //console.log(item.id);
            mediaApiService.ViewMedia(item.id, userData)
                .then(function(data) {
                    getMeta(data.src);
                    $rootScope.mediaItem = data;
                    // console.log(data);

                });
        }

        // getMeta("https://vegashero.co/wp-content/uploads/2016/01/netent-iframe-demo-games-url-format-update.jpg");
        //  getFileSize("https://vegashero.co/wp-content/uploads/2016/01/netent-iframe-demo-games-url-format-update.jpg");

        function getMeta(url) {
            var img = new Image();
            img.src = url;
            img.addEventListener("load", function() {

                $rootScope.img_dimension = this.naturalWidth + ' * ' + this.naturalHeight;
            });


            /*      var req = $.ajax({
                                type: "HEAD",
                                url: url,
                                success: function () {
                                    //$('sizeKB').html(req.getResponseHeader("Content-Length")) ;
                                    console.log(Math.round(req.getResponseHeader("Content-Length")/1024)+'kb');
                                }
                            });*/
        }
        /*
        var xhr = $.ajax({
          type: "HEAD",
          url: "https://vegashero.co/wp-content/uploads/2016/01/netent-iframe-demo-games-url-format-update.jpg",
          success: function(msg){
            alert(xhr.getResponseHeader('Content-Length') + ' bytes');
            console.log(msg);
          }
        });*/


        /*
        function getFileSize(url)
        {
            var fileSize = '';
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false); // false = Synchronous

            http.send(null); // it will stop here until this http request is complete

            // when we are here, we already have a response, b/c we used Synchronous XHR

            if (http.status === 200) {
                fileSize = http.getResponseHeader('content-length');
                console.log('fileSize = ' + fileSize);
            }

            return fileSize;
        }
        function getSize(url)
        {
        //	var myFSO = new ActiveXObject("Scripting.FileSystemObject");
        	var filepath = url;
        	var thefile = myFSO.getFile(filepath);
        	var size = thefile.size;
        	alert(size + " bytes");
        }*/
        $scope.deleteMedia = function(mediaId) {
            // console.log(mediaId);
            mediaApiService.DeleteMedia(userData, mediaId.toString())
                .then(function(status) {
                    //  $rootScope.mediaItem = data;
                    // console.log(status);
                    $state.reload();
                    toastr.success('Successfully Deleted the record');
                });

        }




    }

})();