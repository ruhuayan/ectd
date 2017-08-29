(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .factory('storeService', storeService);

   storeService.$inject = ['$http', '$cookies', '$rootScope'];

    function storeService($http, $cookies, $rootScope) {
         console.log("service");

         var storedObject =null;
            return {
                set: function (o) {
                    this.storedObject = o;
                },
                get: function () {
                     console.log("time");
                    return this.storedObject;
                    
                }
            };
        setTimeout(function () {
            console.log("timeout");
             $rootScope.message = "Timeout called!";
        // AngularJS unaware of update to $scope
        }, 200)();


    }   

})();