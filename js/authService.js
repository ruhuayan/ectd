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

        function signin(username, password, callback) {
            //console.log(username);
            /*$.post('php/login.php', {userName: username, pass: password}, function(response){
                if(response)  return callback(response);
            });*/
            
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(username + ':' + password);
            //$header = 'Authorization: Basic bGlzYS5rOjEyMzQ1Ng==' + Base64.encode64( username + ':' + password )
            /*$http({
                async: true,
                crossDomain: true,
                method: 'POST',
                url: 'http://192.168.88.187:8080/ectd/f/login',
                headers:{
                    "content-type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " +Base64.encode( username + ':' + password )
                },
                data: {
                    grant_type: "password",
                    username: "lisa.k", 
                    password: "Basic " +Base64.encode( username + ':' + password )
                }
                
            }).success(function successCallback(response) {
                //console.log(response);
                callback(response);

            }).error(function errorCallback(response) {
                //   $exceptionHandler('An error has occurred.\nHTTP error: ' + response.status + '(' + response.statusText + ')');
                // Some error occurred
                toastr.error('Login Failed');
                $log.error(response);
                console.log("! Login fail cause " + response);
            });*/
            $.ajax({
                async: true,
                crossDomain: true,
                method: "POST",
                url: $rootScope.Base_URL + "/f/login",
                
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "authorization": "Basic " + Base64.encode( username + ':' + password )
                },
                data: {
                    grant_type: "password", 
                    username: username, 
                    password: "Basic " +Base64.encode( username + ':' + password )
                }
                
            }).done(function (response){                                        console.log(response);
                var response = JSON.parse(response);
                    if(response.uid) callback(response);
                    else toastr.error('Login Failed');
                    
            }).fail(function(jqXHR){ console.log(jqXHR);
                toastr.error("Login Failed: " + jqXHR.responseText);
            });
        }

        function SetCredentials(data) {
            //console.log('user:', data);
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

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function(input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };

})();