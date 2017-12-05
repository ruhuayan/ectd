angular.module('MetronicApp').controller('AdminSubCtrl', ['$rootScope','$scope','$state','$cookies', 'ApplicationApiService',
 'ModalService', "DTOptionsBuilder", 
    function($rootScope, $scope, $state, $cookies, ApplicationApiService, ModalService, DTOptionsBuilder) {
        
        $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        var dtOptions = {
                    sEmptyTable: "Empty Table",
                    order: [2, 'desc'],                   
                    lengthMenu: [5, 10],
                    columnDefs: [{
                         targets: 3,
                         responsivePriority: 1,
                         filterable: false,
                         sortable: false,
                         orderable: false
                     }]
                };
        ApplicationApiService.GetApplicationList($rootScope.userData, 1, 50).then(function(result){
           if(result && result.list){
                $scope.subList = result.list;
                $scope.dtOptions = dtOptions;
           }
        });
        $scope.dtInstance = {};
        /*DTInstances.getLast().then(function(instance) {
            dtInstance = instance;
        });*/
        $scope.delete = function(submission,index){                 //console.log(submission)

            ModalService.showModal({
                templateUrl: "tpl/modal.html",
                controller: "DelYesNoCtrl",
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
                    
                    $scope.subList.splice(index, 1);   //$scope.dtInstance.rerender();
                    $scope.dtOptions = dtOptions;
                    //console.log($scope.subList);
                    $scope.dtInstanceCallback = function (_dtInstance) {
                        //console.log(_dtInstance);
                        
                        //$scope.dtInstance = _dtInstance;
                        //$scope.dtInstance.reloadData();
                        //$scope.dtOptions = dtOptions;
                    };
                    ApplicationApiService.DeleteApplication(submission.appUid, $rootScope.userData).then(function(result){ console.log(result);
                        toastr.success("Application " + submission.folder + " deleted");
                        
                    });

                });
            });
        };
        
    }]);

    function DelYesNoCtrl($scope, $element, title, close){
        $scope.title = title;
        $scope.close = function(result) {
            close({appNumber: $scope.appNumber}, 300); // close, but give 500ms for bootstrap to animate
        };
    }