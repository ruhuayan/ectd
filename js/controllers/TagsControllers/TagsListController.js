(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('TagsListController', TagsListController);

    TagsListController.$inject = ['TagApiService', '$filter', '$rootScope', '$scope', '$state', 'settings', '$cookies', '$window'];

    function TagsListController(TagApiService, $filter, $rootScope, $scope, $state, settings, $cookies, $window) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });


        //  console.log($cookies.get('globals'));
        // $rootScope.userD = $cookies.get('globals');
        var userData = JSON.parse($cookies.get('globals'));
        //console.log(userData);
        // console.log(use.uid);
        var tagslist = {};

        $scope.pageno = 1;
        $scope.pagesize = { id: '5' };
        /*  $scope.main = {
                page: 1
    
            };*/
        // posts.list = null;

        initController();


        function initController() {
            loadTagsList();
        }

        function loadTagsList() {

            TagApiService.GetTagsList(userData, $scope.pageno, $scope.pagesize.id)
                .then(function(data) {
                    $rootScope.tagslist = data.list;
                    console.log(data);
                   $scope.recordsTotal =data.recordsTotal;
                    $scope.totalpages = Math.ceil(data.recordsTotal / data.pageSize);
                    $scope.itemsPerPage = data.pageSize;
                  
                  //  console.log("totpages" +  data.pageSize);
                });

        }






        $scope.deletePost = function(postId) {
            //  deletePostModal.getDeleteMethod(id);
            console.log("id" + postId);
            var deleteUser = $window.confirm('Are you sure you want to delete this post ?');
            if (deleteUser) {
                //Your action will goes here
                console.log(deleteUser);
                //   alert('Yes i want to delete');
                PostApiService.DeletePost(postId, userData)
                    .then(function(response) {
                        // $rootScope.posts = data;
                        $state.go("posts").then(function() {
                            toastr.success('Succesfully Deleted the record');
                            // console.log($state);
                            $state.reload();
                        });
                    });

            }
        };


        /******pagination */

        $scope.nextPage = function() {

            if ($scope.pageno < $scope.totalpages) {
                $scope.pageno++;
                // $scope.loadPage();
                loadTagsList();
            }
        };

        $scope.previousPage = function() {
            if ($scope.pageno > 1) {
                $scope.pageno--;
                // $scope.loadPage();
                loadTagsList();
            }
        };

        $scope.newlist = function(id) {
            $scope.pageno = 1;
            loadTagsList();
            console.log(id);

        };
    }

})();