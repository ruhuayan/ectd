(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('DomainListController', DomainListController);

   DomainListController.$inject = ['DomainApiService', '$filter', '$rootScope', '$scope', '$state', 'settings', '$cookies', '$window'];

    function DomainListController(DomainApiService, $filter, $rootScope, $scope, $state, settings, $cookies, $window) {

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
        var domainlist = {};

       

        initController();


        function initController() {
            loadDomainList();
        }

        function loadDomainList() {

             DomainApiService.GetDomainList(userData)
                .then(function(data) {
                    $scope.domainlist = data;
                    console.log($scope.domainlist);
                });

        };






     
       
    }

})();