(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('ApplicationApiService', ApplicationApiService);

    ApplicationApiService.$inject = ['$http', '$rootScope'];

    function ApplicationApiService($http, $rootScope) {

        const Base_URL = $rootScope.Base_URL;                                    //"http://52.4.14.123/ectd"; //"http://192.168.88.187:8080/ectd";

        const service = {};

        // service.GetApplicationList = GetApplicationList;
        service.GetClientAppList = GetClientAppList;
        service.GetApplication = GetApplication;
        service.ApplicationCreate = ApplicationCreate;
        service.ApplicationUpdate = ApplicationUpdate;
        service.DeleteApplication = DeleteApplication;
        service.GetAppNodes = GetAppNodes;
        // service.GetAppInfo = GetAppInfo;
        // service.GetAppContacts = GetAppContacts;
        return service;

        // function GetApplicationList(userData, pageno, pagesize) { 
        //     return $http({
        //         method: 'GET',
        //         url:Base_URL + '/applications',
        //         headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
        //     }).then(handleSuccess, handleError('Error getting all Application list'));
        // }
        
        function GetClientAppList(userData, companyId) {
            return $http({
                method: 'GET',
                url:`${Base_URL}/companies/${companyId}/applications/`,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error getting all Application list'));
        }
        function GetApplication(userData, id) {
            return $http({
                method: 'GET',
                url:Base_URL + '/applications/'+id,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error getting Application by id'));
        }

        function ApplicationCreate(userData, applicationData) {
            // return $http.post(Base_URL + '/a/application/create.json?uid=' + userData.uid +
            //     "&apptoken=" + userData.access_token, applicationData).then(handleSuccess, handleError('Error in creating an Application'));
            return $http({
                method: 'POST',
                url: Base_URL + '/applications/',
                data: applicationData, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating an Application'));
        }

        function ApplicationUpdate(userData, applicationData, id) {
             return $http({
                method: 'PUT',
                url:  `${Base_URL}/applications/${id}/`,
                data: applicationData, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating an Application'));
        
        }

        function DeleteApplication(userData, id) {
            return $http({
                method: 'DELETE',
                url: Base_URL + '/applications/'+id,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating an Application'));
        }

        function GetAppNodes(userData, id) {
            return $http({
               method: 'GET',
               url:  `${Base_URL}/applications/${id}/nodes`, 
               headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
           }).then(handleSuccess, handleError('Error in creating an Application'));
        }
       

        // function GetApplicationById(userData, id){
        //    return $http({
        //        method: 'GET',
        //        url:  `${Base_URL}/applications/${id}/`, 
        //        headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
        //    });
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