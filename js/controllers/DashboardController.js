angular.module('MetronicApp').controller('DashboardController', [ '$rootScope', '$scope', '$cookies', '$state', function( $rootScope, $scope, $cookies, $state) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });

    $scope.submissions = submissions;
    
    $scope.edit = function(id){
        toastr.success('Application ID: '+id);
        var submission = getSubById(id);                                          //console.log(getSubById(id))
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
    $scope.viewall = function(){
        toastr.success('page not ready');
    };

    //var userData = JSON.parse($cookies.get('globals'));
    function getSubById(appID){
        var submission;
        angular.forEach(submissions, function(value, key){ 
           if(value.appID ===appID) {submission=value; }
        });
        return submission;
    }

    function initController() {
        //loadPostList();
    }
}]);

var submissions = [{'appID': '56787','description': 'Drug_5', 'folder': 'xxxxxxx5', "version": "0000", 'uploadDate':'2017-07-12', 'submitDate': null},
    {'appID': '5344', "description":"Drug-4", 'folder': 'xxxxxxx4',"version": "0000", 'uploadDate':'2017-07-11', 'submitDate': null},
    {'appID': '34343',"description":"Drug-3", 'folder': 'xxxxxxx3',"version": "0000", 'uploadDate':'2017-07-10', 'submitDate': null},
    {'appID': '9797', "description":"Drug-3", 'folder': 'xxxxxxx2', "version": "0000", 'uploadDate':'2017-07-05', 'submitDate': '2017-07-09'},
    {'appID': '87876', "description":"Drug-3", 'folder': 'xxxxxxx1', "version": "0000", 'uploadDate':'2017-07-02', 'submitDate': '2017-07-06'}];