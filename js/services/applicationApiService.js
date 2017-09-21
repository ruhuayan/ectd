(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('ApplicationApiService', ApplicationApiService);

    ApplicationApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function ApplicationApiService($http, $cookies, $rootScope) {

        var Base_URL = "http://192.168.88.187:8080/ectd";

        var service = {};

        service.GetApplicationList = GetApplicationList;
        service.GetClientAppList = GetClientAppList;
        service.GetOneApplication = GetOneApplication;
        service.ApplicationCreate = ApplicationCreate;
        service.ApplicationUpdate = ApplicationUpdate;
        service.DeleteApplication = DeleteApplication;

        return service;

        function GetApplicationList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/application/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all Application list'));
        }
        
        function GetClientAppList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/application/client/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all Application list'));
        }
        function GetOneApplication(appUid, userData) {
            return $http.get(Base_URL + '/a/application/getByAppUid/' + appUid + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting Application by id'));
        }

        function ApplicationCreate(userData, applicationData) {
            return $http.post(Base_URL + '/a/application/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, applicationData).then(handleSuccess, handleError('Error in creating an Application'));
        }

        function ApplicationUpdate(userData, applicationData) {
            return $http.post(Base_URL + '/a/application/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, applicationData).then(handleSuccess, handleError('Error in updating an Application'));
        }

        function DeleteApplication(appUid, userData) {
            /*return $http.post(Base_URL + '/a/content/post/delete/' + appUid + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error in deleting an Application'));*/
        }

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