angular.module('MetronicApp')
    .controller('AllsubsCtrl', ['$scope', '$rootScope',  '$state', '$cookies', 'ApplicationApiService',
        function($scope, $rootScope, $state, $cookies, ApplicationApiService) {

        $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        var json = [{id: "sub1", text: "Submissions", type: "root", parent: "#", state: {opened: true}}]
        if($rootScope.applications) { //console.log($rootScope.applications);
            $scope.submissions = groupBy($rootScope.applications, "folder");     console.log($scope.submissions);
            getTreeJson($scope.submissions);
            SubTree.initTree(json);
        } else {    
            getUserAppList(1, 50, function(dataList){
                $rootScope.applications = dataList;
                $rootScope.submissions = groupBy(dataList, "folder");         console.log($scope.submissions);
                getTreeJson($scope.submissions) ;
                SubTree.initTree(json);
                SubTree.setTheme();
            });                                                                                      //console.log("Applications loading...");
        }
        function getTreeJson(list){
            angular.forEach(list, function(value, key){   //console.log(value);
                
                if(value.length > 1){
                    var node = {id: key, parent: 'sub1', text: key};
                    json.push(node);
                    angular.forEach(value, function(v, k){
                        var subNode = {id: v.appUid, parent: key, text: v.version};
                        json.push(subNode);
                    });
                }else {
                    var node = {id: value[0].appUid, parent: 'sub1', text: key};
                    json.push(node);
                }
                    
            });                             //console.log(json);
        }
        function getUserAppList(startNo, endNo, callback) {                        
            ApplicationApiService.GetClientAppList($rootScope.userData , startNo, endNo).then(function(data){                          //console.log("api service", data.list); 
                if(!data.list) {$rootScope.applications=[]; return;}
                else if(callback) callback(data.list); 
                // $rootScope.applications = groupBy(data.list, "folder");                                console.log($rootScope.applications)
                // if(data.list.length>10) $scope.submissions = data.list.slice(0,10);
            });  
        }
        function groupBy(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});         
        }  
        $scope.showAppTree = function(appUid){
            ApplicationApiService.GetApplication(appUid, $rootScope.userData).then(function(result){     //console.log("appData ", JsTree);
                if(result && result.nodeList){                      console.log('subFiles: ', result.nodeList);
                    if(AppTree.firstLoad)
                        AppTree.initTree(result.nodeList); 
                    else     
                        AppTree.refreshTree(result.nodeList);                              
                }  
            });
        }
        
    }]);


