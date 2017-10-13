angular.module('MetronicApp').controller('DashboardController', [ '$rootScope', '$scope', '$cookies', '$state', "ApplicationApiService", 
    function( $rootScope, $scope, $cookies, $state, ApplicationApiService) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        //App.initAjax();
    });
    
    var userData = JSON.parse($cookies.get('globals'));                         //console.log(userData);
    
    getUserAppList(1, 50, null);                                             
    
    $scope.edit = function(id){
        toastr.success('Application ID: '+id);
        var submission = ApplicationApiService.GetApplicationById($scope.submissions, id);        //console.log(submision.ectdFileList)
        if(submission){
            var appData = ApplicationApiService.ExtractApp(submission);//{"id": submission.id, "appUid": submission.appUid};
            //$rootScope.uploadFiles = submission.ectdFileList;                   console.log($rootScope.uploadFiles);
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('appData', appData, { expires: cookieExp});     //console.log(appData); 
            if($rootScope.uploadFiles) delete $rootScope.uploadFiles;
            $state.go("fileupload").then(function() {});
            
        }         
    };
    $scope.view = function(id){
        toastr.success('View Application ID: '+ id);
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

    /*function getSubById(id){
        var submission;
        angular.forEach($scope.submissions, function(value, key){ 
           if(value.id ===id) {submission=value; }
        });
        return submission;
    }*/

    function getUserAppList(startNo, endNo, callback) {                        
       
        ApplicationApiService.GetClientAppList(userData, startNo, endNo).then(function(data){                          //console.log("api service", data.list); 
            $rootScope.applications = data.list;                                //console.log($rootScope.applications)
            if(data.list.length>1) $scope.submissions = data.list.slice(0,5);
            if(callback) callback();
        });  
    }
}]);

/*var submissions = [{'id': '56787','description': 'Drug_5', 'folder': 'xxxxxxx5', "version": "0000", 'uploadDate':'2017-07-12', 'submitDate': null},
    {'id': '5344', "description":"Drug-4", 'folder': 'xxxxxxx4',"version": "0000", 'uploadDate':'2017-07-11', 'submitDate': null},
    {'id': '34343',"description":"Drug-3", 'folder': 'xxxxxxx3',"version": "0000", 'uploadDate':'2017-07-10', 'submitDate': null},
    {'id': '9797', "description":"Drug-3", 'folder': 'xxxxxxx2', "version": "0000", 'uploadDate':'2017-07-05', 'submitDate': '2017-07-09'},
    {'id': '87876', "description":"Drug-3", 'folder': 'xxxxxxx1', "version": "0000", 'uploadDate':'2017-07-02', 'submitDate': '2017-07-06'}];*/