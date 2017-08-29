(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('TagEditController', TagEditController);

   TagEditController.$inject = ['TagApiService','$rootScope', '$scope', '$state', 'settings', '$cookies', '$stateParams'];

    function TagEditController(TagApiService, $rootScope, $scope, $state, settings, $cookies, $stateParams) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        var oneTag= {};
        var categCopy = {};
        var userData = JSON.parse($cookies.get('globals'));
        var tagId = $stateParams.id;
        console.log(tagId);
        $scope.showReturnBtn = (tagId !== '' && tagId !== undefined) ? true : false;



      //  loadCategoryList();

        //console.log("currentid ---" + postId)
        if (tagId !== '') {
            loadOneTag(tagId, userData);

        }

        function loadOneTag(tagId, userData) {
            TagApiService.GetOneTag(tagId, userData)
                .then(function(data) {
                    $scope.oneTag = data;
                    console.log(data);
                   /* categCopy = angular.copy(data);
                    if (data.parent.parentId) {
                        $scope.selectedId = (data.parent.parentId).toString();
                        //console.log(true);
                    } else {
                        $scope.selectedId = '';
                        console.log("one" + $scope.selectedId);
                    }*/
                });
        }

        function loadCategoryList() {
            var domain = {
                "domain": {
                    "id": 1
                }
            };

            TagApiService.GetCategoryList(userData, domain)
                .then(function(data) {

                    if (categId) {
                        $rootScope.categoryList = $.grep(data, function(e) {
                            return e.id != categId;
                        })

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

            if ($scope.selectedId == null) {
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
           TagApiService.CategoryUpdate(userData, obj)
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
            console.log($scope.oneTag);
          //  console.log($scope.selectedId);
            var obj = newTag();
            console.log(obj);

         TagApiService.TagCreate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully updated the record');
                    // $scope.posts = data;

                });


        };

        $scope.returnBack = function() {
            $state.go('tags');
        };

        /////creating a categoryobj

        function newTag() {
            //console.log($scope.selectedId);
            var newobj = [{
                    "sticky": 1,
                    "status":1,
                    "domain": {
                    "id": 1
                    },
                    "data": {
                    "termName": $scope.oneTag.data.termName,
                    "type": "tag",
                    "fieldData": {
                    "weight": 2,
                    "changed": 0
                    },
                    "language": {
                    "id": 9
                    }
                    }
                }];

            return newobj;
        }

        /** */

    }

})();