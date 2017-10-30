angular.module('MetronicApp').controller('DashboardController', [ '$rootScope', '$scope', '$cookies', '$state', "ApplicationApiService", 
    function( $rootScope, $scope, $cookies, $state, ApplicationApiService) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        //App.initAjax();
    });
    
    $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
    if($rootScope.applications)                                             
            $scope.submissions = $rootScope.applications.slice(0,5);     
    else getUserAppList(1, 50, null);                                             
    
    $scope.edit = function(submission){                                         //console.log("submission: ", submission.id);
        toastr.success('Application ID: '+ submission.id);
        //var submission = ApplicationApiService.GetApplicationById($scope.submissions, id);        //console.log(submision.ectdFileList)
        if(submission){
            $rootScope.appData = ApplicationApiService.ExtractApp(submission);//{"id": submission.id, "appUid": submission.appUid};
            //$rootScope.uploadFiles = submission.ectdFileList;                   console.log($rootScope.uploadFiles);
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('appData', $rootScope.appData, { expires: cookieExp});      //console.log('$rootScope.appData: ', $rootScope.appData); 
            if($rootScope.uploadFiles) delete $rootScope.uploadFiles;
            $state.go("editinfo").then(function() {}); 
        }         
    };
    $scope.view = function(submission){
        toastr.success('View Application ID: '+ submission.id);
        //$state.go("fileupload").then(function() {});      
    };
    $scope.create = function(){
        delete $rootScope.appData;
        if($cookies.get("appData")) $cookies.remove("appData");
        
        $state.go("submission").then(function() {
            //$rootScope.appData = false;
        });
    };
    //var table; 
    $scope.viewall = function(){                                                //console.log($scope.submissions.length)
        $state.go("submission").then(function() {
            console.log($state.current.name);
        }); 
    };

    function getUserAppList(startNo, endNo, callback) {                        
       
        ApplicationApiService.GetClientAppList($rootScope.userData , startNo, endNo).then(function(data){                          //console.log("api service", data.list); 
            if(!data.list) {$rootScope.applications=[]; return;} 
            $rootScope.applications = data.list;                                //console.log($rootScope.applications)
            if(data.list.length>5) $scope.submissions = data.list.slice(0,5);
            if(callback) callback();
        });  
    }
}]);
