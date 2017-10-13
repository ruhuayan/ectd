(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('NodeApiService', NodeApiService);

    NodeApiService.$inject = ['$http', '$rootScope'];

    function NodeApiService($http, $rootScope) {
        var Base_URL = "http://192.168.88.187:8080/ectd";                        //$rootScope.settings.Base_URL;;

        var service = {};

        service.GetNodes = GetNodes;
        service.CreateNode = CreateNode;
        service.SaveNodes = SaveNodes;
        service.GetNodeById = GetNodeById; 
        return service;

        function GetNodes(appUid, userData) {                                 // not ready
            return $http.get(Base_URL + '/a/application/'+ appUid +'/node/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
        }

        function CreateNode(appUid, userData, nodeData) {
            return $http.post(Base_URL + '/a/application/'+ appUid +'/node/createUpdate?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, nodeData).then(handleSuccess, handleError('Error in creating an Application'));
        }

        function SaveNodes(appUid, userData, nodes) {             // not ready
            return $http.post(Base_URL + '/a/application/'+ appUid +'/nodes/save?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, nodes).then(handleSuccess, handleError('Error in creating an Application'));
        }
        
        function GetNodeById(appUid, nodeId, userData) {                                 // not ready
            return $http.get(Base_URL + '/a/application/'+ appUid +'/node/'+ nodeId +'/?uid=' + userData.uid +
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


