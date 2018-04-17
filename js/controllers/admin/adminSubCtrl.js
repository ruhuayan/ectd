angular.module('MetronicApp').controller('AdminSubCtrl', ['$rootScope','$scope','$state','$cookies', 'ApplicationApiService',
 'ModalService', "DTOptionsBuilder", "DTColumnBuilder", 
    function($rootScope, $scope, $state, $cookies, ApplicationApiService, ModalService, DTOptionsBuilder, DTColumnBuilder,) {
        
        $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
        /*var dtOptions = {
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
        };*/
        $scope.submissions = [{}];
        ApplicationApiService.GetApplicationList($rootScope.userData, 1, 100).then(function(result){
           if(result && result.list){
                $scope.submissions = result.list;
                /* $scope.dtOptions = DTOptionsBuilder.newOptions() //.fromSource(APIROOT + 'admin-menus')
                    .withOption('order', [2, "desc"])
                    .withOption('lengthMenu', [5, 10]);
                   .withOption('createdRow', function (row, data, dataIndex) {
                        // Recompiling so we can bind Angular directive to the DT
                        $compile(angular.element(row).contents())($scope);
                    });;*/
           }
        });
         
        $scope.delete = function(submission,index){                 console.log(submission, index)

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
                    
                    $scope.submissions.splice(index, 1);   //$scope.dtInstance.rerender();
                    
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