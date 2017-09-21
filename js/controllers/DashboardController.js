angular.module('MetronicApp').controller('DashboardController', [ '$rootScope', '$scope', '$cookies', '$state', "ApplicationApiService",
    function( $rootScope, $scope, $cookies, $state, ApplicationApiService) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        //App.initAjax();
    });
    
    var userData = JSON.parse($cookies.get('globals'));                         //console.log(userData);
    
    getUserAppList(1, 5, null);                                             
    
    $scope.edit = function(id){
        toastr.success('Application ID: '+id);
        var submission = getSubById(id);                                        //console.log(getSubById(id))
        if(submission){
            var cookieExp = new Date();
            cookieExp.setDate(cookieExp.getDate() + 1);
            $cookies.putObject('appData', submission, { expires: cookieExp}); 
            $state.go("fileupload").then(function() {});
        }         
    };
    $scope.view = function(id){
        toastr.success('View Application ID: '+id);
        //$state.go("fileupload").then(function() {});
                
    };
    $scope.create = function(){
        if($cookies.get("appData")) $cookies.remove("appData");
        $state.go("submission").then(function() {});
    };
    $scope.viewall = function(){                                                //console.log($scope.submissions.length)
        if($scope.submissions.length>=5){
            if($scope.showMore){
                getUserAppList(1, 5, function(){$("#panel").show();}); 
                //$("#panel").show();
            }else{
                $("#panel").hide();
                getUserAppList(1, 10, null);
            }
            
            $scope.showMore = !$scope.showMore; 
        }
        
    };

    function getSubById(id){
        var submission;
        angular.forEach($scope.submissions, function(value, key){ 
           if(value.id ===id) {submission=value; }
        });
        return submission;
    }

    function getUserAppList(startNo, endNo, callback) {                         //console.log(callback);
        /*$.get(baseURL + "/a/eCTDTemplate/list?uid=" +userData.uid+"&apptoken="+userData.access_token, function(result){
            //console.log(result);
        });*/
        ApplicationApiService.GetClientAppList(userData, startNo, endNo).then(function(data){                         // console.log("api service", data); 
            $scope.submissions = data.list;
            if(callback) callback();
        });  
    }
}]);

/*var submissions = [{'id': '56787','description': 'Drug_5', 'folder': 'xxxxxxx5', "version": "0000", 'uploadDate':'2017-07-12', 'submitDate': null},
    {'id': '5344', "description":"Drug-4", 'folder': 'xxxxxxx4',"version": "0000", 'uploadDate':'2017-07-11', 'submitDate': null},
    {'id': '34343',"description":"Drug-3", 'folder': 'xxxxxxx3',"version": "0000", 'uploadDate':'2017-07-10', 'submitDate': null},
    {'id': '9797', "description":"Drug-3", 'folder': 'xxxxxxx2', "version": "0000", 'uploadDate':'2017-07-05', 'submitDate': '2017-07-09'},
    {'id': '87876', "description":"Drug-3", 'folder': 'xxxxxxx1', "version": "0000", 'uploadDate':'2017-07-02', 'submitDate': '2017-07-06'}];*/