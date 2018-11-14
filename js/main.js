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
// MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
//     $ocLazyLoadProvider.config({
//         // global configs go here
//     });
// }]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
// MetronicApp.config(['$controllerProvider', function($controllerProvider) {
//     // this option might be handy for migrating old apps, but please don't use it
//     // in new ones!
//     $controllerProvider.allowGlobals();
// }]);
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
        ADMIN: "Admin",
        
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
        DESTINATION: "Destination",
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
        STRUCT_NUM: "Structure Number",               //
        ESUB_CODE: "eSubmission Code",                //
        TAG: "Tag",                                     //
        CONFIGURATION: "Configuration",                 //
        HEADER_FOOTER: "Header and Footer",             //
        PROD_NAME: "Product Name",
        F_VERSION: "File version",
        DOSAGE: "Dosage",
        MANUF: "Manufacturer",
        SUBSTANCE:"Substance",
        MANUAL: "Manual Directory Name",
        STUDY_NUM: "Study Number",
        STUDY_TYPE: "Study Type",
        SPECIES: "Species",
        ROUTE:"Route of Admin",
        DURATION: "Duration",
        T_CONTROL: "Type of Control",
        
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
        MAXSIZE: "(Max Size: 10mb)",
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
        WARNING_SIZE: "Maximum file size 10mb",
        WARNING_FILE: "Not a pdf file",
        WARNING_DUPLICATE: "Duplicate file",
        WARNING_LOADED:"Already uploaded",
        WARNING_REMOVE: "Remove all added files !",
        WARNING_RENAME: "Can not rename eCTD structure folder!!!",
        WARNING_DELETE: "Can not delete eCTD structure folder!!!",
        WARNING_NOFILE: "There is no file to save",
        WARNING_SPACE: "File name can't contain space",
        WARNING_EXISTS: " already exists, it will be replaced?",
        WARNING_CASE: "File name can not contain upper case letter",
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
        TELE_TYPE: "Telephone Type",
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

        //publish
        VALIDATE: "Validate",
        
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
        
        PROFILE:'Profile',
        
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
        COMPANY_INFO: "Company Info",
        CHANGE_PASSWORD: "Change Password",
        PRIV_SETTINGS: "Privacy Settings",
        INVITE: 'Invite',

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
        ADMIN: "管理员",
        
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
        DESTINATION: "目标国家",
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
        STRUCT_NUM: "结构号码",               //
        ESUB_CODE: "e 代码",                //
        TAG: "标签",                                     //
        CONFIGURATION: "设置",                 //
        HEADER_FOOTER: "开头和尾部",             //
        PROD_NAME: "产品名字",
        F_VERSION: "文件版本",
        DOSAGE: "用量",
        SUBSTANCE:"原料",
        MANUF: "生产商",
        MANUAL: "Manual Directory Name",
        STUDY_NUM: "研究报告号码",
        STUDY_TYPE: "研究报告类型",
        SPECIES: "类目",
        ROUTE:"Route of Admin",
        DURATION: "周期",
        T_CONTROL: "控制类型",

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
        MAXSIZE: "(文件不大于 10mb)",
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
        WARNING_SIZE: "文件不大于 10mb",
        WARNING_FILE: "不是 PDF 文件",
        WARNING_DUPLICATE: "文件重复",
        WARNING_LOADED:"文件已上传",
        WARNING_REMOVE: "移走 所有文件 !",
        WARNING_RENAME: "不能更改eCTD 架构文件夹名字!!!",
        WARNING_DELETE: "不能删除 eCTD 架构文件夹!!!",
        WARNING_NOFILE: "没有文件",
        WARNING_EXISTS: " 已经存在，将会被取代",
        WARNING_CASE: "文件名不能含有大写字母",
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
        TELE_TYPE: "电话类型",
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

        //publish
        VALIDATE: "验证",
        
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
        
        //User page
        FNAME:'名',
        LNAME: '姓',
        MOBILE:'手机号码',
        PROFILE:'我的账户',
        
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
        COMPANY_INFO: "公司信息",
        INVITE: '邀请',
        
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
   

    $translateProvider.translations('us', en_translations);
    //$translateProvider.translations('sp', sp_translations);
    $translateProvider.translations('cn', cn_translations);

    $translateProvider.preferredLanguage('us');
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
        if(!$rootScope.userData){
            $rootScope.userData = JSON.parse($cookies.get('globals'));
        }
    }
]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);


