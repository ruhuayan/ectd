(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('GenInfoApiService', GenInfoApiService);

    GenInfoApiService.$inject = ['$http', '$rootScope'];

    function GenInfoApiService($http, $rootScope) {
        const Base_URL = $rootScope.Base_URL;                                     //"http://52.4.14.123/ectd";      //$rootScope.settings.Base_URL;;

        const service = {};

        service.CreateAppInfo = CreateAppInfo;
        service.CreateContact = CreateContact;
        service.UpdateAppInfo = UpdateAppInfo;
        service.UpdateContact = UpdateContact; 
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

        function CreateAppInfo( userData, appinfo) {
            return $http({
                method: 'POST',
                url:  `${Base_URL}/appinfos/`, 
                data: appinfo,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating Application information'));
        }

        function UpdateAppInfo(userData, appId, appinfo){
            return $http({
                method: 'PUT',
                url:  `${Base_URL}/appinfos/${appId}/`, 
                data: appinfo,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating Application Information'));
        }

        function CreateContact(userData, contactData) {             
            return $http({
                method: 'POST',
                url:  `${Base_URL}/contacts/`, 
                data: contactData,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating Application Contact'));
        }
        
        function UpdateContact(userData, appId, contactData){
            return $http({
                method: 'PUT',
                url:  `${Base_URL}/contacts/${appId}/`, 
                data: contactData,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating Application Contact'));
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
