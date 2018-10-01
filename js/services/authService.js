(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$cookies', '$rootScope', '$timeout', '$log'];

    function AuthenticationService($http, $cookies, $rootScope, $timeout,  $log) {
        const service = {};

        service.signin = signin;
        service.SetCredentials = SetCredentials;
        service.ClearCredentials = ClearCredentials;

        return service;

        function signin(username, password, callback) {   
            $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/api-token-auth/',
                data: {username, password},
                headers: {'Content-Type': 'application/json'}
            }).then(function(res){      console.log(res);
                if(res&&res.status==200){
                    const userData = {username: username, token: res['data']['token']};
                    callback(userData);
                } 
            }, function(err){
                console.log(err);
            });
        }

        function SetCredentials(data) {
            $rootScope.userData = data;
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('globals', $rootScope.userData, { expires: cookieExp });
        }

        function ClearCredentials() {
            $rootScope.userData = {};
            $cookies.remove('globals');
            //  $http.defaults.headers.common.Authorization = 'Basic';
        }
    } 
})();