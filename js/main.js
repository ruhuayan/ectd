var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    'pascalprecht.translate'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);
MetronicApp.config(["$translateProvider", function($translateProvider) {

    var en_translations = {
       /* SIDEBAR */
        DASHBOARD: "DashBoard",
        SUBMISSION: "My Submission",
        UPLOAD: "File Upload",
        EDITINFO: "Edit Info",
        EDITLINK: "Edit Link",
        BALANCE: "Balance",
        SETTINGS: "Settings",
        LOGOUT: "Logout",
        
        /* DASHBOARD*/
        HOME: 'Home',
        DESCRIPTION: "Description", 
        TITLE: "Title",
        UPLOADDATE: "Upload Date",
        SUBMITDATE: "Submit Date", 
        ACTION: "Action", 
        EDIT: "Edit",
        VIEW: "View",
        VIEWALL: "View All Submissions", 
        CREATENEW: "Create a New Application", 
        
        /* SUBMISSION */
        PLANNEDSUB: "planned submission",
        DOCUMENT: "Document",
        APPFOLDER: "Application Folder", 
        VERSION: "Version", 
        SEQUENCE: "Sequence", 
        COMPILATION: "Compilation in Progress", 
        REG_ACT: "Regulatory Activity", 
        REG_ACT_ID: "Regulatory Activity ID", 
        CANCEL: "Cancel", 
        CREATEAPP: "Create Application",
        EDITAPP: "Edit Application", 
        OBJECT: "Object",
        
        /* LOGIN */
        LOGINTO: "LOG INTO",
        SYSTEM: "SYSTEM",
        LOGIN: 'LOGIN',
        REGISTER: "Register",
        FORGOTPW: 'Forgot password?',
        USERNAME: "Username",
        HAVEACC: 'Have an account？',
        PW: 'Password',
        NOACC: 'Don\'t have an account？',
        
        /* UPLOAD*/
        UPQUEUE: "Upload Queue",
        UPFILES: "Uploaded Files", 
        CHOOSEFILE: "Choose File",
        MAXFILE: "(Max: 10 files)",
        MAXSIZE: "(Max Size: 3mb)",
        NAME: "Name", 
        SIZE: "Size",
        PROGRESS: "Progress",
        STATUS: "Status",
        UPLOADALL: "Upload all",
        CANCELALL: "Cancel all",
        REMOVEALL: "Remove all",
        SAVE: 'Save',
        
        PRICE: 'Price',
         CONTACTUS: 'Contact us',
         //header
        LANGUAGE: 'Language',
        USER: 'User',
        MYPROFILE: 'My Profile',
        UPGRADE: 'Purchase Power',
       
        //sidebar
      
        ORDERS: 'My Orders',
        TRANSACTIONS: 'Payouts',
        //dashboard
        HASHRATE: 'Hash Rate',
        UNPAIDBAL: 'Unpaid Balance',
        MININGSUM: 'Mining Summary (Ethereum)',
        TOTALETH: 'Total Ethereum',
        TOTALDOLLAR: 'Total Dollar',
        STARTTIME: 'Start Date',
        MINETIME: 'Mining Time',
        MONTH: 'Month',
        DATE: 'Paid on',
        DURATION: 'Duration',
        ESTIMATE: 'Estimated Earnings',
        CURRENT: '(BASED ON YOUR CURRENT HASH RATE)',
        CAD:'Canadian dollar',
        CNY:'Chinese Yuan',
        WEEK:'Week',
        YEAR:'Year',
        DAY: 'Day',
        FIVEYEARS: 'Five Years',
        TOTALBAL:'Total Balance',
        PAIDETH:'Paid',
        TOTALINDOLLAR: 'Total balance in Canadian Dollar',
        //User page
        FNAME:'First Name',
        LNAME: 'Last Name',
        MOBILE:'Mobile Number',
        EMAIL:'Email',
        PROFILE:'Profile account',
        PERSONALINFO: 'Personal Info',
        WALLET: 'Wallet',
        CHANGEPW: 'Change Password',
        SETUP: 'Set up Wallet here',
        CURPW: 'Current Password',
        NEWPW: 'New Password',
        REPW: 'Re-type New Password',
        
        
        //Upgrade page
        MININGPOWER: 'Mining Power',
        HASHPOWER: 'Hash Power (MH): ',
        ESTIMATERET: 'Estimate Return',
        CURRATE: 'Current Rate: ',
        ETHPERMONTH: 'Ethereum Per Month',
        CADPERMONTH: 'Canadian Dollar Per Month: ',
        FORTWOYEARS: '（for 2 years）',
        CADTOTAL: 'Total Canadian Dollar for two years',
        //order page
        ORDERLIST: 'Order List',
        ORDER: 'Order',
        ITEM: 'Item',
        TOTAL: 'Total',
        STATUS: 'Status',
        QUANTITY: 'Quantity',
        PAIDON: 'Placed on'
        
    };

    var cn_translations = {
        DASHBOARD: '主面板',
        SUBMISSION: "我的申请档",
        UPLOAD: "上传文件",
        EDITINFO: "信息编辑",
        EDITLINK: "链接编辑",
        BALANCE: "账单",
        SETTINGS: "设置",
        LOGOUT: '下线',
        LANGUAGE: '语言',
        USER: '用户',
        MYPROFILE: '用户设置',
        HOME: '主页',
       
        DESCRIPTION: "简介", 
        TITLE: "名目",
        UPLOADDATE: "上传时间",
        SUBMITDATE: "提交时间", 
        ACTION: "操作", 
        EDIT: "编辑",
        VIEW: "查看",
        VIEWALL: "查看所以申请档", 
        CREATENEW: "建立新的申请",
        UPGRADE: '购买算力',
       
       /* SUBMISSION */
        PLANNEDSUB: "计划的申请档",
        DOCUMENT: "文件",
        APPFOLDER: "申请档文件夹", 
        VERSION: "版本", 
        SEQUENCE: "系列", 
        COMPILATION: "收编进行中", 
        REG_ACT: "Regulatory Activity", 
        REG_ACT_ID: "Regulatory Activity ID", 
        CANCEL: "取消", 
        CREATEAPP: "建立申请表",
        EDITAPP: "修改申请表", 
        OBJECT:"目标",
        
        LOGINTO: "进入",
        SYSTEM: "系统",
        LOGIN: '登录',
        REGISTER: "登记",
        FORGOTPW: '忘记密码?',
        HAVEACC: 'Have an account？',
        PW: '密码',
        USERNAME: '用户名',
        
        /* UPLOAD*/
        UPQUEUE: "上传文件",
        UPFILES: "已上传文件", 
        CHOOSEFILE: "选择文件",
        MAXFILE: "(每次可上传 10个文件)",
        MAXSIZE: "(文件不大于 3mb)",
        NAME: "文件名", 
        SIZE: "大小",
        PROGRESS: "进度",
        STATUS: "状况",
        UPLOADALL: "上传所有",
        CANCELALL: "取消所有",
        REMOVEALL: "删除所有",
        SAVE:'保存信息',
        
        //sidebar
        ORDERS: '我的订单',
        TRANSACTIONS: '收款',
        //dashboard
        HASHRATE: '算力',
        UNPAIDBAL: '未支付金额',
        MININGSUM: '挖矿结果 （以太）',
        TOTALETH: '总以太',
        TOTALDOLLAR: '总加币收入',
        STARTTIME: '开始时间',
        MINETIME: '挖矿时间',
        MONTH: '月',
        DATE: ' 转账日期',
        DURATION: '挖矿时间',
        ESTIMATE: '预计收入',
        CURRENT: '（根据目前算力）',
        CAD:'加币',
        CNY:'元',
        WEEK:'周',
        YEAR:'年',
        DAY: '日',
        FIVEYEARS: '五年',
        TOTALBAL:'总金额',
        PAIDETH:'已支付金额',
        TOTALINDOLLAR: '加币总收入',
        //User page
        FNAME:'名',
        LNAME: '姓',
        MOBILE:'手机号码',
        EMAIL:'电子邮箱',
        PROFILE:'我的账户',
        PERSONALINFO: '个人信息',
        WALLET: '钱包',
        CHANGEPW: '修改密码',
        SETUP: '在此设置钱包',
        CURPW: '目前密码',
        NEWPW: '新密码',
        REPW: '重新输入新密码',
       
        
        //Upgrade page
        MININGPOWER: '挖矿算力',
        HASHPOWER: 'Hash 算力 (MH): ',
        PRICE: '价格: ',
        ESTIMATERET: '估算回报',
        CURRATE: '目前汇率: ',
        ETHPERMONTH: '月入以太',
        CADPERMONTH: '月入加币: ',
        FORTWOYEARS: '（两年）',
        CADTOTAL: '两年总收入（加币）',
        QUANTITY: '数量',
        //order page
        ORDERLIST: '订单列表',
        ORDER: '订单',
        ITEM: '介绍',
        TOTAL: '总价',
        STATUS: '状态',
        PAIDON: '下单日期',
        //login page
        /*
        SIGNUP: '注册',
        HAVEACC: '拥有账号？',
        LOG: '登陆',
        PW: '密码',
        FORGOTPW: '忘记密码?',
        STAYLOG: '保持登陆',
        NOACC: '没有账号？'*/
    };
   

    $translateProvider.translations('en', en_translations);
    //$translateProvider.translations('sp', sp_translations);
    $translateProvider.translations('cn', cn_translations);

    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

}]);


