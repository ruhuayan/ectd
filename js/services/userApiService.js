(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('UserApiService', UserApiService);

    UserApiService.$inject = ['$http', '$rootScope'];

    function UserApiService($http, $rootScope) {

        var Base_URL = $rootScope.Base_URL; //"http://52.4.14.123/ectd"; //'http://192.168.88.187:8080/ectd';
        var service = {};

        service.GetCurrentUser = GetCurrentUser;
        service.RegisterUser = RegisterUser;
        service.SaveUserAccount = SaveUserAccount; 
        service.GetUserByUid = GetUserByUid;
        service.ChangePassword = ChangePassword;
        service.GetUserList = GetUserList;

        return service;
        function GetCurrentUser(userData) {
            return $http.get(Base_URL + '/a/users/loginUser?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting tag by id'));
        }
        function RegisterUser(userData) {
            return $http.post(Base_URL + '/a/users/client/register', userData).then(handleSuccess, handleError('Error in creating tag'));
        }
        function SaveUserAccount(userData, newData){
            return $http.post(Base_URL + '/a/users/client/save?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, newData).then(handleSuccess, handleError('Error in creating tag'));
        }
        function GetUserList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/users/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all taglist'));
        }

        function GetUserByUid(uid, userData) {
            return $http.get(Base_URL + '/a/users/uid/' + uid + '/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting tag by id'));
        }
        
        function ChangePassword(userData, newData) {
            return $http.get(Base_URL + '/a/users/changePassword?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, newData).then(handleSuccess, handleError('Error in search tag'));
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

