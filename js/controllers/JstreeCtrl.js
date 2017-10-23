/*MetronicApp.controller('JstreeCtrl', ['$rootScope', '$scope', '$state', '$cookies', '$translate','FileApiService'
    function($rootScope, $scope, $state, $cookies, $translate, FileApiService) {
        
    }]);*/
function JstreeCtrl($rootScope, $scope, $state, $cookies, $translate, FileApiService){
        
        var appData;
        if($cookies.get("appData")) {
            appData = JSON.parse($cookies.get("appData"));
            appUid = appData.appUid;
        }else {
            $state.go("submission");
            $translate("WARNING_NOAPP").then(function(translation){
                toastr.warning(translation); 
            });
            //toastr.warning("You need to create an application to edit Link!");
        }
        userData = JSON.parse($cookies.get('globals'));
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
        $scope.saveEdits = function(fuuid, editData){
            return FileApiService.SaveEdits(fuuid, userData, editData);
        };
        $scope.getFileByUuid = function(fuuid){
            return FileApiService.GetFile(fuuid, userData); 
        };
     }

