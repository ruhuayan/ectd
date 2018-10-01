angular.module('MetronicApp').controller('SubmissionCtrl', ['$rootScope','$scope','$state','$cookies','$stateParams','CookiesApiService', 'ApplicationApiService',
'TemplateApiService', 'ModalService', "DTOptionsBuilder",
    function($rootScope, $scope, $state, $cookies, $stateParams, CookiesApiService, ApplicationApiService, TemplateApiService, ModalService, DTOptionsBuilder) {
        
        $scope.changeLanguage($stateParams['lang']);
        // var dest = $stateParams['lang']=="cn"? "中國" : "USA";

        var appData; 
        if(CookiesApiService.GetCookies())
            appData = $rootScope.appData;
        else {
            appData = {"sequence": "0000"};                            //console.log('app data:', $rootScope.userData.role==="Admin");
        }
        var dtOptions = {
                    sEmptyTable: "Empty Table",
                    order: [3, 'desc'],                   
                    lengthMenu: [5, 10],
                    columnDefs: [{
                         targets: 3,
                         responsivePriority: 1,
                         filterable: false,
                         sortable: false,
                         orderable: false
                     }]
                };
        $scope.dtInstance = {};
        $scope.submissions = [{}];                    // to make sure data-table has json data
        if($rootScope.applications) {
            $scope.submissions = $rootScope.applications;
            $scope.dtOptions = dtOptions;
        } else {                                                                                          //console.log("Applications loading...");
            ApplicationApiService.GetClientAppList($rootScope.userData, 1, 50).then(function(data){   console.log("api service", data);
                if(!data) {$rootScope.applications=[]; return;}
                $scope.submissions =  $rootScope.applications = data;//.slice(0,8);        //console.log($rootScope.applications)
                $scope.dtOptions = dtOptions;
            });
        }
        getTemplateList();                         // to create templates                                            
        if(appData.id){                                         
            $scope.submitLabel = "EDITAPP";
            $scope.uneditable = true;
        }else{
            $scope.submitLabel = "CREATEAPP"; 
            $scope.uneditable = false;
        }
        $scope.formData = angular.copy(appData);

        $scope.toggleEditable = function(){
            $scope.uneditable =!$scope.uneditable;
        };
        
        $scope.createApp = function(){      //console.log($scope.subForm);                               
            if(!$scope.subForm.$invalid){
                // var tid =  $scope.template.id || JSON.parse($scope.template).id;
                // $scope.formData.template = {'id': tid};                         //console.log("template", tid);
                // var jsonData = $scope.formData;                                 //console.log("appdata: ", jsonData);
                
                if(appData.id){                           console.log($scope.formData);
                    
                    ApplicationApiService.ApplicationUpdate($rootScope.userData, $scope.formData, appData.id).then(function(result){                    console.log(result);
                        if(result.id){
                            toastr.success("Updated Application number: " + result.number);
                            $rootScope.appData = result; 
                            var cookieExp = new Date();
                            cookieExp.setDate(cookieExp.getDate() + 1);
                            $cookies.putObject('appData', $rootScope.appData, { expires: cookieExp});   
                            delete $rootScope.applications;        
                            $state.go("editinfo").then(function() {}); 
                        }
                    });
                }else{
                    $scope.formData.template = $scope.template;             console.log($scope.formData);
                    App.blockUI({
                        target: $("body"),
                        message: " Load ...",
                        //animate: true,
                        overlayColor: "#999"//'#d9534f'
                    });
                    ApplicationApiService.ApplicationCreate($rootScope.userData, $scope.formData).then(function(result){                      console.log(result);      // res.success ==false
                        if(result.id){
                            App.unblockUI($("body"));
                            $rootScope.appData = result;
                            toastr.success("Create Application number: " + result.number);
                            var cookieExp = new Date();
                            cookieExp.setDate(cookieExp.getDate() + 1);
                            $cookies.putObject('appData', $rootScope.appData, { expires: cookieExp});
                            delete $rootScope.applications; 
                            $state.go("editinfo").then(function() {}); 
                        } else{
                            App.unblockUI($("body"));
                            toastr.warning("Error Creating Application number: ");
                        }
                    })
                }
            }   
            
        };
        $scope.cancelApp = function(){ 
            $scope.formData= angular.copy(appData);
            $scope.subForm.$setPristine();
            $scope.subForm.$setValidity();
            $scope.subForm.$setUntouched();
        };
         
        $scope.exitApp = function(){
            $cookies.remove("appData");
            $rootScope.appData = false;
         
            appData = {"sequence": "0000"};
            $scope.formData= angular.copy(appData);;
            $scope.submitLabel = "CREATEAPP"; 
            // $scope.template= {};
            if(!$scope.templates) getTemplateList();

            $scope.uneditable = false;
        };
        
        $scope.view = function(application){   console.log(application)
            toastr.success('View Application number: '+ application.number); 
            // go to view page   
        };
        $scope.edit = function(application){                                             console.log(application)
            toastr.success("Application number: " + application.number);
          
            if(application){
                $rootScope.appData = appData = application; // appData = ApplicationApiService.ExtractApp(submission);
                $scope.submitLabel = "EDITAPP";
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 1);
                $cookies.putObject('appData', appData, { expires: cookieExp});  
                $scope.formData = angular.copy(application);
                $scope.uneditable = true;
                
            }        
        };
        $scope.delete = function(submission,index){                 //console.log(submission)

            ModalService.showModal({
                templateUrl: "tpl/modal.html",
                controller: function($scope, title, close){
                    $scope.title = title;
                    $scope.close = function(result) {
                        close({appNumber: $scope.appNumber, sequence: $scope.sequence}, 300); // close, but give 500ms for bootstrap to animate
                    };
                },
                preClose: function(modal){ modal.element.modal('hide'); },
                inputs:{
                    title: "Delete an Application? "
                }
            }).then(function(modal) {
                //it's a bootstrap element, use 'modal' to show it
                modal.element.modal();
                modal.close.then(function(result) {                                           //console.log(result);
                    if(!result) return;
                    if(result.appNumber !== submission.folder || result.sequence !== submission.version) return;

                    $scope.submissions.splice(index, 1);
                    // $scope.dtOptions = DTOptionsBuilder.fromSource($scope.submissions);
                    $scope.dtInstance._renderer.rerender();

                    if($rootScope.appData && $rootScope.appData.id === submission.id) $scope.exitApp();
                    ApplicationApiService.DeleteApplication(submission.id, $rootScope.userData).then(function(result){ console.log(result);
                        
                        toastr.success("Application " + submission.folder + " deleted");
                    });

                });
            });
        };
        
        function getTemplateList(){
            TemplateApiService.GetTemplateList($rootScope.userData).then(function(result){             //console.log(result)
                $scope.templates = result; 
            });
        }
    //};
    }]);

   