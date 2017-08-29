/*angular.module('MetronicApp').controller('PostListController', ['$rootScope', '$scope', 'settings', '$http', function($rootScope, $scope, settings, $http) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;

        console.log($rootScope.userData);
    });

    // $scope.showall() = showall;


    (function showall() {
        console.log($rootScope.userData.uid);

        $http({
            method: 'GET',
            url: 'http://192.168.88.187:8080/ecvcms/a/content/taxonomyTermFieldData/list.json?uid=' + $rootScope.userData.uid +
                "&apptoken=" + $rootScope.userData.appToken,
        }).success(function(data, status) {
            //  $scope.taxonomyTermFieldDataList = data.taxonomyTermFieldDataList;
            console.log(data);
        }).error(function(data, status) {
            // Some error occurred
            $scope.error = data;
            console.log(status + "!fail cause " + $scope.error);
        });
    }());

}]);*/
(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PostListController', PostListController);

    PostListController.$inject = ['PostApiService', 'categoryApiService', '$filter', '$rootScope', '$scope', '$state', 'settings',
     '$cookies', 'deletePostModal', '$window' ,'storeService'];

    function PostListController(PostApiService, categoryApiService, $filter, $rootScope, $scope, $state, settings, 
    $cookies, deletePostModal, $window,storeService) {

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

        /*display edit and delete buttons */
        $scope.open = false;
        //console.log(userData);
        // console.log(use.uid);
        var posts = {};

        $scope.pageno = 1;
        $scope.pagesize = { id: '10' };
      
        /*  $scope.main = {
                page: 1
    
            };*/
        // posts.list = null;

        initController();


        function initController() {
            loadPostList();
        }

        function loadPostList() {

            PostApiService.GetPostList(userData, $scope.pageno, $scope.pagesize.id)
                .then(function(data) {
                    $rootScope.posts = data.list;
                    $scope.totalpages = Math.ceil(data.recordsTotal / data.pageSize);
                    $scope.itemsPerPage = data.pageSize;
                   // $scope.pagesize = data.pageSize;
                    //console.log(data.list);
                   
                  
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

         /*search list*/ 
        $scope.listItemsFiltered = $rootScope.posts;

        /******pagination */
 

        $scope.nextPage = function() {

            if ($scope.pageno < $scope.totalpages) {
                $scope.pageno++;
                // $scope.loadPage();
                loadPostList();
            }
        };

        $scope.previousPage = function() {
            if ($scope.pageno > 1) {
                $scope.pageno--;
                // $scope.loadPage();
                loadPostList();
            }
        };

        $scope.newlist = function(id) {
            $scope.pageno = 1;
            loadPostList();
            console.log(id);

        };

      
    }

})();