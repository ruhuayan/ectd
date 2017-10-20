(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('TemplateApiService', TemplateApiService);

    TemplateApiService.$inject = ['$http', '$rootScope'];

    function TemplateApiService($http, $rootScope) {
         var Base_URL = "http://52.4.14.123/ectd"; //"http://192.168.88.187:8080/ectd";

        var service = {};

        service.GetTemplateList = GetTemplateList;
        service.GetOneTemplate = GetOneTemplate;
        service.TemplateUpdate = TemplateUpdate;
        service.TemplateCreate =TemplateCreate;

        return service;

        function GetTemplateList(userData) {
            return $http.get(Base_URL +'/a/eCTDTemplate/list?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting Templates'));
        }

       
        function GetOneTemplate(templateId, userData) {
            return $http.get(Base_URL + '/a/eCTDTemplate/getById/'+ templateId + '/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting one Template'));
        }

          function TemplateCreate(userData, templateData) {
            return $http.post(Base_URL + '/a/eCTDTemplate/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, templateData).then(handleSuccess, handleError('Error in creating Template'));
        }

        function TemplateUpdate(userData, templateData) {
            return $http.post(Base_URL+'/a/eCTDTemplate/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, templateData).then(handleSuccess, handleError('Error in updating Template'));
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