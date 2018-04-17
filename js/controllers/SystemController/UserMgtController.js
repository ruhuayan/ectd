angular.module('MetronicApp').controller('UserMgtController', ['$rootScope','$scope','$state','$cookies','UserService',
    function($rootScope, $scope, $state, $cookies,  UserApiService) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;

        });

        var userData = JSON.parse($cookies.get('globals'));
        UserApiService.GetUserList(userData, 1, 50)
            .then(function (data) {
                $scope.users = data.list;
            });

    }]
);


/*(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('UserMgtController', UserMgtController);

    UserMgtController.$inject = ['UserApiService', '$rootScope', '$scope', '$state', 'settings', '$cookies', '$window'];

    function UserMgtController(UserApiService,$rootScope, $scope, $state, settings, $cookies, deleteUserModal, $window) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;

        });

        var userData = JSON.parse($cookies.get('globals'));
        UserApiService.GetUserList(userData, 1, 50)
            .then(function (data) {
                $scope.users = data.list;
            });

    
    }

})();*/