/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout'
    };

    $rootScope.settings = settings;

    return settings;
}]);



MetronicApp.config(['$httpProvider', function($httpProvider) {
    // $httpProvider.defaults.useXDomain = true;
    //$httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push(['$q', function($q) {
        return {
            'responseError': function(rejection) {
                if (rejection.status === 401) {
                    console.log('Got a 401');
                }
                return $q.reject(rejection);
            }
        };

    }]);
}]);


/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$location', '$rootScope', '$state', '$cookies', 'AuthenticationService', '$translate',
    function($scope, $location, $rootScope, $state, $cookies, AuthenticationService, $translate) {

    $scope.$on('$viewContentLoaded', function() {
        $scope.currentUser = null;
        //  $scope.isAuthorized = AuthService.isAuthorized;
        // var testck = $cookies.get('test')
        if ($cookies.get('globals') !== undefined) {
            // console.log("in appcontroller" + $scope.currentUser);
            $rootScope.isLogged = true;
            // console.log("in if" + $cookies.get('test'))
        } else {
            $rootScope.isLogged = false;
            // console.log("in else" + $cookies.get('test'))
        }
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    }); 
    
    $scope.changeLanguage = function (key) {
        $translate.use(key);
    };
    /*console.log($cookies.get('globals'));
    if($$cookies.get('globals')){
        var userData = $cookies.get('globals'); //JSON.parse($cookies.get('globals'));
        $scope.admin = userData.userName;}*/
    //  $scope.admin=$rootScope.userdata.userName;
    $scope.logout = function() {
            AuthenticationService.ClearCredentials();
            $scope.currentUser = null;
            $rootScope.currentUser = null;
            $state.go("login").then(function() {
                toastr.success('Logged Out Succesfully');
                
                $state.reload();
                //$templateCache.removeAll();
            });
        }

}]);