/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url

    $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get('$state');
        $state.go('login'); 
    });
    // $urlRouterProvider.when('/edit','/edit/'+info);

    $stateProvider
        .state("login", {
        url: "/login",
        templateUrl: "views/login.html",
        data: { pageTitle: 'Login' },
        // controller: "LoginController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        // 'js/services/authService.js',
                        'assets/layouts/layout/css/login.css',
                        'js/controllers/LoginController.js'
                    ]
                });
            }]
        }
    })
    // Dashboard
    .state('dashboard', {
        url: "/dashboard",
        templateUrl: "views/dashboard.html",
        data: { pageTitle: 'eCTD Dashboard' },
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
    }) .state('allsubs', {
        url: "/allsubs",
        templateUrl: "views/all-subs.html",
        data: { pageTitle: 'All Submissions' },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        'js/controllers/AllsubsCtrl.js',
                        'js/services/applicationApiService.js',
                        'js/services/cookiesApiService.js',
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js",
                        'dist/Filetree.js'
                    ]
                });
            }]
        }
    }).state('submission', {
        url: '/submission',
        templateUrl: "views/submission.html",
        data: {pageTitle: 'Create new application'},
        params: {
            lang: "us"
        },
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [ 
                        'assets/global/plugins/datatables/datatables.min.css',
                        'assets/global/plugins/datatables/datatables.min.js',
                        'assets/pages/scripts/angular-datatables.js',
                        'css/edit.css',
                        'js/services/cookiesApiService.js',
                        'js/services/userApiService.js',
                        'js/services/templateApiService.js',
                        'js/services/applicationApiService.js',
                        'js/controllers/SubmissionCtrl.js',
                    ]
                });
            }]
        }
    }).state('editlink', {
        url: '/edit_link',
        templateUrl: "views/edit_link.html",
        data: {pageTitle: 'Edit PDF links'},
        // controller: '',
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
        url: '/edit_info',
        templateUrl: "views/edit_info.html",
        data: {pageTitle: 'Edit Admin info and STF'},
        // controller: '',
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
        url: "/file_upload",
        templateUrl: "views/file_upload.html",
        data: { pageTitle: 'Upload PDF files' },
        // controller: "",
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
        url: '/publish',
        templateUrl: "views/publish.html",
        data: {pageTitle: 'Publish the application'},
        // controller: '',
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
                        'js/services/applicationApiService.js',
                         'js/services/fileApiService.js',
                        'js/services/genInfoApiService.js',
                        'js/services/tagApiService.js',
                        'js/controllers/PublishCtrl.js',
                    ]
                });
            }]
        }
    })
    
    //edit
    .state("edit", {
        url: '/edit',
        templateUrl: "views/edit/edit.html",
        data: {pageTitle: 'Upload file, Edit Admin info and STF'},
        // controller: '',
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
                        // 'js/controllers/EditInfoCtrls.js',
                        'dist/themes/default/style.min.css',
                        "dist/jstree.min.js",
                        'dist/Filetree.js'
                        //'dist/InfoFiletree.js'
                    ]
                });
            }]
        }
    }).state("edit.info",{
        url: '/info',
        templateUrl: "views/edit/info.html",
        data: {pageTitle: 'Edit Admin info '},
        controller: ''
    }).state("edit.tag",{
        url: '/tag',
        templateUrl: "views/edit/tag.html",
        data: {pageTitle: 'Edit tag '},
        controller: ''
    }).state("edit.upload",{
        url: '/upload',
        templateUrl: "views/edit/upload.html",
        data: {pageTitle: 'Upload file'},
        controller: ''
    })
    // User Profile
    .state("profile", {
        url: "/profile",
        templateUrl: "views/profile/account.html",
        data: { pageTitle: 'User Profile' },
        controller: "UserAccountCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        // 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                        // 'assets/pages/css/profile.css',
                        // 'assets/global/plugins/jquery.sparkline.min.js',
                        // 'assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                        // 'assets/pages/scripts/profile.min.js',
                        // 'js/controllers/UserProfileController.js',
                        'js/services/userApiService.js',
                        'js/controllers/UserAccountCtrl.js'
                    ]
                });
            }]
        }
    })

    // //User Profile Dashboard
    // .state("profile.dashboard", {
    //     url: "/dashboard",
    //     templateUrl: "views/profile/dashboard.html",
    //     data: { pageTitle: 'User Profile' }
    // })

    // User Profile Account
    // .state("profile.account", {
    //     url: "/account",
    //     templateUrl: "views/profile/account.html",
    //     data: { pageTitle: 'User Account' },
    //     controller: "UserAccountController",
    //     resolve: {
    //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load({
    //                 name: 'MetronicApp',
    //                 insertBefore: '#ng_load_plugins_before', 
    //                 files: [
    //                     'js/services/userApiService.js',
    //                     'js/controllers/UserAccountController.js'
    //                 ]
    //             });
    //         }]
    //     }
    // })

    // // User Profile Help
    // .state("profile.help", {
    //     url: "/help",
    //     templateUrl: "views/profile/help.html",
    //     data: { pageTitle: 'User Help' }
    // })
    // .state("admin", {
    //     url: "/admin",
    //     templateUrl: "views/admin/dashboard.html",
    //     data: { pageTitle: 'Admin Home' },
    //     controller: "DashboardController",
    //     resolve: {
    //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load({
    //                 name: 'MetronicApp',
    //                 insertBefore: '#ng_load_plugins_before', 
    //                 files: [
    //                    'js/controllers/DashboardController.js',
    //                     'js/services/applicationApiService.js'
    //                 ]
    //             });
    //         }]
    //     }
    // })
    // //Post lists
    // .state('/admin/users', {
    //     url: "/admin/users",
    //     templateUrl: "views/admin/users.html",
    //     data: { pageTitle: 'Admin Users' },
    //     controller: "",
    //     resolve: {
    //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load({
    //                 name: 'MetronicApp',
    //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    //                 files: [
    //                     'js/services/userApiService.js',
    //                     'js/controllers/admin/userCtrl.js',
    //                     //'js/controllers/SystemController/UserMgtController.js',
    //                     //'js/systemApiService.js',
    //                     'assets/global/plugins/datatables/datatables.min.css',
    //                     'assets/global/plugins/datatables/datatables.min.js',
    //                     'assets/pages/scripts/angular-datatables.js'
    //                 ]
    //             });
    //         }]
    //     }
    // }).state("/admin/submissions", {
    //     url: "/admin/submissions",
    //     templateUrl: "views/admin/submissions.html",
    //     data: { pageTitle: 'Admin submissions' },
    //     controller: "",
    //     resolve: {
    //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
    //             return $ocLazyLoad.load({
    //                 name: 'MetronicApp',
    //                 insertBefore: '#ng_load_plugins_before', 
    //                 files: [
    //                     'js/services/applicationApiService.js',
    //                     'js/controllers/admin/adminSubCtrl.js',
    //                     'assets/global/plugins/datatables/datatables.min.css',
    //                     'assets/global/plugins/datatables/datatables.min.js',
    //                     'assets/pages/scripts/angular-datatables.js'
    //                 ]
    //             });
    //         }]
    //     }
    // })
    
    
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
    // $rootScope.$on('$locationChangeStart', function(event, next, current) {
    //     // redirect to login page if not logged in and trying to access a restricted page
    //     var restrictedPage = $.inArray($location.path(), ['/dashboard']) === -1;
    //     var loggedIn = $cookies.get('globals') ? true : false;
    //     //  console.log(loggedIn);
    //     if (restrictedPage && !loggedIn) {              //console.log($state);
    //         // $location.path('/login');
    //         //   console.log("in iffff");

    //     }
    // });
});

// To logout user forcibly after certain time if no action is performed on application
MetronicApp.run(function($rootScope) {
    // $rootScope.Base_URL = "http://localhost:8000";
    $rootScope.Base_URL = "http://www.9341xie.com:8000";
    var lastDigestRun = new Date();                                             console.log(lastDigestRun);
});