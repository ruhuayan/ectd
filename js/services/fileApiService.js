(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('FileApiService', FileApiService);

    FileApiService.$inject = ['$http', '$rootScope'];

    function FileApiService($http, $rootScope) {
        var Base_URL = "http://52.4.14.123/ectd"; 

        var service = {};
        
        service.GetFileList = GetFileList;
        service.GetAppFileList = GetAppFileList;
        service.GetClientFileList = GetClientFileList; 
        service.GetFile = GetFile;
        service.FileCreate = FileCreate;
        service.FileUpdate = FileUpdate;
        service.FileDelete = FileDelete;
        service.DownloadFileByUuid = DownloadFileByUuid;
        service.BatchUpdate = BatchUpdate;
        service.SaveEdits = SaveEdits;
        //service.AssignFile = AssignFile;
        //service.CreateFolder = CreateFolder;
        //service.GetAssignedFileByAppUid = GetAssignedFileByAppUid;

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
        
        function GetFile(uuid, userData) {
            return $http.get(Base_URL + '/a/application/file/getByUuid/' + uuid + '?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting file by uuid'));
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
        function BatchUpdate(userData, appUid, batchData){
            return $http.post(Base_URL + '/a/application/node/batch_update/appUid/'+appUid+'/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, batchData).then(handleSuccess, handleError('Error batch updating nodes!'));
        }
        function SaveEdits(uuid, userData, editData){
            return $http.post(Base_URL + '/a/application/file/save_state/'+ uuid +'?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, editData).then(handleSuccess, handleError('Error in updating file info'));
        }
        /*function AssignFile(uuid, nodeId, userData){
            return $http.get(Base_URL + "/a/application/file/assign/"+uuid+"?id=" + nodeId +"/?uid=" + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error at downloading file'));
        }
        function CreateFolder(userData, appUid, postData){
            return $http.post(Base_URL + '/a/application/folder/create/appUid/'+appUid+'/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token, postData).then(handleSuccess, handleError('Error creating file info'));
        }
        
        function GetAssignedFileByAppUid(userData, appUid){
            return $http.get(Base_URL +"/a/application/file/getAssignedByAppUid/"+ appUid +'/?uid=' + userData.uid +
                "&apptoken=" + userData.access_token).then(handleSuccess, handleError('Error getting application file list'));
        }*/

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