/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', '$rootScope', '$location', '$state', '$cookies', 'AuthenticationService',  '$templateCache',
    function($scope, $rootScope, $location, $state, $cookies, AuthenticationService, $templateCache) {
        
        $scope.$on('$includeContentLoaded', function() {
            if(!Layout.headerStared) Layout.initHeader();
            //domainList(); // init header
        });
        var userData = JSON.parse($cookies.get('globals'));$scope.admin = userData.userName; //console.log('user Data: ', userData);
        // $scope.item.domainName="cms";
        //console.log(userData.currentDomain.domainName);
        //$scope.domainName = userData.currentDomain.domainName;
        //  $scope.domainName = $scope.userData.currentDomain.domainName;
    }
]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
        //console.log($state);
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        setTimeout(function() {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000);
    });
}]);

/* Setup Layout Part - Theme Panel
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]); */

/* Setup Layout Part - Footer 
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);*/


/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('login');
    });

    //  $urlRouterProvider.otherwise('login');

    $stateProvider
        .state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        data: { pageTitle: 'Login' },
        controller: "LoginController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'css/login.css',
                        'js/controllers/LoginController.js',
                        'js/angular-base64.js'
                    ]
                });
            }]
        }
    })
    // Dashboard
    .state('dashboard', {
        url: "/dashboard.html",
        templateUrl: "views/dashboard.html",
        data: { pageTitle: 'eCTD Home' },
        controller: "DashboardController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        /*'../assets/global/plugins/morris/morris.css',
                        '../assets/global/plugins/morris/morris.min.js',
                        '../assets/global/plugins/morris/raphael-min.js',
                        '../assets/global/plugins/jquery.sparkline.min.js',

                        '../assets/pages/scripts/dashboard.min.js',*/
                        'js/controllers/DashboardController.js',
                    ]
                });
            }]
        }
    }).state('editfile', {
        url: '/edit.html',
        templateUrl: "views/edit.html",
        data: {pageTitle: 'Edit PDF file'},
        controller: '',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'css/edit.css',
                        "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js"
                    ]
                });
            }]
        }
    }).state('submission', {
        url: '/submission.html',
        templateUrl: "views/submission.html",
        data: {pageTitle: 'Create new application'},
        controller: '',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [ 
                        'css/edit.css'
                        //'js/controllers/GeneralPageController.js'
                        //"//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
                        //'dist/themes/default/style.min.css'
                    ]
                });
            }]
        }
    }).state('editlink', {
        url: '/edit_link.html',
        templateUrl: "views/edit_link.html",
        data: {pageTitle: 'Edit PDF links'},
        controller: '',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'css/edit.css',
                        "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js"
                    ]
                });
            }]
        }
    }).state('editinfo', {
        url: '/edit_info.html',
        templateUrl: "views/edit_info.html",
        data: {pageTitle: 'Edit Admin info and STF'},
        controller: '',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js"
                    ]
                });
            }]
        }
    })
    .state('fileupload', {
        url: "/file_upload.html",
        templateUrl: "views/file_upload.html",
        data: { pageTitle: 'Upload PDF files' },
        controller: "",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'angularFileUpload',
                    files: [
                        '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js'
                    ]
                }, {
                    name: 'Jstree',
                    files: [
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js"
                    ]
                }]);
            }]
        }
    })
    //Post lists
    .state('users', {
        url: "/userlist",
        templateUrl: "views/userlist.html",
        data: { pageTitle: 'User Page Template' },
        controller: "UserMgtController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/SystemController/UserMgtController.js',
                        'js/systemApiService.js',
                        'js/scripts/modal/modal.js',
                        'js/modalService.js',
                        '../assets/global/plugins/datatables/datatables.min.css',
                        //'../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        //  '../assets/pages/scripts/table-datatables-managed.min.js',
                        // '../assets/global/scripts/datatable.min.js',
                        //  '../assets/global/scripts/datatable.js',
                        '../assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })
    //category

    .state('categories', {
        url: "/categories",
        templateUrl: "views/category/categorylist.html",
        data: { pageTitle: 'Category Page Template' },
        controller: "CategoryListController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/CategoryControllers/CategoryListController.js',
                        'js/services/categoryApiService.js',
                        '../assets/global/plugins/jquery-bootpag/jquery.bootpag.min.js',
                        '../assets/global/plugins/datatables/datatables.min.css',
                        // '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        //  '../assets/pages/scripts/table-datatables-managed.min.js',
                        // '../assets/global/scripts/datatable.min.js',

                        // '../assets/global/scripts/datatable.js',
                        //  '../assets/global/plugins/jquery-bootpag/jquery.bootpag.min.js',
                        '../assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })

    .state('editCategory', {
        url: "/editCateg/",
        templateUrl: "views/category/categoryedit.html",
        params: { id: null },
        data: { pageTitle: 'Post Page Template' },
        controller: "CategoryEditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/CategoryControllers/CategoryEditController.js',
                        'js/services/categoryApiService.js',

                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/select2/js/select2.full.min.js',

                        '../assets/pages/scripts/components-bootstrap-select.min.js',
                        '../assets/pages/scripts/components-select2.min.js'
                    ]
                });
            }]
        }
    })

    //Post lists
    /*.state('posts', {
        url: "/postlist",
        templateUrl: "views/post/postlist.html",
        data: { pageTitle: 'Post Page Template' },
        controller: "PostListController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/PostControllers/PostListController.js',
                        'js/services/postApiService.js',
                        'js/services/categoryApiService.js',

                        'js/controllers/PostControllers/delete_post_modal.js',

                        'js/scripts/modal/modal.js',
                        'js/modalService.js',

                        '../assets/global/plugins/datatables/datatables.min.css',
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/pages/scripts/table-datatables-managed.min.js',
                        '../assets/global/scripts/datatable.min.js',

                        '../assets/global/scripts/datatable.js',
                        '../assets/global/plugins/jquery-bootpag/jquery.bootpag.min.js',
                        '../assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })*/

    //Create post and edit post 
    /*.state('editPost', {
        url: "/postedit/",
        templateUrl: "views/post/postedit.html",
        params: { id: null },
        data: { pageTitle: 'Post Page Template' },
        controller: "PostEditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/PostControllers/PostEditController.js',
                        'js/services/postApiService.js',
                        'js/services/categoryApiService.js',
                        'js/services/mediaApiServices.js',
                        'js/services/tagApiService.js',

                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        '../assets/global/plugins/bootstrap-typeahead/bootstrap3-typeahead.min.js',

                        '../assets/pages/scripts/components-bootstrap-select.min.js',
                        '../assets/pages/scripts/components-select2.min.js',
                        '../assets/global/plugins/typeahead/typeahead.css',

                        '../assets/global/plugins/typeahead/typeahead.bundle.min.js',



                        '../assets/pages/scripts/select2.js'

                    ]
                });
            }]
        }
    })*/

    //Tags page
    .state('tags', {
        url: "/tagslist",
        templateUrl: "views/tags/tagslist.html",
        data: { pageTitle: 'Post Page Template' },
        controller: "TagsListController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/TagsControllers/TagsListController.js',
                        'js/services/tagApiService.js',



                        '../assets/global/plugins/datatables/datatables.min.css',
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/pages/scripts/table-datatables-managed.min.js',
                        '../assets/global/scripts/datatable.min.js',

                        '../assets/global/scripts/datatable.js',
                        '../assets/global/plugins/jquery-bootpag/jquery.bootpag.min.js',
                        '../assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })


    .state('editTag', {
        url: "/tagedit/:id",
        templateUrl: "views/tags/tagedit.html",
        data: { pageTitle: 'Tag Page Template' },
        controller: "TagEditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/TagsControllers/TagEditController.js',
                        'js/services/tagApiService.js'

                    ]
                });
            }]
        }
    })

    //Media page
    .state('library', {
        url: "/library",
        templateUrl: "views/media/mediaLibrary.html",
        data: { pageTitle: 'Media library Page Template' },
        controller: "MediaLibraryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/MediaControllers/MediaLibraryController.js',
                        'js/services/mediaApiServices.js',
                    ]
                });
            }]
        }
    })

    .state('mediaUpload', {
        url: "/mediaUpload",
        templateUrl: "views/media/mediaUpload.html",
        data: { pageTitle: 'Media add Page Template' },
        controller: "MediaUploadController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/MediaControllers/MediaUploadController.js',
                        'js/services/mediaApiServices.js',

                        '../assets/global/plugins/dropzone/basic.min.css',
                        '../assets/global/plugins/dropzone/dropzone.min.css',
                        '../assets/global/plugins/dropzone/dropzone.min.js'

                    ]
                });
            }]
        }
    })

    //domain management


    .state('domainlist', {
        url: "/domainlist",
        templateUrl: "views/domain/domainlist.html",
        data: { pageTitle: 'Domain Page Template' },
        controller: "DomainListController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/DomainControllers/DomainListController.js',
                        'js/services/domainApiService.js',

                        '../assets/global/plugins/datatables/datatables.min.css',
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/pages/scripts/table-datatables-managed.min.js',
                        '../assets/global/scripts/datatable.min.js',

                        '../assets/global/scripts/datatable.js',
                        '../assets/global/plugins/jquery-bootpag/jquery.bootpag.min.js',
                        '../assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })

    .state('domainedit', {
        url: "/domainedit/:id",
        templateUrl: "views/domain/domainedit.html",
        data: { pageTitle: 'Domain Edit Page Template' },
        controller: "DomainEditController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/DomainControllers/DomainEditController.js',
                        'js/services/domainApiService.js'

                    ]
                });
            }]
        }
    })

    // Blank Page
    .state('blank', {
        url: "/blank",
        templateUrl: "views/blank.html",
        data: { pageTitle: 'Blank Page Template' },
        controller: "BlankController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/BlankController.js'
                    ]
                });
            }]
        }
    })

    // AngularJS plugins
    

    // UI Select
    .state('uiselect', {
        url: "/ui_select.html",
        templateUrl: "views/ui_select.html",
        data: { pageTitle: 'AngularJS Ui Select' },
        controller: "UISelectController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'ui.select',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                        '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                    ]
                }, {
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/UISelectController.js'
                    ]
                }]);
            }]
        }
    })

    // UI Bootstrap
    .state('uibootstrap', {
        url: "/ui_bootstrap.html",
        templateUrl: "views/ui_bootstrap.html",
        data: { pageTitle: 'AngularJS UI Bootstrap' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    files: [
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Tree View
    .state('tree', {
        url: "/tree",
        templateUrl: "views/tree.html",
        data: { pageTitle: 'jQuery Tree View' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                        '../assets/global/plugins/jstree/dist/jstree.min.js',
                        '../assets/pages/scripts/ui-tree.min.js',
                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Form Tools
    .state('formtools', {
        url: "/form-tools",
        templateUrl: "views/form_tools.html",
        data: { pageTitle: 'Form Tools' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                        '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                        '../assets/global/plugins/typeahead/typeahead.css',

                        '../assets/global/plugins/fuelux/js/spinner.min.js',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                        '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                        '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                        '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                        '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                        '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                        '../assets/global/plugins/typeahead/handlebars.min.js',
                        '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                        '../assets/pages/scripts/components-form-tools-2.min.js',
                        '../assets/global/plugins/ckeditor/ckeditor.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Date & Time Pickers
    .state('pickers', {
        url: "/pickers",
        templateUrl: "views/pickers.html",
        data: { pageTitle: 'Date & Time Pickers' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/clockface/css/clockface.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                        '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                        '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                        '../assets/global/plugins/clockface/js/clockface.js',
                        '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                        '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                        '../assets/pages/scripts/components-date-time-pickers.min.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Custom Dropdowns
    .state('dropdowns', {
        url: "/dropdowns",
        templateUrl: "views/dropdowns.html",
        data: { pageTitle: 'Custom Dropdowns' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load([{
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                        '../assets/global/plugins/select2/js/select2.full.min.js',

                        '../assets/pages/scripts/components-bootstrap-select.min.js',
                        '../assets/pages/scripts/components-select2.min.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                }]);
            }]
        }
    })

    // Advanced Datatables
    .state('datatablesmanaged', {
        url: "/datatables/managed.html",
        templateUrl: "views/datatables/managed.html",
        data: { pageTitle: 'Advanced Datatables' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/datatables/datatables.min.css',
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',

                        '../assets/pages/scripts/table-datatables-managed.min.js',

                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // Ajax Datetables
    .state('datatablesajax', {
        url: "/datatables/ajax.html",
        templateUrl: "views/datatables/ajax.html",
        data: { pageTitle: 'Ajax Datatables' },
        controller: "GeneralPageController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/datatables/datatables.min.css',
                        '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                        '../assets/global/plugins/datatables/datatables.all.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/global/scripts/datatable.js',

                        'js/scripts/table-ajax.js',
                        'js/controllers/GeneralPageController.js'
                    ]
                });
            }]
        }
    })

    // User Profile
    .state("profile", {
        url: "/profile",
        templateUrl: "views/profile/main.html",
        data: { pageTitle: 'User Profile' },
        controller: "UserProfileController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        '../assets/pages/css/profile.css',

                        '../assets/global/plugins/jquery.sparkline.min.js',
                        '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                        '../assets/pages/scripts/profile.min.js',

                        'js/controllers/UserProfileController.js'
                    ]
                });
            }]
        }
    })

    // User Profile Dashboard
    .state("profile.dashboard", {
        url: "/dashboard",
        templateUrl: "views/profile/dashboard.html",
        data: { pageTitle: 'User Profile' }
    })

    // User Profile Account
    .state("profile.account", {
        url: "/account",
        templateUrl: "views/profile/account.html",
        data: { pageTitle: 'User Account' },
        controller: "UserAccountController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/UserAccountController.js'
                    ]
                });
            }]
        }
    })

    // User Profile Help
    .state("profile.help", {
        url: "/help",
        templateUrl: "views/profile/help.html",
        data: { pageTitle: 'User Help' }
    })

    // Todo
    .state('todo', {
        url: "/todo",
        templateUrl: "views/todo.html",
        data: { pageTitle: 'Todo' },
        controller: "TodoController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',

                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                        '../assets/apps/scripts/todo-2.min.js',

                        'js/controllers/TodoController.js'
                    ]
                });
            }]
        }
    })

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);

MetronicApp.run(function($rootScope, $state, $templateCache, $location, $cookies) {
    $rootScope.$on('$viewContentLoaded', function() {
        // console.log("in cache");
        $templateCache.removeAll();
    });

    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        // redirect to login page if not logged in and trying to access a restricted page
        var restrictedPage = $.inArray($location.path(), ['/login', '/dashboard']) === -1;
        var loggedIn = $cookies.get('globals') ? true : false;
        //  console.log(loggedIn);
        if (restrictedPage && !loggedIn) {
            $location.path('/login');
            //   console.log("in iffff");
        }
    });


});

// To logout user forcibly after certain time if no action is performed on application
MetronicApp.run(function($rootScope) {
    var lastDigestRun = new Date();
    console.log(lastDigestRun);
    setInterval(function() {
        var now = Date.now();
        if (now - lastDigestRun > 10 * 30 * 1000) {
            console.log("loggedout");
            console.log("if" + now);
        }
    }, 60 * 1000);

    $rootScope.$watch(function() {
        lastDigestRun = new Date();
    });
});