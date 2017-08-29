angular.module('MetronicApp').controller('UserAccountController', function($rootScope, $scope, $http, $timeout, $state , $cookies) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;

    var loginUser = $cookies.getObject('globals');
    var uid = loginUser.uid;
    var appToken = loginUser.appToken;
    $scope.user = loginUser;

    console.log("appToken:" + loginUser.appToken);
    //set user contact info
    if(loginUser.addressList != null && loginUser.addressList.length > 0){
        $scope.user.address = loginUser.addressList[0].address1;
        $scope.user.zip = loginUser.addressList[0].zip;
        $scope.user.city = loginUser.addressList[0].city,
        $scope.user.phone1 = loginUser.addressList[0].phone,
        $scope.user.phone2 = loginUser.addressList[0].cell,
        $scope.user.email = loginUser.email,
        $scope.selectProvince = loginUser.addressList[0].province;
        $scope.selectCountry = loginUser.addressList[0].country;
    }


    $scope.message = '';
    $scope.provinceCode = {};
    $scope.countryCode = {};
    $scope.provinces = {};
    $scope.selectCountry = {};
    $scope.selectProvince = {};
    $scope.countires = [
        {
            "id": 1,
            "code": "CA",
            "name": "Canada",
            "name_CN": "加拿大",
            "tax": 0.05,
            "taxName": "GST"
        },
        {
            "id": 2,
            "code": "USA",
            "name": "USA",
            "name_CN": "美国"
        },
        {
            "id": 3,
            "code": "CN",
            "name": "China",
            "name_CN": "中国"
        }
    ]

    $scope.selectedCountry = function(){
        $scope.countryCode =  $scope.selectCountry.code;
        if($scope.countryCode == null){
            $scope.countryCode = 'CA';
        }
        $http({
            method: 'GET',
            url: 'http://192.168.88.187:8080/ecvcms/a/addresses/provinceList/'+$scope.countryCode+'?uid=' + uid + "&apptoken=" + appToken,
            data: $scope.userData,
        }).success(function (data, status) {
            if(status == 200){
                $scope.provinces = data;
            }
        }).error(function (data, status) {
            // Some error occurred
            $scope.error = "Get province list fail cause: " + data.exception.message;
        });
    }

    $scope.selectedProvince = function(){
        $scope.provinceCode = $scope.selectProvince.code;
    };

    $scope.userBasicSubmit = function () {
        var defaultAddressId ;
        if(loginUser.addressList == undefined || loginUser.addressList.length <= 0){
            defaultAddressId = null;
        }else {
            defaultAddressId = loginUser.addressList[0].id;
        }

        var userData = {
            "uid": uid,
            "userName": $scope.user.userName,
            "firstName": $scope.user.firstName,
            "lastName": $scope.user.lastName,
            "email" :  $scope.user.email,
            "addressList": [
                {
                    "id" : defaultAddressId,
                    "phone": $scope.user.phone1,
                    "cell": $scope.user.phone2,
                    "email1": $scope.user.email,
                    "address1":  $scope.user.address,
                    "city":  $scope.user.city,
                    "zip":  $scope.user.zip,
                    "province": {
                        "code": $scope.provinceCode
                    },
                    "country": {
                        "code": $scope.countryCode
                    }
                }
            ]
        }

        $http({
            method: 'POST',
            url: 'http://192.168.88.187:8080/ecvcms/a/users/myAccount/update?uid=' + uid + "&apptoken=" + appToken,
            //url: 'http://192.168.88.187:8080/ecvcms/a/users/loginUser?uid=' + uid + "&apptoken=" + appToken,
            //url: 'http://192.168.88.187:8080/ecvcms/a/users/uid/d8f02554ed8247eba591796f0ede03f9?uid=' + uid + "&apptoken=" + appToken,
            data: userData,
        }).success(function (data, status) {
            if(status == 200){
                $scope.user = data;
                if(data.addressList != null && data.addressList.length > 0){
                    $scope.user.address = data.addressList[0].address1;
                    $scope.user.zip = data.addressList[0].zip;
                    $scope.user.city = data.addressList[0].city,
                    $scope.user.phone1 = data.addressList[0].phone,
                    $scope.user.phone2 = data.addressList[0].cell,
                    $scope.selectProvince = data.addressList[0].province;
                    $scope.selectCountry = data.addressList[0].country;
                }
                console.log("uid:" + $scope.user.uid);
                console.log("Username:" + $scope.user.userName);
                console.log("Address:" + $scope.user.addressList[0].address1);
                console.log("status : " + status);
            }
        }).error(function (data, status) {
            // Some error occurred
            $scope.error = status + "!Submit user profile fail cause: " + data;
            console.log(status + "! Submit user profile fail cause " + $scope.error);
        });
    };

});
