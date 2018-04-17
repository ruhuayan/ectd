(function() {
    'use strict';
    angular
        .module('MetronicApp')
        .factory('CookiesApiService', CookiesApiService);

    CookiesApiService.$inject = ['$rootScope', '$state', '$cookies', '$translate'];

    function CookiesApiService($rootScope, $state, $cookies, $translate) {
        
        var service = {};
        service.GetCookies = function(){
            $rootScope.userData = $rootScope.userData || JSON.parse($cookies.get('globals'));
            if(!$rootScope.appData){
                if($cookies.get("appData")){ 
                    $rootScope.appData = JSON.parse($cookies.get("appData"));
                    return true;
                }
                if($state.current.name == "submission"){
                    return false; 
                }
                $state.go("submission").then(function(){
                    $translate("WARNING_NOAPP").then(function(translation){
                        toastr.warning(translation);
                    });
                });
                return false;
            }
            return true;
        };
        return service;
    }

})();


