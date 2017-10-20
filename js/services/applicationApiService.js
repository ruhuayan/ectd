(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('ApplicationApiService', ApplicationApiService);

    ApplicationApiService.$inject = ['$http', '$rootScope'];

    function ApplicationApiService($http, $rootScope) {

        var Base_URL = "http://52.4.14.123/ectd";                            //"http://192.168.88.187:8080/ectd";

        var service = {};

        service.GetApplicationList = GetApplicationList;
        service.GetClientAppList = GetClientAppList;
        service.GetApplication = GetApplication;
        service.ApplicationCreate = ApplicationCreate;
        service.ApplicationUpdate = ApplicationUpdate;
        service.DeleteApplication = DeleteApplication;
        service.ExtractApp = ExtractApp;
        service.GetApplicationById = GetApplicationById;

        return service;

        function GetApplicationList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/application/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all Application list'));
        }
        
        function GetClientAppList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/application/client/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all Application list'));
        }
        function GetApplication(appUid, userData) {
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
        function ExtractApp(app){ 
            return {"id": app.id, "appUid": app.appUid, "description": app.description, "folder": app.folder, "version": app.version,
                          "sequence": app.sequence, "createdAt": app.createdAt, "updatedAt": app.updatedAt,
                          "template": {"id": app.template.id, "name": app.template.name}};
        }
        function GetApplicationById(applications, id){
            var application;
            angular.forEach(applications, function(value, key){ 
                if(value.id ===id) {application=value; }
            });
            return application;
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