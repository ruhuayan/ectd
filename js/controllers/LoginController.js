(function() {
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
                    $state.go("dashboard").then(function() {
                        toastr.success('Succesfully Logged In');
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

})();