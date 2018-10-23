angular.module('MetronicApp').controller('LoginController', ['$scope', '$rootScope', '$location', '$state', 'AuthenticationService',
    function($scope,  $rootScope, $location, $state, AuthenticationService){

        $scope.user = {}; 
        $scope.register = {};
        $scope.forgot = {};                           
        $scope.signin = signin;
        $scope.cancel = cancel;
        $scope.state = 'login';
        (function initController() {              
            AuthenticationService.ClearCredentials();
        })();
        
        const token = $location.search()['activate'];
        const uid = $location.search()['uid'];                console.log(token, username)
        if(token && username){
            AuthenticationService.Activate({uid, token}).then(
                res=>{    console.log(res); 
                    toastr.success('Your account is activated. Please log in.')
                },err=>{console.log(err);
                    toastr.warning('Activation of your account Failed!')
                }
            );
        }
        function cancel(){
            // alert('are you sure to want to give up!');
        }
        function signin() { 
           
            AuthenticationService.signin($scope.user.name, $scope.user.password, function(res){
                if (res) {
                    // $rootScope.currentuser = response.username;
                    AuthenticationService.SetCredentials(res);
                    toastr.success('Succesfully Logged In');
                    $state.go("dashboard").then(function() {
                        $state.reload();
                    });
                } else {
                    toastr.warning('Login Fail'); //console.log("error in login controller");
                }
            });
        };

        $scope.singup = function(){   console.log($scope.register)
            AuthenticationService.Signup({username:$scope.register.username, password: $scope.register.password})
                .then(function(res){
                        if(res) {                       console.log(res);
                            toastr.success('Sign up successfully. please activate it from your email.')
                        }
                    }, function(err){           console.log(err);
                        toastr.warning('Register Failed!')
                    }
                );
        }
        $scope.back = function(){
            $scope.state = 'login';
        }
        $scope.forgot = function(){

        }
    }]);
