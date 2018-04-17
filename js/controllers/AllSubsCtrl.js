angular.module('MetronicApp')
    .controller('AllsubsCtrl', ['$scope', '$rootScope',  '$state',  '$translate',  'CookiesApiService', 'ApplicationApiService',
        function($scope, $rootScope, $state, $translate, CookiesApiService, ApplicationApiService) {

        var appUid;                                                console.log("allsubs ctrl");
        if(CookiesApiService.GetCookies()){
            appUid = $rootScope.appData.appUid;
            JsTree.userData = JsTree.userData || $rootScope.userData;
        }                                                                       
    }]);


