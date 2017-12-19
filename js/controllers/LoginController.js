angular.module('MetronicApp').controller('LoginController', ['$scope', '$location', '$rootScope', '$state', '$cookies', 'AuthenticationService',
    function($scope, $location, $rootScope, $state, $cookies, AuthenticationService){

        $scope.user = {};
       
        $scope.signin = signin;
        $scope.cancel = cancel;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
        
        function cancel(){
            alert('are you sure to want to give up!');
        }
        function signin() {                                                                 //console.log("sign...")
            //  vm.dataLoading = true;
            AuthenticationService.signin($scope.user.name, $scope.user.password, function(response) {
                if (response) {
                   
                    $rootScope.currentuser = 'root';
                    AuthenticationService.SetCredentials(response);
                    toastr.success('Succesfully Logged In');

                    $state.go("dashboard").then(function() {
                       //$window.location.reload();
                        // console.log($state);
                        //$state.reload(); toastr.success('Succesfully Logged In');
                        $state.reload();
                    });
                    
                } else {
                    //FlashService.Error(response.message);
                    // vm.dataLoading = false;
                    toastr.warning('Login Fail');
                    console.log("error in login controller");
                }
            });
        };
    

    }]);
/*(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', 'AuthenticationService', '$rootScope', '$scope', '$state', '$cookies'];

    function LoginController($location, AuthenticationService, $rootScope, $scope, $state, $cookies) {
        $scope.user = {};
        // var vm = this;

        $scope.signin = signin;
        $scope.cancel = cancel;

        (function initController() {
            // reset login status
            AuthenticationService.ClearCredentials();
        })();
        
        function cancel(){
            alert('are you sure to want to give up!');
        }
        function signin() {
            //  vm.dataLoading = true;
            AuthenticationService.signin($scope.user.name, $scope.user.password, function(response) {
                if (response) {
                    // $cookies.put('test', 'root');

                    $rootScope.currentuser = 'root';
                    AuthenticationService.SetCredentials(response);
                    toastr.success('Succesfully Logged In');

                    $state.go("dashboard").then(function() {
                       //$window.location.reload();
                        // console.log($state);
                        //$state.reload(); toastr.success('Succesfully Logged In');
                        // console.log($state);
                        $state.reload();
                    });
                    
                } else {
                    //FlashService.Error(response.message);
                    // vm.dataLoading = false;
                    toastr.warning('Login Fail');
                    console.log("error in login controller");
                }
            });
        };
    }

})();*/