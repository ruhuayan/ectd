(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('categoryApiService', categoryApiService);

    categoryApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function categoryApiService($http, $cookies, $rootScope) {
        var Base_URL = 'http://192.168.88.187:8080/ecvcms';

        var service = {};

        service.GetCategoryList = GetCategoryList;
        service.GetOneCategory = GetOneCategory;
        //  service.PostUpdate = GetByUsername;
        // service.Create = Create;
        service.CategoryCreate = CategoryCreate;
        service.CategoryUpdate = CategoryUpdate;
        service.CategoryDelete = CategoryDelete;


        return service;

        function GetCategoryList(userData) {
            return $http.get(Base_URL + '/a/content/category/list.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting categorylist'));
        }

        function GetOneCategory(categId, userData) {
            return $http.get(Base_URL + '/a/content/category/' + categId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting category by id'));
        }

        function CategoryCreate(userData, postData) {
            return $http.post(Base_URL + '/a/content/category/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, postData).then(handleSuccess, handleError('Error creating a category'));
        }

        function CategoryUpdate(userData, postData) {
            console.log(postData);
            return $http.post(Base_URL + '/a/content/category/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, postData).then(handleSuccess, handleError('Error in updating a category'));
        }

        function CategoryDelete(categId, userData) {
            return $http.get(Base_URL + '/a/content/category/delete/' + categId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error in deleting category'));
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