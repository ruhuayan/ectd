(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('taxonomyApiService', taxonomyApiService);

   taxonomyApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function taxonomyApiService($http, $cookies, $rootScope) {

        var service = {};

        service.GetPostList = GetPostList;
        service.GetOnePost = GetOnePost;
        //  service.PostUpdate = GetByUsername;
        // service.Create = Create;
        service.PostUpdate = PostUpdate;
        service.DeletePost = DeletePost;

        return service;

        function GetPostList(userData) {
            return $http.get('http://192.168.88.187:8080/ecvcms/a/content/post/list.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all users'));
        }

        function GetOnePost(postId, userData) {
            return $http.get('http://192.168.88.187:8080/ecvcms/a/content/post/' + postId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting user by id'));
        }

        function PostUpdate(userData, postData) {
            return $http.post('http://192.168.88.187:8080/ecvcms/a/content/post/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, postData).then(handleSuccess, handleError('Error getting user by username'));
        }

        function DeletePost(postId, userData) {
            return $http.post('http://192.168.88.187:8080/ecvcms/a/content/post/delete/' + postId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error creating user'));
        }



        function Update(user) {
            return $http.put('/api/users/' + user.id, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete('/api/users/' + id).then(handleSuccess, handleError('Error deleting user'));
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