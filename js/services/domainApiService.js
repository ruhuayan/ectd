(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('DomainApiService', DomainApiService);

   DomainApiService.$inject = ['$http', '$cookies', '$rootScope'];

    function DomainApiService($http, $cookies, $rootScope) {
         var Base_URL = 'http://192.168.88.187:8080/ecvcms';

        var service = {};

        service.GetDomainList = GetDomainList;
       service.SetDomain = SetDomain;
       service.GetOneDomain = GetOneDomain;
        service.DomainUpdate = DomainUpdate;
       service.DomainCreate =DomainCreate;
       // service.PostUpdate = PostUpdate;
       // service.DeletePost = DeletePost;

        return service;

        function GetDomainList(userData) {
            return $http.get('http://192.168.88.187:8080/ecvcms/a/company/domain/list.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting all users'));
        }

       function SetDomain(userData,domainId) {
          
             var Url ='http://192.168.88.187:8080/ecvcms/a/users/current_user/update_current_domain.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken;
         
               var fd = new FormData();
               fd.append('domain_id', domainId);

            return $http.post(Url, fd,{ transformRequest: angular.identity,headers: { 'Content-Type': undefined}
               }).then(handleSuccess, handleError('Error getting user by username'));
           
             
        }
         function GetOneDomain(domainId, userData) {
            return $http.get(Base_URL + '/a/company/domain/'+ domainId +'.json'+ '?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error getting user by username'));
        }

          function DomainCreate(userData, domainData) {
            return $http.post(Base_URL + '/a/company/domain/create.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, domainData).then(handleSuccess, handleError('Error in creating domain'));
        }

        function DomainUpdate(userData, domainData) {
            return $http.post(Base_URL+'/a/company/domain/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken, domainData).then(handleSuccess, handleError('Error getting user by username'));
        }

     /*   function DeletePost(postId, userData) {
            return $http.post('http://192.168.88.187:8080/ecvcms/a/content/post/delete/' + postId + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.appToken).then(handleSuccess, handleError('Error creating user'));
        }
*/






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