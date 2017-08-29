(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('TagApiService', TagApiService);

    TagApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function TagApiService($http, $cookies, $rootScope) {

        var Base_URL = 'http://192.168.88.187:8080/ecvcms';
        var service = {};

        service.GetTagsList = GetTagsList;
        service.GetOneTag = GetOneTag;
        //  service.PostUpdate = GetByUsername;
        // service.Create = Create;
        service.TagCreate = TagCreate;
        service.SearchTagsList = SearchTagsList;
        /* service.CategoryUpdate = CategoryUpdate;
         service.CategoryDelete = CategoryDelete;*/


        return service;

        function GetTagsList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/content/tag/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all taglist'));
        }

        function GetOneTag(tagId, userData) {
            return $http.get(Base_URL + '/a/content/tag/' + tagId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting tag by id'));
        }

        function TagCreate(userData, tagData) {
            return $http.post(Base_URL + '/a/content/tag/create?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, tagData).then(handleSuccess, handleError('Error in creating tag'));
        }



        function SearchTagsList(tag_name, userData) {
            return $http.get('http://192.168.88.187:8080/ecvcms/a/content/tag/search?name=' + tag_name + '&uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error in search tag'));
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