var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngCookies",
    'pascalprecht.translate',
    'angularModalService'
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
        MYSUB: "My Submission",
        UPLOAD: "File Upload",
        EDITINFO: "Submission Info",  //edit info
        EDITLINK: "Edit Link",
        BALANCE: "Balance",
        SETTINGS: "Settings",
        PUBLISH: "Publish",
        LOGOUT: "Logout",
        
        INBOX: "Inbox",
        
        /* DASHBOARD*/
        SUBMISSION: "Submission",
        HOME: 'Home',
        DESCRIPTION: "Description", 
        TITLE: "Title",
        UPDATEDATE: "Last update",
        CREATEDATE: "Created Date",
        SUBMITDATE: "Submit Date", 
        ACTION: "Action", 
        EDIT: "Edit",
        VIEW: "View",
        VIEWALL: "View All Submissions", 
        CREATENEW: "Create a New Application", 
        NEWSUB: "New Submission",
        /* SUBMISSION */
        PLANNEDSUB: "planned submission",
        DOCUMENT: "Document",
        APPFOLDER: "Application Number",    //application folder
        SUBID: "Submission ID",
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
        MAXSIZE: "(Max Size: 6mb)",
        NAME: "Name", 
        SIZE: "Size",
        PROGRESS: "Progress",
        STATUS: "Status",
        UPLOADALL: "Upload all",
        CANCELALL: "Cancel all",
        REMOVEALL: "Remove file",
        REPLACE: "Replace",
        SAVE: 'Save Changes',
         
        WARNING_NOAPP: "You need to create an application to...",
        WARNING_FILES: "Maximum 10 files", 
        WARNING_SIZE: "Maximum file size 6mb",
        WARNING_FILE: "Not a pdf file",
        WARNING_DUPLICATE: "Duplicate file",
        WARNING_LOADED:"Already uploaded",
        WARNING_REMOVE: "Remove all added files !",
        WARNING_RENAME: "Can not rename eCTD structure folder!!!",
        WARNING_DELETE: "Can not delete eCTD structure folder!!!",
        WARNING_NOFILE: "There is no file to save",
        WARNING_SPACE: "File name can't contain space",
        WARNING_EXISTS: " already exists, it will be replaced?",
        INFO_WAIT: "It may take a minute or two to save the ECTD structure files.",
        WARNING_TAG: "One tag can't contain two files!",
        SUCCESS_REPLACED: " File replaced", 
        NO_FILE: "There is no file to save", 
        DELETE: "Delete",
        CLOSE: "Close", 
        D_TITLE: "Delete Item",
        D_CONTENT: "Are you sure to delete the item ?",
        
        /* EDIT INFO */
        EDITTAG: "Edit Tag",
        ADMINISTRATION: "Administration Information",
        APPLICATION: "Application",
        COMPANYNAME: "Company Name",
        NUMBER: "Number",
        TYPE: "Type",
        SUBTYPE: "sub-type",
        APP_CONTACT:"Application Contact",
        CONT_TYPE: "Contact Type",
        CONT_NAME:"Contact Name",
        TELEPHONE: "Telephone Number",
        EMAIL:'Email',
        USA: "USA (V3.3)", 
        SUP_EFF: "Supplement Effective Date Type",    
        CROSS_REF: "Application Cross Reference", 
        YES: "Yes", 
        NO: "No", 
        
        PRICE: 'Price',
        CONTACTUS: 'Contact us',
         //header
        LANGUAGE: 'Language',
        USER: 'User',
        MYPROFILE: 'My Profile',
        UPGRADE: 'Purchase Power',
       
        //Edit LINK
        REACT: "react",
        SELECT: "select",
        LINK: "link",
        NOTE: "note", 
        BACKWARD: "backward",
        FORWARD: "forward",
        FAVORITE: "favorite",
        BOOKMARK: "bookmark",
        HIGHLIGHT: "highlight",
        ALIGN: "align",
        COLOR: "color",
        FONT: "font",
        CHECK: "preview",
        DOWNLOAD: "download",
        SAVEFILE: "Save file",
        ORDERS: 'My Orders',
        TRANSACTIONS: 'Payouts',
        
        //profile
        FIRSTNAME: "First Name",
        LASTNAME: "Last Name",
        PHONE: "Telephone",
        COMPANYPHONE: "Telephone",
        ADDRESS:"Address",
        CITY: "City",
        COUNTRY: "Country",
        PROVINCE: "Province", 
        PERSONAL: "Personal Informatin",
        COMPANY: "Comapny Information",
        CODE: "Postal Code", 
        
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
        
        PROFILE:'Profile',
        
        WALLET: 'Wallet',
        CHANGEPW: 'Change Password',
        SETUP: 'Set up Wallet here',
        CURPW: 'Current Password',
        NEWPW: 'New Password',
        REPW: 'Re-type Password',
        
        /******profile account ***/
        
        OVERVIEW: "Overview", 
        HELP: "Help",
        ACC_SETTINGS: "Account Settings",
        PER_INFO: "Personal Info",
        CHANGE_PASSWORD: "Change Password",
        PRIV_SETTINGS: "Privacy Settings",
        CHANGE_IMAGE: "Change Image",
        
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
        
        QUANTITY: 'Quantity',
        PAIDON: 'Placed on'
        
    };

    var cn_translations = {
        DASHBOARD: '主面板',
        MYSUB: "我的申请档",
        UPLOAD: "上传文件",
        EDITINFO: "信息编辑",
        EDITLINK: "链接编辑",
        BALANCE: "账单",
        SETTINGS: "设置",
        PUBLISH: "发布",
        LOGOUT: '下线',
        LANGUAGE: '语言',
        USER: '用户',
        MYPROFILE: '用户设置',
        
        INBOX: "邮箱",
        
        SUBMISSION: "申请档",
        HOME: '主页',
       
        DESCRIPTION: "简介", 
        TITLE: "名目",
        UPDATEDATE: "上传时间",
        SUBMITDATE: "提交时间", 
        CREATEDATE: "建立时间",
        ACTION: "操作", 
        EDIT: "编辑",
        VIEW: "查看",
        VIEWALL: "查看所以申请档", 
        CREATENEW: "建立新的申请",
        UPGRADE: '购买算力',
       
       /* SUBMISSION */
        PLANNEDSUB: "计划的申请档",
        DOCUMENT: "文件",
        APPFOLDER: "申请档号码", 
        SUBID: "序列号",
        VERSION: "版本", 
        SEQUENCE: "系列", 
        COMPILATION: "收编进行中", 
        REG_ACT: "监管 活动", 
        REG_ACT_ID: "监管 活动 ID", 
        CANCEL: "取消", 
        CREATEAPP: "建立申请表",
        EDITAPP: "修改申请表", 
        OBJECT:"目标",
        NEWSUB: "新的 申请档",
        
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
        MAXSIZE: "(文件不大于 6mb)",
        NAME: "文件名", 
        SIZE: "大小",
        PROGRESS: "进度",
        STATUS: '状态',
        UPLOADALL: "上传所有",
        CANCELALL: "取消所有",
        REMOVEALL: "删除文件",
        REPLACE: "覆盖原文件",
        SAVE:'保存信息',
        
        WARNING_NOAPP: "请先建立申请表",
        WARNING_FILES: "不超过10个文件", 
        WARNING_SIZE: "文件不大于 6mb",
        WARNING_FILE: "不是 PDF 文件",
        WARNING_DUPLICATE: "文件重复",
        WARNING_LOADED:"文件已上传",
        WARNING_REMOVE: "移走 所有文件 !",
        WARNING_RENAME: "不能更改eCTD 架构文件夹名字!!!",
        WARNING_DELETE: "不能删除 eCTD 架构文件夹!!!",
        WARNING_NOFILE: "没有文件",
        WARNING_EXISTS: " 已经存在，将会被取代",
        SUCCESS_REPLACED: " 文件被取代",
        WARNING_TAG: "一个tag 不能有2个文件",
        WARNING_SPACE: "文件名不能有空格",
        INFO_WAIT: "保存文件可能需要1 - 2分钟",
        NO_FILE: "没有文件", 
        DELETE: "删除",
        CLOSE: "关闭", 
        D_TITLE: "删除文件",
        D_CONTENT: "确定要删除这个文件？",
        
        /* EDIT INFO */
        EDITTAG: "标签编辑",
        ADMINISTRATION: "管理者信息",
        APPLICATION: "申请",
        COMPANYNAME: "公司名字",
        NUMBER: "号码",
        TYPE: "类型",
        SUBTYPE: "次类型",
        APP_CONTACT:"联系方式",
        CONT_TYPE: "联系类型",
        CONT_NAME:"联系人名字",
        TELEPHONE: "电话号码",
        EMAIL:'电 邮',
        SUP_EFF: "副有效日期类型", 
        USA: "美国 (V3.3)", 
        CROSS_REF: "外部参考", 
        YES: "是", 
        NO: "否", 
        
        /*EDIT LINK*/
        SAVEFILE: "保存文件",
        REACT: "打开链接",
        SELECT: "选择链接",
        LINK: "链接",
        NOTE: "注解", 
        BACKWARD: "向后",
        FORWARD: "向前",
        FAVORITE: "偏好",
        BOOKMARK: "书签",
        HIGHLIGHT: "凸显",
        ALIGN: "对齐",
        COLOR: "颜色",
        FONT: "字体",
        CHECK: "预览",
        DOWNLOAD: "下载",
        //sideba
        ORDERS: '我的订单',
        TRANSACTIONS: '收款',
        
        //profile
        FIRSTNAME: "姓",
        LASTNAME: "名",
        PHONE: "电 话",
        COMPANYPHONE: "公司电话",
        ADDRESS:"地 址",
        CITY: "城 市",
        COUNTRY: "国 家",
        PROVINCE: "省 份",
        PERSONAL: "个人资料",
        COMPANY: "公司资料",
        CODE: "邮 编", 
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
        //EMAIL:'电子邮箱',
        PROFILE:'我的账户',
        
        WALLET: '钱包',
        CHANGEPW: '修改密码',
        SETUP: '在此设置钱包',
        CURPW: '目前密码',
        NEWPW: '新密码',
        REPW: '重新输入新密码',
        
        /******profile account ***/
        OVERVIEW: "总目录", 
        HELP: "帮助",
        ACC_SETTINGS: "账户 设置",
        PER_INFO: "个人 信息",
        CHANGE_PASSWORD: "更改 密码",
        PRIV_SETTINGS: "隐私 设置",
        CHANGE_IMAGE: "更改 头像",
        
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
       
        PAIDON: '下单日期'
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
            pageBodySolid: false // solid body color state
            //pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: 'assets',
        globalPath: 'assets/global',
        layoutPath: 'assets/layouts/layout'
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
MetronicApp.controller('AppController', ['$scope', '$location', '$rootScope', '$state', '$cookies', 'AuthenticationService', '$translate',"$window",
    function($scope, $location, $rootScope, $state, $cookies, AuthenticationService, $translate, $window) {

    $scope.$on('$viewContentLoaded', function() {
        $scope.currentUser = null;
        if ($cookies.get('globals') !== undefined) {
            $rootScope.isLogged = true;  
        } else {
            $rootScope.isLogged = false;
        }
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    }); 
    
    $scope.changeLanguage = function (key) {
        $translate.use(key);
    };
    
    $scope.logout = function() {
            AuthenticationService.ClearCredentials();
            $scope.currentUser = null;
            $rootScope.currentUser = null;
            $state.go("login").then(function() {
                toastr.success('Logged Out Succesfully');
                $window.location.reload();   // to reload or refresh the whole index.html
                //$state.reload();
                //$templateCache.removeAll();
            });
        };

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
            Layout.initHeader();
        });
        var userData = JSON.parse($cookies.get('globals'));
        $scope.username = "test";//userData.uid; //console.log('user Data: ', userData);
    }
]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
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
                        //'css/login.css',
                        'js/controllers/LoginController.js',
                        'js/angular-base64.js'
                    ]
                });
            }]
        }
    }).state("register", {
        url: "/register",
        templateUrl: "views/register.html",
        data: { pageTitle: 'Register' },
        controller: "",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [   
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
                        'js/controllers/DashboardController.js',
                        'js/services/applicationApiService.js'
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
                        'assets/global/plugins/datatables/datatables.all.min.js',
                        'assets/pages/scripts/angular-datatables.js',
                        'css/edit.css',
                        'js/services/cookiesApiService.js',
                        'js/services/templateApiService.js',
                        'js/services/applicationApiService.js',
                        'js/controllers/SubmissionCtrl.js',
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
                        'dist/location.js',
                        'js/services/cookiesApiService.js',
                        'js/services/fileApiService.js',
                        'js/services/applicationApiService.js',
                        'js/controllers/EditTreeCtrl.js',
                        'css/edit.css',
                        "//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css",
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js",
                        'dist/Filetree.js'
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
                        'dist/location.js',
                        'js/services/cookiesApiService.js',
                        'js/services/applicationApiService.js',
                        'js/services/genInfoApiService.js',
                        'js/services/tagApiService.js',
                        'js/controllers/EditInfoCtrls.js',
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js",
                        'dist/Filetree.js'
                        //'dist/InfoFiletree.js'
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
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        'dist/location.js',
                        'js/services/cookiesApiService.js',
                        'js/services/applicationApiService.js',
                        'js/services/fileApiService.js',
                        'js/controllers/FileUploadCtrl.js',
                        'dist/jquery.sticky.js',
                        'dist/themes/default/style.min.css',         // style for jstree
                        "dist/jstree.min.js",
                        'dist/Filetree.js',
                    ]   
                });
            }]
        }
    }).state('publish', {
        url: '/publish.html',
        templateUrl: "views/publish.html",
        data: {pageTitle: 'Publish the application'},
        controller: '',
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'dist/location.js',
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js",
                        'dist/Filetree.js',
                        'js/services/cookiesApiService.js',
                        'js/services/applicationApiService.js'
                    ]
                });
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
                        'js/services/cookiesApiService.js',
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
                        'assets/pages/scripts/angular-datatables.js'
                    ]
                });
            }]
        }
    })
    //category




    // Form Tools
    /*.state('formtools', {
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
*/
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
                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        'assets/pages/css/profile.css',

                        'assets/global/plugins/jquery.sparkline.min.js',
                        'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                        'assets/pages/scripts/profile.min.js',

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
                    insertBefore: '#ng_load_plugins_before', 
                    files: [
                        'js/services/userApiService.js',
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
                        'assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        'assets/apps/css/todo-2.css',
                        'assets/global/plugins/select2/css/select2.min.css',
                        'assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        'assets/global/plugins/select2/js/select2.full.min.js',

                        'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                        'assets/apps/scripts/todo-2.min.js',

                        'js/controllers/TodoController.js'
                    ]
                });
            }]
        }
    });

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
    $rootScope.Base_URL = "http://192.168.88.187:8080/ectd";
    //$rootScope.Base_URL = "http://52.4.14.123/ectd";
    var lastDigestRun = new Date();                                             console.log(lastDigestRun);
    
    setInterval(function() {
        var now = Date.now();
        if (now - lastDigestRun > 10 * 30 * 1000) {
                                                                                //console.log("url: ", $rootScope.Base_URL);
                                                                                console.log("if" + now);
        }
    }, 60 * 1000);

    $rootScope.$watch(function() {
        lastDigestRun = new Date();
    });
});