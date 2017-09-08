angular.module('MetronicApp').controller('UserAccountController', function($rootScope, $scope, $http, $timeout, $state , $cookies) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    var loginUser = $cookies.getObject('globals');
    var uid = loginUser.uid;
    var appToken = loginUser.access_token;
    //$scope.userData = loginUser;

    $scope.provinceCode = {};
    $scope.userData = {};
    var provinces ={"CN": ["北京市", "上海市","天津市", "重庆市", "河北省", "山西省", "內蒙古自治区", "辽宁省", "吉林省", "黑龙江省",  "江苏省", "浙江省", "安徽省", "福建省", "江西省","山东省", "河南省", "湖北省", "湖南省", 
        "广东省", "广西壮族自治区", "海南省", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "台湾省", "香港特别行政区", "澳门特别行政区"],
        "USA": ["California", "Florida", "New Jersey", "New York", "Texas", "Washington"],
        "CA": ["Quebc", "Ontario", "British Columbia"]
        };
    var cities = {};
    $scope.countires = [{
            "id": 1,
            "code": "CN",
            "name": "China",
            "name_CN": "中国"
            
        },{
            "id": 2,
            "code": "USA",
            "name": "USA",
            "name_CN": "美国"
        },{
            "id": 3,
            "code": "CA",
            "name": "Canada",
            "name_CN": "加拿大",
            "tax": 0.05,
            "taxName": "GST"
        }];
    
    $scope.selectedCountry = function(){                                        //console.log($scope.userData.country)
        var countryCode =  $scope.country.code;
        if(countryCode == null){
            countryCode = 'CN';
        }
        $scope.provinces = provinces[countryCode];
        $scope.userData.country = $scope.country.code;
        /*$http({
            method: 'GET',
            url: 'http://192.168.88.187:8080/ecvcms/a/addresses/provinceList/'+countryCode+'?uid=' + uid + "&apptoken=" + appToken
            //data: $scope.userData,
        }).success(function (data, status) {
            if(status == 200 && data!=null){
                $scope.provinces = data;
            }
        }).error(function (data, status) {
            // Some error occurred
            $scope.error = "Get province list fail cause: " + data.exception.message;
        });*/
    };

    $scope.selectedProvince = function(){
        //$scope.provinceCode = $scope.selectProvince.code;
    };

    $scope.userBasicSubmit = function () {
        
        var jsonData =JSON.stringify($scope.userData);                          console.log("userData", jsonData);
        /*$http({
            method: 'POST',
            url: 'http://192.168.88.187:8080/ecvcms/a/users/myAccount/update?uid=' + uid + "&apptoken=" + appToken,
            data: userData,
        }).success(function (data, status) {
            if(status == 200){
               
            }
        }).error(function (data, status) {
            // Some error occurred
            $scope.error = status + "!Submit user profile fail cause: " + data;
            console.log(status + "! Submit user profile fail cause " + $scope.error);
        });*/
    };
    
    $scope.isStringNumberic = function(s){
            var x = + s;                                         //console.log('x', x.toString() === s);
            return x === parseInt(s);
    };
    $scope.uneditable = true;
    $scope.toggleEditable = function(){ 
        $scope.uneditable = !$scope.uneditable;
    };
    $scope.cancelInfo = function(){
        $scope.userData ={}; //angular.copy(adminData);
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
        $scope.userForm.$setValidity();
    };
});
