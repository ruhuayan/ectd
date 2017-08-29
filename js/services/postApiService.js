(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('PostApiService', PostApiService);

    PostApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function PostApiService($http, $cookies, $rootScope) {

        var Base_URL = 'http://192.168.88.187:8080/ecvcms';

        var service = {};

        service.GetPostList = GetPostList;
        service.GetOnePost = GetOnePost;
        //  service.PostUpdate = GetByUsername;
        service.PostCreate = PostCreate;
        service.PostUpdate = PostUpdate;
        service.DeletePost = DeletePost;

        return service;

        function GetPostList(userData, pageno, pagesize) {
            return $http.get(Base_URL + '/a/content/post/list?pageNo=' + pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all post list'));
        }

        function GetOnePost(postId, userData) {
            return $http.get(Base_URL + '/a/content/post/' + postId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting post by id'));
        }

        function PostCreate(userData, postData) {
            return $http.post(Base_URL + '/a/content/post/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, postData).then(handleSuccess, handleError('Error in creating a post'));
        }

        function PostUpdate(userData, postData) {
            return $http.post(Base_URL + '/a/content/post/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, postData).then(handleSuccess, handleError('Error in updating a post'));
        }

        function DeletePost(postId, userData) {
            return $http.post(Base_URL + '/a/content/post/delete/' + postId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error in deleting a post'));
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