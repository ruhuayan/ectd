angular.module('MetronicApp').controller('UserAccountCtrl', function($rootScope, $scope, $http, $timeout, $state , $cookies, UserApiService) {
    $scope.$on('$viewContentLoaded', function() {
        App.initAjax(); // initialize core components
        //Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu
    });

    var loginUser = $cookies.getObject('globals');          //console.log(loginUser)
    $scope.userData = {}; var userData = {}, companyData = {};
    $scope.companyData = {}; 
    $scope.passData = {};
    UserApiService.GetCurrentUser(loginUser).then(
        function(result){           
            if(result && result.user && result.company) { 
                userData = result.user;  
                companyData = result.company;                                               
                $scope.userData = angular.copy(userData);   
                $scope.companyData = angular.copy(companyData); 
                setProvinces();    
                $scope.editable = result.role === 'ADMIN';              
            }else if(result && result.id){  
                userData = result;                                                 
                $scope.userData = angular.copy(userData);  
                $scope.editable = true;   
            }
    });
    
    var provinces ={"中国": ["北京市", "上海市","天津市", "重庆市", "河北省", "山西省", "內蒙古自治区", "辽宁省", "吉林省", "黑龙江省",  "江苏省", "浙江省", "安徽省", "福建省", "江西省","山东省", "河南省", "湖北省", "湖南省", 
        "广东省", "广西壮族自治区", "海南省", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "台湾省", "香港特别行政区", "澳门特别行政区"],
        "USA": ["California", "Florida", "New Jersey", "New York", "Texas", "Washington"],
        "Canada": ["Quebec", "Ontario", "British Columbia"]
        };

    $scope.countires = ['Canada', 'USA', '中国'];
    // setProvinces();
    $scope.selectedCountry = function(){                                        //console.log($scope.userData.country)
        setProvinces();     
    };
    function setProvinces(){
        var countryCode =  $scope.companyData.country;
        $scope.provinces = provinces[countryCode];
    }
    $scope.accountSubmit = function () {
        if($scope.userForm.$valid){                                
            UserApiService.UpdateAccount(loginUser, $scope.userData).then(
                function(result){                                   console.log(result)
                    if(result){
                        toastr.success('Account updated!');
                    }
                });
        }
    };
    $scope.companySubmit = function(){
        if($scope.companyForm.$valid){         console.log($scope.companyData);
            if($scope.companyData.id){
                UserApiService.UpdateCompany(loginUser, $scope.companyData.id, $scope.companyData).then(
                    function(res){  console.log(res)
                        toastr.success('Company information updated!');
                    }
                );
            }else{
                UserApiService.CreateCompany(loginUser, $scope.companyData).then(
                    function(res){         console.log(res)
                        toastr.success('Company information created!');
                    }
                );
            }
        }
    }
    
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
        if($scope.passForm.$valid){
            UserApiService.ChangePassword(loginUser, $scope.userData.id, $scope.passData).then(
                function(res){   console.log(res)
                    toastr.success('Password reset!');
            });
        }
    };
    $scope.cancelPass = function(){
        $scope.passData = {}; 
        $scope.passForm.$setPristine();
        $scope.passForm.$setUntouched();
        $scope.passForm.$setValidity();
    };
    
    $scope.invite = function(){
        
    }
});
