(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('TagApiService', TagApiService);

    TagApiService.$inject = ['$http', '$rootScope'];

    function TagApiService($http, $rootScope) {

        var Base_URL = $rootScope.Base_URL;                                     //"http://52.4.14.123/ectd";
        var service = {};

        service.GetTagsList = GetTagsList;
        service.GetTagByNid = GetTagByNid;
        service.CreateTag = CreateTag;
        service.SearchTagsList = SearchTagsList;

        return service;

        function GetTagsList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/content/tag/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all taglist'));
        }

        function GetTagByNid(appUid, nid, userData) {
            return $http.get(Base_URL + '/a/application/' + appUid + '/tag/info?nodeId='+ nid +'&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting tag by id'));
        }

        function CreateTag(userData, appUid, tagData) {
            return $http.post(Base_URL + '/a/application/'+ appUid +'/tag/createUpdate?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, tagData).then(handleSuccess, handleError('Error in creating tag'));
        }

        function SearchTagsList(tag_name, userData) {
            return $http.get(Base_URL + '/a/content/tag/search?name=' + tag_name + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error in search tag'));
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