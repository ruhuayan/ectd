angular.module('MetronicApp').controller('UserCtrl', ['$rootScope','$scope','$state','$cookies', 'UserApiService', 'ModalService', "DTOptionsBuilder",
    function($rootScope, $scope, $state, $cookies, UserApiService, ModalService, DTOptionsBuilder) {
        
        $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        /*var dtOptions = {
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
                }; */
        $scope.userList = [{}];
        UserApiService.GetUserList($rootScope.userData, 1, 100).then(function(result){
           if(result && result.list){
                $scope.userList = result.list;
                /*$scope.dtOptions = DTOptionsBuilder.newOptions() 
                    .withOption('order', [4, "desc"])
                    .withOption('lengthMenu', [5, 10]);*/
                //$scope.dtOptions = dtOptions;
           }
        });
        $scope.delete = function(user, index){          console.log(user, index)
            $scope.userList.splice(index, 1); 
            /*$scope.dtOptions = DTOptionsBuilder.newOptions() 
                    .withOption('order', [4, "desc"])
                    .withOption('lengthMenu', [5, 10]);*/
        }      
        $scope.edit = function(user){
            
        }       
    }]);