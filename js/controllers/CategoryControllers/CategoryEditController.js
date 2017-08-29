(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('CategoryEditController', CategoryEditController);

    CategoryEditController.$inject = ['PostApiService', 'categoryApiService', '$rootScope', '$scope', '$state', 'settings', '$cookies', '$stateParams', 'shortHistory','$window'];

    function CategoryEditController(PostApiService, categoryApiService, $rootScope, $scope, $state, settings, $cookies, $stateParams, shortHistory ,$window) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        /*To remove local storage of any previous stored Id's */
        $scope.$on('$stateChangeStart', function(event, next, current) {
            $window.localStorage.removeItem("id");
            console.log("in location change");
        });


        var oneCategory = {};
        var categCopy = {};
        var userData = JSON.parse($cookies.get('globals'));
      //  var categId = $stateParams.id;
       // console.log(categId);

         console.log($state.params.id);
        if ($state.params.id) {
            $window.localStorage.setItem("id", $state.params.id);
            //  $scope.postId = $state.params.id;
            console.log("storparams" + $state.params.id);
        }

        var loc = $window.localStorage.getItem("id");
        if (loc) {
            $scope.categId = $window.localStorage.getItem("id");
            $state.params.id = $scope.categId;
            console.log("storage" + $scope.categId);
        }







        $scope.showReturnBtn = ($scope.categId !== null && $scope.categId !== undefined) ? true : false;



        loadCategoryList();

        //console.log("currentid ---" + postId)
        if ($scope.categId !== undefined) {
            loadOneCategory($scope.categId, userData);

        }

        function loadOneCategory(categId, userData) {
            categoryApiService.GetOneCategory(categId, userData)
                .then(function(data) {
                    $scope.oneCategory = data;
                    categCopy = angular.copy(data);
                    if (data.parent.parentId) {
                        $scope.selectedId = (data.parent.parentId).toString();
                        //console.log(true);
                    } else {
                        $scope.selectedId = '';
                        console.log("one" + $scope.selectedId);
                    }
                });
        }

        function loadCategoryList() {
            var domain = {
                "domain": {
                    "id": 1
                }
            };

            categoryApiService.GetCategoryList(userData, domain)
                .then(function(data) {

                    if ($scope.categId) {
                        $rootScope.categoryList = $.grep(data, function(e) {
                            return e.id != $scope.categId;
                        });

                    } else {
                        $rootScope.categoryList = data;
                    }
                    // $rootScope.categoryList = data;


                    //  $rootScope.selectedId ="0";
                    //console.log($rootScope.selectedId);
                });

        }


        $scope.update = function() {
            console.log($scope.selectedId);

            if ($scope.selectedId === null) {
                $scope.selectedId = 0;
                //console.log($scope.selectedId);
            }
            console.log($scope.oneCategory);
            var obj = $scope.oneCategory;
            obj.parent.parentId = $scope.selectedId;
            console.log(obj);
            /*    var post = {
                id: $scope.onePost.id,
                postContent: $scope.onePost.postContent,
                postTitle: $scope.onePost.postTitle
            };
            */
            // console.log(post);
            categoryApiService.CategoryUpdate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully updated the record');
                    // $scope.posts = data;

                });

            /**updating child  */
            let parentid = categCopy.parent.parentId;
            let catId = categCopy.id;
            if (parentid != $scope.selectedId) {


                //  console.log(parentid +"---"+catId);
                var result = $.grep($rootScope.categoryList, function(e) {
                    return e.parent.parentId == catId;
                });

                //console.log($scope.selectedId);
                var newobj = result;
                for (var i = 0; i < result.length; i++) {

                    newobj[i].parent.parentId = parentid


                    categoryApiService.CategoryUpdate(userData, newobj[i])
                        .then(function(status) {
                            console.log(status);
                        });
                }

            } //end if
        };


        $scope.save = function() {
            console.log($scope.oneCategory);
            console.log($scope.selectedId);
            var obj = newCateg();
            console.log(obj);

            categoryApiService.CategoryCreate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully updated the record');
                    // $scope.posts = data;

                });


        };

        $scope.returnBack = function() {
            $state.go('categories');
        };

        /////creating a categoryobj

        function newCateg() {
            //console.log($scope.selectedId);
            var categobj = {

               
                "data": {

                    "termName": $scope.oneCategory.data.termName,
                    "type": "category",
                    "language": {
                        "id": 9
                    },
                    "fieldData": {
                        "weight": 2,
                        "changed": 0
                    }
                },
                "parent": {
                    "parentId": $scope.selectedId
                }
            };

            return categobj;
        }

        /** */

    }

})();