(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('FileApiService', FileApiService);

    FileApiService.$inject = ['$http', '$rootScope'];

    function FileApiService($http, $rootScope) {
        var Base_URL = "http://192.168.88.187:8080/ectd"; 

        var service = {};

        service.GetFileList = GetFileList;
        service.GetAppFileList = GetAppFileList;
        service.GetClientFileList = GetClientFileList; 
        service.GetOneFile = GetOneFile;
        service.FileCreate = FileCreate;
        service.FileUpdate = FileUpdate;
        service.FileDelete = FileDelete;
        service.DownloadFileByUuid = DownloadFileByUuid;


        return service;

        function GetFileList(userData) {                                        // no url
            return $http.get(Base_URL + 'list.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting file list'));
        }
        function GetAppFileList(userData, appUid){                              // get file list by appUid
            return $http.get(Base_URL +"/a/application/file/getByAppUid/"+ appUid +'/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting application file list'));
        }
        function GetClientFileList(userData, pageno, pagesize){
            return $http.get(Base_URL +"/a/application/file/client/list?"+ pageno + '&pageSize=' + pagesize + '&uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting client file list'));
        }
        
        function GetOneFile(fid, userData) {
            return $http.get(Base_URL + '/a/application/file/getById/' + fid + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting file by id'));
        }

        function FileCreate(userData, appUid, postData) {
            return $http.post(Base_URL + '/a/application/file/create/appUid/'+appUid+'/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, postData).then(handleSuccess, handleError('Error creating file info'));
        }

        function FileUpdate(userData, postData) {                               console.log(postData); 
            return $http.post(Base_URL + '/a/application/file/update.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, postData).then(handleSuccess, handleError('Error in updating file info'));
        }

        function FileDelete(fid, userData) {
            return $http.get(Base_URL + '/a/application/file/delete/' + fid + '.json?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error in deleting file info'));
        }
        function DownloadFileByUuid(uuid, userData){
            return $http.get(Base_URL + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error at downloading file'));
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