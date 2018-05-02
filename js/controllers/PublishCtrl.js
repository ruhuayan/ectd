angular.module('MetronicApp')
    .controller('PublishTreeCtrl', [ '$rootScope', '$scope', 'CookiesApiService', 'ApplicationApiService', 'GenInfoApiService', 'TagApiService', 'ModalService',
    function($rootScope, $scope, CookiesApiService, ApplicationApiService, GenInfoApiService, TagApiService, ModalService){
        $scope.inprocess = true;
        var appUid;                                                //console.log("user Data", CookiesApiService.GetCookies());
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;                    //console.log($rootScope.appData);
            $scope.appNumber = $rootScope.appData.folder;
            JsTree.userData = JsTree.userData || $rootScope.userData;
        }

        if(!$rootScope.subFiles || $rootScope.subFiles.length==0){
            ApplicationApiService.GetApplication(appUid, $rootScope.userData).then(function(result){     //console.log("appData infopage", result);
                $rootScope.subFiles = result.nodeList;
                $scope.fileList = result.ectdFileList;
                //$rootScope.appData.NumOfFiles = result.nodeList.length;
                JsTree.initTree($rootScope.subFiles);                               //console.log('subFiles: ', $rootScope.subFiles);
            });
        }else{
            JsTree.initTree($rootScope.subFiles, $rootScope.substanceTags);         //console.log('subFiles: ', $rootScope.subFiles);
        }
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; // ? false : true;
        };
        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        $scope.getAppUid = function(){
            return appUid;
        };
        $scope.downloadApp = async function(){
            var result = await checkGenInfo();
                if(!result || !result.id) toastr.error(" The application does not have general information", "Error:");
                else
                    JsTree.downloadTree(appUid, $scope.appNumber, $rootScope.userData);
            // GenInfoApiService.GetGenInfo(appUid, $rootScope.userData).then(function(result){        //console.log("geninfo: ",result);
            //     if(!result || !result.id) toastr.error(" The application does not have general information", "Error:");
            //     else
            //         JsTree.downloadTree(appUid, $scope.appNumber, $rootScope.userData);
            // });
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
            return GenInfoApiService.GetGenInfo(appUid, $rootScope.userData);/*.then(function(result){        console.log("geninfo: ",result);
                if(!result || !result.id) JsTree._writeMsg("Application", " does not have general information");
            });*/
        }
        function checkContacts(){
            return GenInfoApiService.GetContacts(appUid, $rootScope.userData)/*.then(function(result){        console.log("contact info: ", result);
                if(!result || !result.length) JsTree._writeMsg("Application", " does not have contact information");
                $scope.inprocess = false;
            });*/
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
            return TagApiService.GetTagByNid(appUid, nodeId, $rootScope.userData);
        }
    
    }]);