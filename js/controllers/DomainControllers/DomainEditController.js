(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('DomainEditController', DomainEditController);

   DomainEditController.$inject = ['DomainApiService','$rootScope', '$scope', '$state', 'settings', '$cookies', '$stateParams'];

    function DomainEditController(DomainApiService, $rootScope, $scope, $state, settings, $cookies, $stateParams) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });

        var oneDomain= {};
       
        var userData = JSON.parse($cookies.get('globals'));
        var domainId = $state.params.id;
        console.log(domainId);
        $scope.showReturnBtn = (domainId !== '' && domainId !== undefined) ? true : false;



      //  loadCategoryList();

        //console.log("currentid ---" + postId)
        if (domainId !== '') {
            loadOneDomain(domainId, userData);

        }

        function loadOneDomain(domainId, userData) {
           DomainApiService.GetOneDomain(domainId, userData)
                .then(function(data) {
                    $scope.oneDomain = data;
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

      
       $scope.update = function() {

        var obj = $scope.oneDomain;
        console.log(obj);
            
         DomainApiService.DomainUpdate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully updated the record');
                    // $scope.posts = data;

                });

      
        };


      $scope.save = function() {
            console.log($scope.oneDomain);
          //  console.log($scope.selectedId);
            var obj = newDomainObj();
            console.log(obj);

       /*  DomainApiService.DomainCreate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully cretaed the record');
                   

                });
        */
         };
         

        $scope.returnBack = function() {
            $state.go('domainlist');
        };

        /////--creating a Domain object --////

        function newDomainObj() {
            //console.log($scope.selectedId);
            var newobj = [{
                   
                "url": $scope.oneDomain.url,
                "domainName": $scope.oneDomain.domainName
                
            }];

            return newobj;
        }

        /** */

    }

})();