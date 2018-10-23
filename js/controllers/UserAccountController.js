angular.module('MetronicApp').controller('UserAccountController', function($rootScope, $scope, $http, $timeout, $state , $cookies, UserApiService) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        //Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    var loginUser = $cookies.getObject('globals');          console.log(loginUser)
    $scope.userData = {}; var userData = {};
    // UserApiService.GetCurrentUser(loginUser).then(function(result){
    //     if(result && result.id) { 
    //         userData = result;                                                  console.log(result);
    //         $scope.userData = angular.copy(userData);                           console.log(result.addressList[0].country);
    //         $scope.userData.country = result.addressList[0].country;
    //     }
    // });

    $scope.provinceCode = {};
    
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
        
    };

    $scope.selectedProvince = function(){
        //$scope.provinceCode = $scope.selectProvince.code;
    };

    $scope.userBasicSubmit = function () {
        if($scope.userForm.$valid){
            var jsonData =JSON.stringify($scope.userData);                          console.log("userData", jsonData);
            //UserApiService.SaveUserAccount(loginUser, jsonData).then(function(result){});
        }
    };
    
    $scope.uneditable = true;
    $scope.toggleEditable = function(){ 
        $scope.uneditable = !$scope.uneditable;
    };
    $scope.cancelInfo = function(){
        $scope.userData = angular.copy(userData); //angular.copy(adminData);
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
        $scope.userForm.$setValidity();
    };
    $scope.submitPass = function(){
        var jsonData =JSON.stringify($scope.passData);                          console.log("passData", jsonData);
        UserApiService.ChangePassword(userData, jsonData).then(function(result){
            
        });
    };
    $scope.cancelPass = function(){
        $scope.passData = {}; //angular.copy(adminData);
        $scope.passForm.$setPristine();
        $scope.passForm.$setUntouched();
        $scope.passForm.$setValidity();
    };
    $scope.submitThumb = function(){        
        var fd=new FormData();                                  //console.log($scope.files);
        
        angular.forEach($scope.files,function(file){
            fd.append('file',file);               
        });                                                         //console.log(fd);

        // $http({
        //     method: 'POST', 
        //     url: 'upload.php',
        //     headers: {'Content-Type': undefined },
        //     data: fd,
        // }).success(function(response) {
        //     console.log(response);
        // });
    };
    
});
