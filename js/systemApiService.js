(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('systemApiService', systemApiService);

    systemApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function systemApiService($http, $cookies, $rootScope) {

        var service = {};

        service.GetUserList = GetUserList;

        return service;

        function GetUserList(userData, pageno, pagesize) {
            var userJson  = JSON.stringify({
                "uid": null,
                "userName": null,
                "firstName": null,
                "lastName": null,
                "email" :  null
            });
            return $http.get('http://192.168.88.187:8080/ecvcms/a/users/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all users'));
        }

        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function() {
                return { success: false, message: error };
            };
        }
    }

})();