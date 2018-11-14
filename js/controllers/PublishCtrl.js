angular.module('MetronicApp')
    .controller('PublishTreeCtrl', [ '$rootScope', '$scope', 'CookiesApiService', 'ApplicationApiService', 'GenInfoApiService', 'TagApiService', 'ModalService',
    function($rootScope, $scope, CookiesApiService, ApplicationApiService, GenInfoApiService, TagApiService, ModalService){
        $scope.inprocess = true;
        var appId;
        if(CookiesApiService.GetCookies()){
            appId = $rootScope.appData.id;                    
            // $scope.appNumber = $rootScope.appData.folder;
            JsTree.userData = JsTree.userData || $rootScope.userData;
        }

        if(!$rootScope.subFiles || $rootScope.subFiles.length==0){
            ApplicationApiService.GetAppNodes($rootScope.userData, appId).then(function(res){     //console.log("appData ", result);
                if(res){                              
                    $rootScope.subFiles = res;                
                    JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);  
                    //JsTree.setSelectList($rootScope.subFiles);       //console.log('subFiles: ', $rootScope.subFiles); 
                }
            });
        }else{
            JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);
            //JsTree.setSelectList($rootScope.subFiles);
        }
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; // ? false : true;
        };
        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        $scope.getappId = function(){
            return appId;
        };
        $scope.downloadApp = async function(){
            var result = await checkGenInfo();
            if(!result || !result.application) toastr.error(" The application does not have general information", "Error:");
            else
                JsTree.downloadTree(appId, $rootScope.appData.number, $rootScope.userData);
        };
        $scope.validateApp = async function(){
            // if($scope.inprocess) return;
            $scope.inprocess = true;
            JsTree.validateTree($rootScope.subFiles);
            var result = await checkGenInfo();
            if(!result || !result.id) JsTree._writeMsg("Application", " does not have general information");
            result = await checkContacts();
            if(!result || !result.length) JsTree._writeMsg("Application", " does not have contact information");

            angular.forEach($scope.fileList, function(value, index){                                //console.log(value);
                var fileLastState = value.ectdFileStateList[value.ectdFileStateList.length-1];
                if(fileLastState.type !="pdf") JsTree._writeMsg(value.name, " file type error");
                JsTree.checkfile(fileLastState.path, function(){
                    JsTree._writeMsg(fileName, 'does not exist')
                }); 
                if(fileLastState.action){
                    var actions = JSON.parse(fileLastState.action);
                    if(actions.linkOperations){
                        var links = actions.linkOperations;
                        for (var i=0; i<links.length; i++){
                            if(!links[0].tfid || !links[i].uri) JsTree._writeMsg(value.name, " no link URL");
                            if(!fileExits(links[0].uri)) JsTree._writeMsg(value.name, " link {0} path isn't correct".format(links[0].uri));
                            // to check links path in the file, server needs to save link path to action in database
                            /*JsTree.checkfile(links[0].path, function(){
                                JsTree._writeMsg(value.name, ": link {0} path {1} is not correct".format(links[0].uri, links[0].path));
                            })*/
                        }
                    }
                }
            });
            // $scope.inprocess = false;              console.log("inporcess", $scope.inprocess)
            $scope.$apply(()=>{
                $scope.inprocess = false;
            });
            //JsTree._hideProgressbar();
        };
        function checkGenInfo(){
            return GenInfoApiService.GetAppInfo($rootScope.userData, appId);
        }
        function checkContacts(){
            return GenInfoApiService.GetAppContacts($rootScope.userData, appId);
        }
        function fileExits(filename){
            var found = false;
            angular.forEach($scope.fileList, function(value, index){  
                if(value.name == filename){ //console.log(value.name)
                    found = true; 
                } 
            });
            return found;
        }

        $scope.validateTag = function(nodeId){
            return TagApiService.GetTagByNid(appId, nodeId, $rootScope.userData);
        }
    
    }]);