//angular.module('MetronicApp').controller('SubmissionCtrl', ['$rootScope','$scope','$state','$cookies', 'CookiesApiService', 'ApplicationApiService','TemplateApiService', 'ModalService',
//    function($rootScope, $scope, $state, $cookies, CookiesApiService, ApplicationApiService, TemplateApiService, ModalService ) {

function SubmissionCtrl($rootScope, $scope, $state, $cookies, CookiesApiService, ApplicationApiService, TemplateApiService, ModalService){
        var appData; 
        if(CookiesApiService.GetCookies())
            appData = $rootScope.appData;
        else appData = {"version": "0000"};                                     //console.log('app data:', appData);
        //var appData = $cookies.get("appData")? JSON.parse($cookies.get("appData")):{"version": "0000"};          
        //$rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        
        $scope.submissions = [{}];                    // to make sure data-table has json data
        if($rootScope.applications)                                             
            $scope.submissions = $rootScope.applications.slice(0,8);
        else 
            ApplicationApiService.GetClientAppList($rootScope.userData, 1, 50).then(function(data){                          //console.log("api service", data.list); 
            if(!data.list) {$rootScope.applications=[]; return;} 
            $scope.submissions = $rootScope.applications = data.list.list.slice(0,8);                                //console.log($rootScope.applications)
            //if(data.list.length>1) $scope.submissions = data;
        });                           
                                                                                
//        $scope.dtOptions = DTOptionsBuilder.newOptions()
//                .withOption('order', [1, 'asc'])
//                .withOption('lengthMenu', [5,10])
//                .withLanguage({"sEmptyTable":"Empty"});
           
        //var table = $("#appTable").DataTable();
        if(appData.appUid){                                         
            $scope.submitLabel = "EDITAPP";
            $scope.template = appData.template;                                 //console.log("template", appData);
            $scope.formData = angular.copy(appData);
            //$scope.template = $scope.formData.template;            
            $scope.uneditable = true;
        }else{
            getTemplateList();                         // to create templates
            $scope.submitLabel = "CREATEAPP"; 
            $scope.formData={"version": "0000"};
            $scope.uneditable = false;
        }
        
        $scope.toggleEditable = function(){
            $scope.uneditable =!$scope.uneditable;
        };
        
        $scope.createApp = function(){                                          //console.log($scope.subForm.$valid);                               
            if($scope.subForm.$valid){
                var tid =  $scope.template.id || JSON.parse($scope.template).id;
                $scope.formData.template = {'id': tid};                         //console.log("template", tid);
                var jsonData = $scope.formData;                                 //console.log("appdata: ", jsonData);
                
                if(appData.id){
                    // for update to work, i have to get rid of unnecessary field
                    jsonData ={"id": jsonData.id, "appUid": jsonData.appUid, "version":jsonData.version, "description": jsonData.description, 
                        "template": jsonData.template, "folder": jsonData.folder, "sequence": jsonData.sequence}; 
                    
                    ApplicationApiService.ApplicationUpdate($rootScope.userData, jsonData).then(function(result){                    console.log(result);
                        if(result.id){
                            $rootScope.appData = ApplicationApiService.ExtractApp(result);
                            toastr.success("Create Application id: " + result.id);
                            var cookieExp = new Date();
                            cookieExp.setDate(cookieExp.getDate() + 1);
                            $cookies.putObject('appData', $rootScope.appData, { expires: cookieExp});          
                            $state.go("editinfo").then(function() {}); 
                        }
                    });
                }else{
                    ApplicationApiService.ApplicationCreate($rootScope.userData, jsonData).then(function(result){                      console.log(result);      // res.success ==false
                        if(result.id){
                            $rootScope.appData = ApplicationApiService.ExtractApp(result);
                            toastr.success("Save Application id: " + result.id);
                            var cookieExp = new Date();
                            cookieExp.setDate(cookieExp.getDate() + 1);
                            $cookies.putObject('appData', $rootScope.appData, { expires: cookieExp});          
                            $state.go("editinfo").then(function() {}); 
                        } 
                    })
                }
            }   
            
        };
        $scope.cancelApp = function(){ 
            $scope.formData= appData? angular.copy(appData): {"version": "0000"};
            $scope.subForm.$setPristine();
            $scope.subForm.$setValidity();
            $scope.subForm.$setUntouched();
        };
         
        $scope.exitApp = function(){
            $cookies.remove("appData");
            $rootScope.appData = false;
            delete $rootScope.subFiles;
            delete $rootScope.uploadFiles;
            appData = {};
            $scope.formData= {"version": "0000"};
            $scope.submitLabel = "CREATEAPP"; 
            $scope.template= {};
            if(!$scope.templates) getTemplateList();
//            $scope.subForm.$setPristine();
//            $scope.subForm.$setValidity();
//            $scope.subForm.$setUntouched();
            $scope.uneditable = false;
            //$scope.subForm.$valid = true;                                                                    console.log($scope.subForm.$valid);  
        };
        
        $scope.view = function(sub){
            toastr.success('View Application ID: '+ sub.id);
            //$state.go("fileupload").then(function() {});    
        };
        $scope.edit = function(submission){                                             //console.log(submission)
            toastr.success('Application ID: '+submission.id);
            delete $rootScope.subFiles;
            delete $rootScope.uploadFiles;
            //var submission = ApplicationApiService.GetApplicationById($scope.submissions, id);         //getSubById(id);                                                                   
            if(submission){
                $rootScope.appData = appData = ApplicationApiService.ExtractApp(submission);
                //$rootScope.uploadFiles = submission.ectdFileList;               console.log($rootScope.uploadFiles);
                $scope.submitLabel = "EDITAPP";
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 1);
                $cookies.putObject('appData', appData, { expires: cookieExp});   //console.log(submission) 
                $scope.formData = angular.copy(submission);
                $scope.template = submission.template;                          // console.log($scope.template)   
                $scope.uneditable = true;
                
            }        
        };
        $scope.delete = function(submission,index){                 //console.log(submission)

            ModalService.showModal({
                templateUrl: "tpl/modal.html",
                controller: "YesNoController",
                preClose: function(modal){ modal.element.modal('hide'); },
                inputs:{
                    title: "Delete an Application? "
                }
            }).then(function(modal) {
                //it's a bootstrap element, use 'modal' to show it
                modal.element.modal();
                modal.close.then(function(result) {                                           //console.log(result);
                    if(!result) return;
                    if(result.appNumber !== submission.folder) return;
                    toastr.success("Application ID " + submission.id + " deleted");     //console.log(index);
                    $scope.submissions.splice(index, 1);
                    if($rootScope.appData && $rootScope.appData.id === submission.id) $scope.exitApp();
                    //ApplicationApiService.DeleteApplicationById(submission.id, $rootScope.userData).then(function(result){});
                });
            });
        };
       
        function getTemplateList(){
            TemplateApiService.GetTemplateList($rootScope.userData).then(function(result){             //console.log(result)
                $scope.templates = result; 
            });
        }
    };
    //}]);
    /*angular.module('MetronicApp').controller('YesNoController', ['$scope', 'close', function($scope, close) {
        $scope.close = function(result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };
    }]);*/
    function YesNoController($scope, $element, title, close){
        $scope.title = title;
        $scope.close = function(result) {
            close({appNumber: $scope.appNumber}, 300); // close, but give 500ms for bootstrap to animate
        };
    }

