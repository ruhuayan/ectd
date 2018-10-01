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
        function signin() { 
           
            AuthenticationService.signin($scope.user.name, $scope.user.password, function(res){
                if (res) {
                    // $rootScope.currentuser = response.username;
                    AuthenticationService.SetCredentials(res);
                    toastr.success('Succesfully Logged In');
                    // $rootScope.loaded = 0; 
                    $state.go("dashboard").then(function() {
                        // $rootScope.loaded = 1;
                        //$window.location.reload();
                        $state.reload();
                    });
                } else {
                    toastr.warning('Login Fail'); //console.log("error in login controller");
                }
            });
        };
    }]);
