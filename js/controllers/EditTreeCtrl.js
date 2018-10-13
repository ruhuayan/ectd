/**
 * Created by richardy on 11/9/2017.
 */

angular.module('MetronicApp').controller('EditTreeCtrl', ['$rootScope','$scope','$state','$cookies','$translate', 'CookiesApiService',
                                            'FileApiService', 'ApplicationApiService','ModalService',
    function($rootScope, $scope, $state, $cookies,$translate, CookiesApiService,FileApiService, ApplicationApiService, ModalService) {
        //function EditTreeCtrl($rootScope, $scope, $state, $cookies, $translate, CookiesApiService, ApplicationApiService, FileApiService, ModalService){

            var appId, userData;                                                //console.log("user Data", CookiesApiService.GetCookies());
            if(CookiesApiService.GetCookies()){
                appId = $rootScope.appData.id;
                userData = $rootScope.userData;
                JsTree.userData = JsTree.userData || userData;
            }

            if(!$rootScope.subFiles || $rootScope.subFiles.length==0){
                ApplicationApiService.GetAppNodes($rootScope.userData, appId).then(function(res){     //console.log("appData ", result);
                    if(res){                              
                        $rootScope.subFiles = res;                
                        JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);         //console.log('subFiles: ', $rootScope.subFiles); 
                    }
                });
                // ApplicationApiService.GetApplication( $rootScope.userData, appId).then(function(result){     //console.log("appData ", JsTree);
                //     $rootScope.subFiles = result.nodeList;            //$rootScope.appData.NumOfFiles = result.nodeList.length;
                //     JsTree.initTree($rootScope.subFiles);                               //console.log('subFiles: ', $rootScope.subFiles);
                //     JsTree.setSelectList($rootScope.subFiles);
                // });
            }else{
                //var fileJson = fileTree.concat($rootScope.subFiles);                 //console.log($rootScope.subFiles);
                JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);
                JsTree.setSelectList($rootScope.subFiles);
            }
            $scope.toggleTree = function(){
                JsTree.toggle($rootScope.open);
                $rootScope.open = ! $rootScope.open;
            };

            JsTree.closeSidebar();
            //$rootScope.settings.layout.pageSidebarClosed = true;
            $scope.saveEdits = function(fid, editData){
                return FileApiService.SaveEdits(userData, fid, editData);
            }
            $scope.getFileLastState = function(fid){
                return FileApiService.GetLastState(userData, fid);
            }
            $scope.getUserData = function(){
                return userData;
            };
            // $scope.getappId = function(){
            //     return appId;
            // }
            $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                if(pdfEditor.fileUnsaved) $scope.edits = pdfEditor.getEditList();   //console.log(pdfEditor.getEditList());
            });
            $scope.$on("$destroy", function(){
                if(pdfEditor.fileUnsaved){                                        //console.log(pdfEditor.getEditList());
                    $scope.setModal(pdfEditor.fid, $scope.edits);
                }
            });
            $scope.setModal = function(fid, editData){

                ModalService.showModal({
                    templateUrl: "tpl/modal.html",
                    controller: function($scope, $element, title, body, close){
                        $scope.title = title;
                        $scope.body = body;
                        $scope.hideForm = true;
                        $scope.close = function(result) {
                            close(result, 300); // close, but give 500ms for bootstrap to animate
                        };
                    },
                    preClose: function(modal){ modal.element.modal('hide'); },
                    inputs:{
                        title: "Save File ?",
                        body: "Edits have been made in the file. Do you want to save them? "
                    }
                }).then(function(modal) {
                    //it's a bootstrap element, use 'modal' to show it
                    modal.element.modal();
                    modal.close.then(function(result) {                                           //console.log(result);
                        if(result) {
                            $scope.saveEdits(fid, editData);
                        }
                    });
                });
            };
    }]);