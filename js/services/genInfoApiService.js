(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('GenInfoApiService', GenInfoApiService);

    GenInfoApiService.$inject = ['$http', '$rootScope'];

    function GenInfoApiService($http, $rootScope) {
        var Base_URL = "http://192.168.88.187:8080/ectd";                        //$rootScope.settings.Base_URL;;

        var service = {};

        service.GetGenInfo = GetGenInfo;
        service.CreateGenInfo = CreateGenInfo;
        service.CreateContact = CreateContact;
        service.GetContacts = GetContacts; 
        return service;

        function GetGenInfo(appUid, userData) {                                 // not ready
            return $http.get(Base_URL + '/a/application/'+ appUid +'/general/info/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
        }

        function CreateGenInfo(appUid, userData, applicationData) {
            return $http.post(Base_URL + '/a/application/'+ appUid +'/general/info/createUpdate?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, applicationData).then(handleSuccess, handleError('Error in creating an Application'));
        }

        function CreateContact(appUid, userData, applicationData) {             // not ready
            return $http.post(Base_URL + '/a/application/'+ appUid +'/contact/info/createUpdate?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, applicationData).then(handleSuccess, handleError('Error in creating an Application'));
        }
        
        function GetContacts(appUid, userData) {                                 // not ready
            return $http.get(Base_URL + '/a/application/'+ appUid +'/contact/info/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
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
