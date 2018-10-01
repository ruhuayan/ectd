(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('GenInfoApiService', GenInfoApiService);

    GenInfoApiService.$inject = ['$http', '$rootScope'];

    function GenInfoApiService($http, $rootScope) {
        const Base_URL = $rootScope.Base_URL;                                     //"http://52.4.14.123/ectd";      //$rootScope.settings.Base_URL;;

        const service = {};

        // service.GetGenInfo = GetGenInfo;
        service.CreateGenInfo = CreateGenInfo;
        service.CreateContact = CreateContact;
        service.GetContacts = GetContacts; 
        // service.GetAppType = GetAppType;
        service.GetAppInfo = GetAppInfo;
        service.GetAppContacts = GetAppContacts;
        return service;

        function GetAppInfo(userData, id) {
            return $http({
               method: 'GET',
               url:  `${Base_URL}/applications/${id}/appinfo`, 
               headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
           }).then(handleSuccess, handleError('Error in creating Application Information'));
        }

        function GetAppContacts(userData, id) {
            return $http({
               method: 'GET',
               url:  `${Base_URL}/applications/${id}/contacts`, 
               headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
           }).then(handleSuccess, handleError('Error in creating Application Contacts'));
        }

        // function GetGenInfo(appUid, userData) {                                 // not ready
        //     return $http.get(Base_URL + '/a/application/'+ appUid +'/general/info/?uid=' + userData.uid +
        //         "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
        // }

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
        // function GetAppType(userData){
        //     return $http.get(Base_URL + '/a/getAppType?uid=' + userData.uid +
        //         "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
        // }
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
