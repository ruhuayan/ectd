(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('UserMgtController', UserMgtController);

    UserMgtController.$inject = ['systemApiService', '$rootScope', '$scope', '$state', 'settings', '$cookies', '$window'];

    function UserMgtController(systemApiService,$rootScope, $scope, $state, settings, $cookies, deleteUserModal, $window) {

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
        var users = {};
        // users.list = null;

        $scope.pageno = 1;

        $scope.pagesize = { id: '5' };


        initController();


        function initController() {
            loadUserList();
        }

        function loadUserList() {
            systemApiService.GetUserList(userData, $scope.pageno, $scope.pagesize.id)
                .then(function(data) {
                    $rootScope.users = data.list;
                    $scope.totalpages = Math.ceil(data.recordsTotal / data.pageSize);
                    $scope.itemsPerPage = data.pageSize;
                     console.log(data);
                });

        }

        /******pagination */

        $scope.nextPage = function() {

            if ($scope.pageno < $scope.totalpages) {
                $scope.pageno++;
                // $scope.loadPage();
                loadUserList();
            }
        };

        $scope.previousPage = function() {
            if ($scope.pageno > 1) {
                $scope.pageno--;
                // $scope.loadPage();
                loadUserList();
            }
        };

        $scope.newlist = function(id) {
            loadUserList();
            console.log(id);

        };
    }

})();