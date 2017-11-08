/*MetronicApp.controller('FileUploadCtrl', ['$scope', '$rootScope',  '$state', '$cookies', '$translate', 'FileUploader','FileApiService'
    function($scope, $rootScope, $state, $cookies, $translate, FileUploader, FileApiService ) {
        
    }]);*/

    function FileUploadCtrl( $rootScope, $scope, $state, $translate, FileUploader, CookiesApiService, FileApiService, ApplicationApiService, ModalService){ //$http does not use
        
        var appUid, toasts = {};                                                //console.log("user Data", CookiesApiService.GetCookies());
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;                                 
            //$scope.appCreated = true;
        }                                                                       

        var uploader = $scope.uploader = new FileUploader({
            url: $rootScope.Base_URL + "/a/application/file/create/appUid/" + appUid+"/?uid=" + $rootScope.userData.uid + "&apptoken=" + $rootScope.userData.access_token,
            removeAfterUpload: true
        }); 
        // FILTERS
        uploader.filters.push({
            name: 'quequeLimit',
            message: "WARNING_FILES", //"Maximum 10 files",
            fn: function(item , options){
                return this.queue.length < 10;
            }
        });                     //uploader.queueLimit = 10;
        uploader.filters.push({
            
            name: 'pdfFilter',
            message: "WARNING_FILE",  // "Not a pdf file",
            fn: function(item /*{File|FileLikeObject}*/, options){
                return item.type == "application/pdf";
            }
        });
        uploader.filters.push({
            name: 'sizeLimit',
            message: "WARNING_SIZE", //"Maximum file size 6mb",
            fn: function(item, options){
                return item.size < 6000000;
            }
        });
        uploader.filters.push({
            name: 'duplicateValidate',
            message: "WARNING_DUPLICATE",  //"Duplicate file",
            fn: function(item, options){
                if(!uploader.queue.length) return true;
                var valid=1;
                /*$.each(uploader.queue, function(index, value){                                          
                    if( value.file.name == item.name) valid =0;
                }); */
                angular.forEach(uploader.queue, function(value, key){
                    if(value.file.name == item.name) valid =0;
                });
                return valid;
            }
        });
        /*uploader.filters.push({
            name: "uploadedCheck",
            message: "WARNING_LOADED",//"Already uploaded",
            fn: function(item, options){
                if($rootScope.uploadFiles.length<=1) return true;
                var valid = 1, upFiles = $rootScope.uploadFiles; 
                for(var i=1; i<upFiles.length; i++){
                    if(upFiles[i].text===item.name ) {
                        valid =0;
                    }
                }
                return valid;
            }
        });*/
        
        // CALLBACKS
        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options){
            $translate(filter.message).then(function(translation){
                toastr.warning(item.name+" loading failed", translation);                            //"You need to create an application to upload files!"
            });
            //toastr.warning(item.name+" loading failed", filter.message);
        };
        uploader.onAfterAddingFile = function(fileItem){                       // console.log(uploader.queue);
            var upFiles = $rootScope.uploadFiles = $rootScope.uploadFiles || [];        
            if(upFiles && upFiles.length>0){                                               
                for(var i=0; i<upFiles.length; i++){
                    var fileName = fileItem.file.name; 
                    if(upFiles[i].text===fileName ){                            //console.log(upFiles[i].text);
                       
                        var warning = ["WARNING_EXISTS", "REPLACE"];
                        $translate(warning).then(function(translations){                            //console.log(translations);
                            toasts[fileName] = toastr.warning(fileName + translations.WARNING_EXISTS, translations.REPLACE,
                            { "closeButton": true,"newestOnTop": true,"timeOut": 0,"extendedTimeOut": 0,"showEasing": "swing","hideEasing": "linear","showMethod": "fadeIn","positionClass": "toast-top-right",
                            "hideMethod": "fadeOut","tapToDismiss": false, "onShown": function(){}});
                        });
                        
                    }
                }
            }
            //if(removeFile($rootScope.uploadFiles, fileItem, 0)) fileItem.remove();  
        };
       
        uploader.onCompleteItem = function(fileItem, res, status, headers){
            toastr.remove();
            if(res.fileId){                                                            //console.log(res)                                                        
                //if(removeFile($rootScope.uploadFiles, fileItem, 0)) {fileItem.remove(); return; }            //to make sure that no duplicate file name
                var upFiles = $rootScope.uploadFiles = $rootScope.uploadFiles || [];
                if(upFiles && upFiles.length>0){                    //console.log(upFiles)                           
                    for(var i=1; i<upFiles.length; i++){ 
                        if(upFiles[i].text===res.filename ){                                      
                            $translate("SUCCESS_REPLACED").then(function(translation){
                                toastr.success(res.filename + translation, translation);                            //"You need to create an application to upload files!"
                            });
                            //toastr.success(res.filename + "file replaced"); 
                            return;
                        }
                    }
                } 
               
                var treeNode = {'id': res.fileId, 'parent': 'up1', 'text': res.name, 'type': 'file'/*, 'fileId': res.fileId*/};
                upFiles.push(treeNode);                                         //console.log("on complete", upFiles)                                                                 
            }else console.log(res);
        };
        uploader.onCompleteAll = function(){
            if($scope.noUpfile) JsTree.initUploadTree(upFileNodes.concat($rootScope.uploadFiles));
            else JsTree.refreshUploadTree(upFileNodes.concat($rootScope.uploadFiles));
            $scope.showHint = false;
            
        };
        /************getting uploaded files******************************************/
       
        var upFileNodes = [{ "id" : "up1", "parent" : "#", "text" : "uploaded Files", 'type': 'root', "fileId": "Uploaded files", "state" : { "opened" : true}}];
                                                                                                            //console.log("application: ", appUid, $rootScope.userData);
        ApplicationApiService.GetApplication(appUid, $rootScope.userData).then(function(result){                   console.log("application: ", result);
            if(result.errors) return; 
            $rootScope.subFiles = result.nodeList;                                                      //console.log("result: ", fileTree[3]);
            
            JsTree.initTree($rootScope.subFiles);
            var upFiles = result.ectdFileList;                                  //console.log("upfiles: ", upFiles);
            if(upFiles.length>0){
                setFileNodes(upFiles);                                          
                restoreUpfileNode($rootScope.subFiles);
                JsTree.initUploadTree(upFileNodes.concat($rootScope.uploadFiles));
                $scope.showHint = false;
            }else $scope.noUpfile = true;
        });
        
        $scope.removeItem = function(item){                                                                    
            if(toasts[item.file.name]) { console.log(toasts[item.file.name]);
                toastr.clear(toasts[item.file.name]); 
                delete toasts[item.file.name];
            }
            item.remove();
        };
        $scope.removeAll = function(){
            uploader.clearQueue(); 
            toastr.remove();
        };
        $scope.savetree = function(){
            if(!appUid){ 
                $translate("WARNING_NOAPP").then(function(translation){
                    toastr.warning(translation);                            //"You need to create an application to upload/SAVE files!"
                });
                return;
            }
            if(!JsTree.treeChanged){
                toastr.warning("No change has been made to file tree");
                return;
            }

            var json = JsTree.get_fileJson();
            if(json){                                                           //console.log("save files: ", json) 
                batchUpdata(json)
            }else {
                $translate("NO_FILE").then(function(translation){
                    toastr.warning(translation);
                });
                //toastr.warning("There is no file to save");
                return;
            }
        };
        function batchUpdata(json) {

            $translate("INFO_WAIT").then(function(translation){
                toastr.info(translation, "Please be patient", {"timeOut": 50000, "closeButton": true});                            //"You need to create an application to upload files!"
            });
            //toastr.info("It may take a minute or two to save the ECTD structure files.", "Please be patient");
            App.blockUI({
                target: $("body"),
                message: " Load ...",
                //animate: true,
                overlayColor: "#999"//'#d9534f'
            });

            FileApiService.BatchUpdate($rootScope.userData, appUid, json).then(function(result){            //console.log(result);

                if(result){
                    toastr.remove();
                    App.unblockUI($("body"));

                    $rootScope.subFiles = [];
                    //$state.go("editinfo").then(function() {
                    toastr.success("Stucture save in app");
                    $rootScope.tagEdit = true;
                    JsTree.treeChanged = false;
                }
            });
        }
        
        if(!$rootScope.open) $rootScope.open = false;
        $scope.toggleTree = function(){
            JsTree.toggle($rootScope.open);
            $rootScope.open = ! $rootScope.open; 
        };
        
        $scope.hideUpfileNode = function(id){                                     
            getUpfileNodeById(id).state =  { "hidden" : true };                                                                    
        };
        $scope.deleteFileNode = function(id){
            var node = getUpfileNodeById(id);   
            $rootScope.uploadFiles.splice( $.inArray(node, $rootScope.uploadFiles), 1 );                                                //console.log($scope.uploadFiles);

            FileApiService.FileDelete(id, $rootScope.userData ).then(function(result){ console.log(result);
                //toasts.success("File deleted");
            });
        }
        $scope.showUpfileNode = function(id){
            var node = getUpfileNodeById(id); 
            node.state =  { "hidden" : false };
        };
        $scope.duplicateNode = function(obj){
            var newID =  Math.ceil(Math.random()*100000);                       console.log("new id", newID);
            var treeNode = {'id': newID, 'parent': 'up1', 'text': obj.text, 'type': 'file', 'fileId': newID};
            $rootScope.uploadFiles.push(treeNode);
            JsTree.refreshUploadTree($rootScope.uploadFiles);
        };
        function getUpfileNodeById(id){
            var upFiles = $rootScope.uploadFiles;
            if(upFiles.length>0){                                               
              for(var i=0; i<upFiles.length; i++){
                if(upFiles[i].id==id){       return upFiles[i];                                      
                   // upFiles[i].state =  { "hidden" : true };
                }
              }
            } 
            return false;
        }
        function restoreUpfileNode(subFiles){                                   
            var upFiles = $rootScope.uploadFiles;                               //console.log('subFiles ',subFiles); console.log('upfiles ', upFiles)
            if(upFiles.length>1){ 

                for(var i=0; i<upFiles.length; i++){
                        upFiles[i].state = { "hidden" : false };
                 }
                if(subFiles && subFiles.length>=1){
                    for(var i=0; i<upFiles.length; i++){                             
                        for(var j=0; j<subFiles.length; j++){
                            if(upFiles[i].id==subFiles[j].id)  {                //console.log('upid: ', upFiles[i]);               
                                upFiles[i].state = { "hidden" : true };
                            }  
                        }
                    }
                }     
            } 
        }
        $scope.translateMsg = function(msg){
            $translate(msg).then(function(translation){
                toastr.warning(translation);
            });
        };

        /*$scope.downloadFile = function(uuid){ console.log(uuid, userData)
            $http.get('http://192.168.88.187:8080/ectd' + "/a/application/file/download/" + uuid +"/?uid=" + userData.uid + "&apptoken=" + userData.access_token).then(function(res){
                    console.log(res);
                })
        }*/
        $scope.getUserData = function(){
            return $rootScope.userData;
        };
        function setFileNodes(upFiles){
            $rootScope.uploadFiles = [];
           for(var i=0; i<upFiles.length; i++){
               $rootScope.uploadFiles.push({'id': upFiles[i].fileId, 'parent': 'up1', 'text': upFiles[i].name, 'type': 'file'});
           }
        }
        $scope.$on("$destroy", function(){
            if( !$scope.fileJson) return;
             ModalService.showModal({
                templateUrl: "tpl/modal.html",
                controller: "SaveTreeYesNoCtrl",
                preClose: function(modal){ modal.element.modal('hide'); },
                inputs:{
                    title: "Save File Tree ?",
                    body: "Changes have been made in the file tree. Do you want to save them? "
                }
            }).then(function(modal) {
                //it's a bootstrap element, use 'modal' to show it
                modal.element.modal();
                modal.close.then(function(result) {                                           //console.log(result);
                    if(result) batchUpdata($scope.fileJson);
                });
            });
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            if(JsTree.treeChanged)
                $scope.fileJson = JsTree.get_fileJson();
            //if($scope.fileJson) batchUpdata($scope.fileJson);
        });
    };

function SaveTreeYesNoCtrl($scope, $element, title, body, close){
    $scope.title = title;
    $scope.body = body;
    $scope.hideForm = true;
    $scope.close = function(result) {
        close(result, 300); // close, but give 500ms for bootstrap to animate
    };
}

