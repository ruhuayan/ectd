(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('TemplateApiService', TemplateApiService);

    TemplateApiService.$inject = ['$http', '$rootScope'];

    function TemplateApiService($http, $rootScope) {
        const Base_URL = $rootScope.Base_URL;                            //"http://52.4.14.123/ectd"; //"http://192.168.88.187:8080/ectd";

        var service = {};

        service.GetTemplateList = GetTemplateList;
        service.GetOneTemplate = GetOneTemplate;
        service.TemplateUpdate = TemplateUpdate;
        service.TemplateCreate =TemplateCreate;

        return service;

        function GetTemplateList(userData) {
            return $http({
                method: 'GET',
                url:Base_URL + '/templates',
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error getting Templates'));
        }

       
        function GetOneTemplate(templateId, userData) {
            return $http({
                method: 'GET',
                url: Base_URL + '/templates/'+templateId,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error getting one Template'));
        }

        function TemplateCreate(userData, templateData) {

            return $http({
                method: 'POST',
                url: Base_URL + '/templates/',
                data: templateData, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating Template'));
        }

        function TemplateUpdate(userData, templateId, templateData) {
            return $http({
                method: 'PUT',
                url: Base_URL + '/templates/'+templateId,
                data: templateData, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating Template'));
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