angular.module('MetronicApp').controller('DashboardController', [ '$rootScope', '$scope', '$cookies', '$state', "ApplicationApiService", 
    function( $rootScope, $scope, $cookies, $state, ApplicationApiService) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        //App.initAjax();
    });
    
    var userData = JSON.parse($cookies.get('globals'));                         //console.log(userData);
    if($rootScope.applications)                                             
            $scope.submissions = $rootScope.applications.slice(0,5);     
    else getUserAppList(1, 50, null);                                             
    
    $scope.edit = function(submission){                                         //console.log("submission: ", submission.id);
        toastr.success('Application ID: '+ submission.id);
        //var submission = ApplicationApiService.GetApplicationById($scope.submissions, id);        //console.log(submision.ectdFileList)
        if(submission){
            var appData = ApplicationApiService.ExtractApp(submission);//{"id": submission.id, "appUid": submission.appUid};
            //$rootScope.uploadFiles = submission.ectdFileList;                   console.log($rootScope.uploadFiles);
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('appData', appData, { expires: cookieExp});      console.log('appData: ', appData); 
            if($rootScope.uploadFiles) delete $rootScope.uploadFiles;
            $state.go("fileupload").then(function() {}); 
        }         
    };
    $scope.view = function(submission){
        toastr.success('View Application ID: '+ submission.id);
        //$state.go("fileupload").then(function() {});      
    };
    $scope.create = function(){
        if($cookies.get("appData")) $cookies.remove("appData");
        $state.go("submission").then(function() {});
    };
    //var table; 
    $scope.viewall = function(){                                                //console.log($scope.submissions.length)
        $state.go("submission").then(function() {}); 
    };

    function getUserAppList(startNo, endNo, callback) {                        
       
        ApplicationApiService.GetClientAppList(userData, startNo, endNo).then(function(data){                          //console.log("api service", data.list); 
            if(!data.list) {$rootScope.applications=[]; return;} 
            $rootScope.applications = data.list;                                //console.log($rootScope.applications)
            if(data.list.length>1) $scope.submissions = data.list.slice(0,5);
            if(callback) callback();
        });  
    }
}]);
