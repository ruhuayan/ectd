(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('UserApiService', UserApiService);

    UserApiService.$inject = ['$http', '$rootScope'];

    function UserApiService($http, $rootScope) {

        const Base_URL = $rootScope.Base_URL; 
        const service = {};

        service.GetCurrentUser = GetCurrentUser;
        service.UpdateAccount = UpdateAccount; 
        service.CreateCompany = CreateCompany;
        service.UpdateCompany = UpdateCompany;
        service.ChangePassword = ChangePassword;

        return service;
        function GetCurrentUser(userData) {
            return $http({
                method: 'GET',
                url:  `${Base_URL}/users/verify`, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in verifying user'));
        }

        function UpdateAccount(userData, data){
            return $http({
                method: 'PUT',
                url:  `${Base_URL}/users/${data.id}/`, 
                data: data, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating user account'));
        }

        function CreateCompany(userData, data){
            return $http({
                method: 'POST',
                url:  `${Base_URL}/companies/`, 
                data: data, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating company'));
        }

        function UpdateCompany(userData, id, data){
            return $http({
                method: 'PUT',
                url:  `${Base_URL}/companies/${id}/`, 
                data: data, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating company'));
        }
        
        function ChangePassword(userData, userid, newData) {
            return $http({
                method: 'POST',
                url:  `${Base_URL}/users/${userid}/set_password/`, 
                data: newData, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in resetting password'));
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

