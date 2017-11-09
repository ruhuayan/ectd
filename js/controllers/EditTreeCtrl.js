/**
 * Created by richardy on 11/9/2017.
 */

angular.module('MetronicApp').controller('EditTreeCtrl', ['$rootScope','$scope','$state','$cookies','$translate', 'CookiesApiService','FileApiService', 'ApplicationApiService','ModalService',
    function($rootScope, $scope, $state, $cookies,$translate, CookiesApiService,FileApiService, ApplicationApiService, ModalService) {
//function JstreeCtrl($rootScope, $scope, $state, $cookies, $translate, CookiesApiService, FileApiService, ModalService){
    var appUid;                                                //console.log("user Data", CookiesApiService.GetCookies());
    if(CookiesApiService.GetCookies()){
        appUid = $rootScope.appData.appUid;
        userData = $rootScope.userData;
        JsTree.userData = userData;
    }
    userData = JSON.parse($cookies.get('globals'));                         console.log(userData)
    if(!$rootScope.subFiles){
        //JsTree.initTree(fileTree);
        $state.go("fileupload").then(function() {});
    }else{
        //var fileJson = fileTree.concat($rootScope.subFiles);                 //console.log($rootScope.subFiles);
        JsTree.initTree($rootScope.subFiles);
        JsTree.setSelectList($rootScope.subFiles);
        //JsTree.upFiles = $rootScope.subFiles;
    }
    $scope.toggleTree = function(){
        JsTree.toggle($rootScope.open);
        $rootScope.open = ! $rootScope.open;
    };

    JsTree.closeSidebar();
    //$rootScope.settings.layout.pageSidebarClosed = true;
    $scope.saveEdits = function(fid, editData){
        return FileApiService.SaveEdits(fid, userData, editData);
    }
    $scope.getFileById = function(fid){
        return FileApiService.GetFileById(fid, userData);
    }
    $scope.getUserData = function(){
        return userData;
    };
    $scope.getAppUid = function(){
        return appUid;
    }
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    });
    $scope.$on("$destroy", function(){

        /*ModalService.showModal({
         templateUrl: "tpl/modal.html",
         controller: "SaveEditYesNoCtrl",
         preClose: function(modal){ modal.element.modal('hide'); },
         inputs:{
         title: "Save File ?",
         body: "Edits have been made in the file. Do you want to save them? "
         }
         }).then(function(modal) {
         //it's a bootstrap element, use 'modal' to show it
         modal.element.modal();
         modal.close.then(function(result) {                                           //console.log(result);
         if(result) {}
         });
         });*/
    });
}]);
function SaveEditYesNoCtrl($scope, $element, title, body, close){
    $scope.title = title;
    $scope.body = body;
    $scope.hideForm = true;
    $scope.close = function(result) {
        close(result, 300); // close, but give 500ms for bootstrap to animate
    };
}