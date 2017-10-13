(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('PdfEditApiService', PdfEditApiService);

    PdfEditApiService.$inject = ['$http', '$rootScope'];

    function PdfEditApiService($http, $rootScope) {
        var Base_URL = "http://192.168.88.187:8080/ectd";                        //$rootScope.settings.Base_URL;;

        var service = {};

        service.GetPdfEdits = GetPdfEdits;
        service.SavePdfEdits = SavePdfEdits;
        //service.CreateContact = CreateContact;
        //service.GetContacts = GetContacts; 
        return service;

        function GetPdfEdits(appUid, userData) {                                 // not ready
            return $http.get(Base_URL + '/a/application/'+ appUid +'/edits/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all users'));
        }

        function SavePdfEdits(appUid, userData, editData) {
            return $http.post(Base_URL + '/a/application/'+ appUid +'/edits/save?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, editData).then(handleSuccess, handleError('Error in creating an Application'));
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


