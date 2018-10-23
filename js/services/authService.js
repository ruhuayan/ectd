(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$log'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout,  $log) {
        var service = {};

        service.signin = signin;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;
        service.ForgotPassword = ForgotPassword;
        service.Signup = Signup;
        service.Activate = Activate;

        return service;

        function signin(username, password, callback) {   
            $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/api-token-auth/',
                data: {username, password},
                headers: {'Content-Type': 'application/json'}
            }).then(res=>{          console.log(res)
                if(res.status==200){
                    const userData = {username: username, token: res.data.token}; 
                    callback(userData);
                }
            });
        }

        function SetCredentials(data) {
            $rootScope.userData = data;
            // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('globals', $rootScope.userData, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.userData = {};
            $cookies.remove('globals');
            //  $http.defaults.headers.common.Authorization = 'Basic';
        }

        function Signup(data){
            return $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/users/register',
                data: data,
                headers: {'Content-Type': 'application/json'}
            });
        }

        function Activate(data){
            return $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/users/activate',
                data: data,
                headers: {'Content-Type': 'application/json'}
            });
        }

        function ForgotPassword(data){
            return $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/users/register',
                data: data,
                headers: {'Content-Type': 'application/json'}
            })
        }
    } 
})();