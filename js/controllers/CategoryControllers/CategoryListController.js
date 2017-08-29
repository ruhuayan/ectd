/* Setup blank page controller */
/*
angular.module('MetronicApp').controller('CategoryController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);

*/

(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('CategoryListController', CategoryListController);

    CategoryListController.$inject = ['$rootScope', '$scope', '$state', 'settings', 'categoryApiService', '$cookies', '$window'];

    function CategoryListController($rootScope, $scope, $state, settings, categoryApiService, $cookies, $window) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        /*

        $('#pagination-here').bootpag({
            total: 7,          // total pages
            page: 1,            // default page
            maxVisible: 5,     // visible pagination
            leaps: true         // next/prev leaps through maxVisible
        }).on("page", function(event, num){
              loadCategoryList();
           // $("#content").html("Page " + num); // or some ajax content loading...
            // ... after content load -> change total to 10
            $(this).bootpag({total: 10, maxVisible: 5});
        }); 
        */


        //  console.log($cookies.get('globals'));
        // $rootScope.userD = $cookies.get('globals');
        var userData = JSON.parse($cookies.get('globals'));
        //console.log(userData);
        // console.log(use.uid);
        var categoryList = this;
        $scope.open = false;
        // posts.list = null;

        initController();


        function initController() {
            loadCategoryList();
        }

        function loadCategoryList() {
            /* var domain = {
                 "domain": {
                     "id": 1
                 }
             };*/

            categoryApiService.GetCategoryList(userData)
                .then(function(data) {
                    //$rootScope.categoryList = data;
                    //    console.log(data);

                  for(var i=0; i<data.length; i++){
                        var parentId = data[i].parent.parentId;
                        if(!parentId){
                            data[i].parentNodes=0;
                            data[i].prefix='';
                        }else{
                            var n=1; 
                            //console.log(data[i].id);
                            n = findParent(parentId, data, n);
                            //console.log(n);
                            data[i].parentNodes = n;
                            var prefix= '\u2015';
                            prefix = prefix.repeat(n);
                            data[i].prefix = prefix;
                            //console.log(data[i].id, parentId);
                           
                            //console.log(data[i]);   
                        }
                        
                    }
              


                    $rootScope.categoryList = data;
                    //    dropdown(data);
                    //  console.log($rootScope.categoryList[0].taxonomyTermData);
                    //  $scope.taxonomyTermFieldDataList = data.taxonomyTermFieldDataList;
                    // console.log($scope.taxonomyTermFieldDataList);

                });

        }

        $scope.deleteCateg = function(categId) {

            //  console.log(categId);
            var deleteRecord = $window.confirm('Are you sure you want to delete this category ?');
            if (deleteRecord) {
                //Your action will goes here
                // console.log(delete);
                //   alert('Yes i want to delete');
                categoryApiService.CategoryDelete(categId, userData)
                    .then(function(response) {
                        // $rootScope.posts = data;
                        $state.go("categories").then(function() {
                            toastr.success('Succesfully Deleted the record');
                            // console.log($state);
                            $state.reload();
                        });
                    });

                /**updating child elements */

                var result = $.grep($rootScope.categoryList, function(e) {
                    return e.parent.parentId == categId;
                });
                var newobj = result;
                for (var i = 0; i < result.length; i++) {
                    //console.log(result.length);
                    console.log(result[i].parent);

                    newobj[i].parent.parentId = 0
                    console.log(newobj[i]);
                    categoryApiService.CategoryUpdate(userData, newobj[i])
                        .then(function(status) {
                            console.log(status);
                            // toastr.success('Successfully updated the record');
                            // $scope.posts = data;

                        });
                }

                /** end*/
            } //end if

        }; //end deleteCateg

        function findParent(parentId, list, n){
            //console.log(parentId, n);
            
            if(!parentId){
                return n;
            }
            var parentCat = getCatById(parentId, list);                                   
            if(!parentCat) return n; 

            var grandparentId = parentCat.parent.parentId;
            if(!grandparentId ) {
                return n; 
            }else{
                n++;
                n = findParent(grandparentId, list, n);
            }
            return n;
        }
        function getCatById(id, list){
            for (var i=0; i<list.length; i++){
                if(list[i].id==id) return list[i];
            }
            return null;
        }
        String.prototype.repeat = function(count) {
            if (count < 1) return '';
            var result = '', pattern = this.valueOf();
            while (count > 1) {
                if (count & 1) result += pattern;
                count >>>= 1, pattern += pattern;
            }
            return result + pattern;
        };




    }

})();