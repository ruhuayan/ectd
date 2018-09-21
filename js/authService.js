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

        return service;

        function signin(username, password, code, callback) {   
            $http({
                method: 'POST',
                url:$rootScope.Base_URL + '/api-token-auth/',
                data: {username, password},
                headers: {'Content-Type': 'application/json'}
            }).then(res=>{          console.log(res)
                if(res.status==200){
                    const userData = {username: username, token: res.data.token}
                    callback(userData);
                }
            });
            // $http.post($rootScope.Base_URL + '/api-token-auth/', {username, password}).then(
            //     function(res){
            //         console.log(res);
            //     }
            // );
            
            // $.ajax({
            //     async: true,
            //     crossDomain: true,
            //     method: "POST",
            //     url: $rootScope.Base_URL + "/f/login",
                
            //     headers: {
            //         "content-type": "application/x-www-form-urlencoded",
            //         "authorization": "Basic " + Base64.encode( username + ':' + password )
            //     },
            //     data: {
            //         grant_type: "password", 
            //         username: username, 
            //         password: "Basic " +Base64.encode( username + ':' + password ),
            //         code: code
            //     }
            // }).done(function (response){                                        console.log(response);
            //     var response = JSON.parse(response);
            //         if(response.uid) callback(response);
            //         else toastr.error('Login Failed');
                    
            // }).fail(function(jqXHR){ console.log(jqXHR);
            //     callback(JSON.parse(jqXHR.responseText).errors[0].description, true);
            //     // toastr.error("Login Failed: " + JSON.parse(jqXHR.responseText).errors[0].description);
            // });
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
    } 
})();