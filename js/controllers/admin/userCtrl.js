angular.module('MetronicApp').controller('UserCtrl', ['$rootScope','$scope','$state','$cookies', 'UserApiService', 'ModalService', "DTOptionsBuilder",
    function($rootScope, $scope, $state, $cookies, UserApiService, ModalService, DTOptionsBuilder) {
        $scope.admin = true;
        $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        var dtOptions = {
                    sEmptyTable: "Empty Table",
                    order: [4, 'desc'],                   
                    lengthMenu: [5, 10],
                    columnDefs: [{
                         targets: 3,
                         responsivePriority: 1,
                         filterable: false,
                         sortable: false,
                         orderable: false
                     }]
                };
        UserApiService.GetUserList($rootScope.userData, 1, 50).then(function(result){
           if(result && result.list){
                $scope.userList = result.list;
                $scope.dtOptions = dtOptions;
           }
        });
        console.log($state.current.url)
    }]);