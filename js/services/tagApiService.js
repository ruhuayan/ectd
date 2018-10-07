(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('TagApiService', TagApiService);

    TagApiService.$inject = ['$http', '$rootScope'];

    function TagApiService($http, $rootScope) {

        const Base_URL = $rootScope.Base_URL;                                     //"http://52.4.14.123/ectd";
        const service = {};
        service.GetAppTags = GetAppTags;
        // service.GetTagsList = GetTagsList;
        service.GetTagByNid = GetTagByNid;
        service.CreateTag = CreateTag;
        service.UpdateTag = UpdateTag;
        service.SearchTagsList = SearchTagsList;

        return service;
        function GetAppTags(userData, id) {
            return $http({
               method: 'GET',
               url:  `${Base_URL}/applications/${id}/tags`, 
               headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
           }).then(handleSuccess, handleError('Error in getting Application Tags'));
        }
        // function GetTagsList(userData, pageno, pagesize) {
        //     return $http.get(Base_URL + '/a/content/tag/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
        //         "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting all taglist'));
        // }

        function GetTagByNid(userData, appId, nid) {
            return $http({
                method: 'GET',
                url:  `${Base_URL}/applications/${appId}/nodes/${nid}/tag`, 
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in getting Tag by node id'));
        }

        function CreateTag(userData, appId, node_id, tagData) {
            return $http({
                method: 'POST',
                url:  `${Base_URL}/applications/${appId}/nodes/${node_id}/tag/`, 
                data: tagData,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in creating Node Tag'));
        }

        function UpdateTag(userData, tagId, tagData){
            return $http({
                method: 'PUT',
                url:  `${Base_URL}/tags/${tagId}/`, 
                data: tagData,
                headers: {'Content-Type': 'application/json', 'Authorization': 'JWT '+userData.token}
            }).then(handleSuccess, handleError('Error in updating Node Tag'));
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