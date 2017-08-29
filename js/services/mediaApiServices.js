
/*
* Media Api calls
*/



(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('mediaApiService', mediaApiService);

    mediaApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function mediaApiService($http, $cookies, $rootScope) {
        var Base_URL = 'http://192.168.88.187:8080/ecvcms';

        var service = {};

        service.GetMediaList = GetMediaList;
        service.CreateMedia = CreateMedia;
        service.ViewMedia = ViewMedia;
        service.DeleteMedia = DeleteMedia;


        return service;

        function GetMediaList(userData) {
            return $http.get(Base_URL + '/a/medias/list.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all users'));
        }

        /*  function CreateMedia(userData, file) {
              return $http.post('http://192.168.88.187:8080/ecvcms/a/medias/create.json?uid=' + userData.uid +
                  "&apptoken=" + userData.appToken, file).then(handleSuccess, handleError('Error getting user by id'));
          }*/

        function CreateMedia(userData, file) {
            var uploadUrl = Base_URL + '/a/medias/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken;

            var fd = new FormData();
            fd.append('file', file);

            return $http.post(uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(handleSuccess, handleError('Error getting user by username'));
        }



        function ViewMedia(mediaId, userData) {
            return $http.get(Base_URL + '/a/medias/id/' + mediaId + '?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting user by username'));
        }


        function DeleteMedia(userData, Id) {
            console.log(Id)

            return $http.delete(Base_URL + '/a/medias/delete.json?id=' + Id + '&uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting user by username'));

        }

        function CategoryDelete(categId, userData) {
            return $http.get(Base_URL + '/a/content/category/delete/' + categId + '.json?uid=' + userData.uid +
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
/*  MetronicApp.service('fileUpload', ['$http','$cookies', function ($http ,$cookies) {
           // var userData = JSON.parse($cookies.get('globals'));
            this.uploadFileToUrl = function(file,uploadUrl){
               var fd = new FormData();
               fd.append('file', file);
            console.log(fd);
            console.log("in service");
               $http.post(uploadUrl, fd,{

                transformRequest: angular.identity,
                  headers: { 'Content-Type': undefined}
               })
            
               .success(function(){
               })
            
               .error(function(error){
                   console.log(error);
               });
            }
         }]);*/