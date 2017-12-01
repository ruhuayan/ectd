/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function(event) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function() {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });

            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function() {
    return {
        link: function(scope, elem) {
            elem.dropdownHover();
        }
    };
});

//Ckeditor directive .Helps to bind values using ng-bind

MetronicApp.directive('ckEditor', function() {
    return {
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0]);

            if (!ngModel) return;

            ck.on('pasteState', function() {
                /* scope.$apply(function() {
                     ngModel.$setViewValue(ck.getData());
                 });*/
            });
            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);
            ck.on('instanceReady', updateModel);
            ck.on('instanceReady', function() {
                ck.setData(ngModel.$viewValue);
            });

            function updateModel() {
                scope.$apply(function() {
                    if (ck.getData().length) {
                        ngModel.$setViewValue(ck.getData());
                    }
                });
            }

            scope.$watch(attr.ckEditor, function(value) {
                ck.setData(ngModel.$viewValue);
                // ngModel.$setViewValue(ck.getData());
            });
            /*  for(var instanceName in CKEDITOR.instances) {
          console.log("in instance");
   console.log( CKEDITOR.instances[instanceName] );
}*/

            ngModel.$render = function(value) {
                //console.log("in change");
                ck.setData(ngModel.$viewValue);
            };
            ngModel.$render();
        }

    };
});


MetronicApp.directive('collection', function() {
    return {
        restrict: "E",
        replace: true,
        scope: {
            collection: '='
        },
        template: "<ul style='list-style-type:none;'><children ng-repeat='child in collection' child='child'></children></ul>"
    }
});
MetronicApp.directive('children', function($compile) {
    return {
        restrict: "E",
        replace: true,
        scope: {
            child: '=',
            selectCategory: '&'
        },
        template: "<li><input type='checkbox' ng-model='child.checked' ng-value='child.data.termName' ng-click='selectCategory(child)'/>{{child.data.termName}}</label></li>",
        link: function(scope, element, attrs) {

            if (angular.isArray(scope.child.children)) {

                $compile('<collection collection="child.children"></collection>')(scope, function(cloned, scope) {

                    element.append(cloned);

                });
            }
        }
    }
});

MetronicApp.directive('test', function() {
    return {
        restrict: 'E',
        scope: {
            color1: '=',
            updateFn: '&'
        },
        // object is passed while making the call
        template: "<button ng-click='updateFn({msg : \"Hello World!\"})'>Click</button>",
        replace: true,
        link: function(scope, elm, attrs) {}
    }
});



MetronicApp.directive('dropzone', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var config = {
                url: 'http://localhost/upload',
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
                autoProcessQueue: false
            };

            var eventHandlers = {
                'addedfile': function(file) {
                    scope.file = file;
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function() {
                        scope.fileAdded = true;
                    });
                },

                'success': function(file, response) {}

            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function(handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function() {
                dropzone.processQueue();
            };

            scope.resetDropzone = function() {
                scope.file = null;
                dropzone.removeAllFiles();
            }

            scope.processQueue = function() {
                console.log(scope.file);
            }
        }
    }
});
// to check password match
MetronicApp.directive('passwordCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {  
            var me = attrs.ngModel;
            var matchTo = attrs.passwordCheck, matchValue;                             //console.log(me, matchTo);
            scope.$watch(matchTo, function(value){
                matchValue = value;
            });
            scope.$watch( me, function(value){                                  //console.log(matchValue, value);
                ngModel.$setValidity('match', value == matchValue );
            });  
      }
    };
});
//password contain one number, one capital letter, one special charcter, length 6-16
MetronicApp.directive('charCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {  
            var me = attrs.ngModel;
            var reg = /^(?=.*\d)(?=.*[A-Z])(?=.*\W).{6,16}$/;
            scope.$watch( me, function(value){                                  //console.log(value);
                if(value!=undefined) ngModel.$setValidity('character', reg.test(value));
                else ngModel.$setValidity('character', true);
            });  
        }
    };
});

MetronicApp.directive("appNumberCheck", function(){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {  
            var me = attrs.ngModel;
            
            scope.$watch(me, function(value){                                   //console.log(value);
                var submissions = scope.submissions; unique = true; 
                if(value!=undefined && submissions && submissions.length){
                    for (var i in submissions){                               //console.log(submissions[i], scope.formData.appUid)
                        if(submissions[i].appUid !== scope.formData.appUid &&value == submissions[i].folder) unique = false;
                    }
                               
                }

                ngModel.$setValidity('unique', unique);
            });
            
        }
    };
});
// to check if input is numberic and certain length
MetronicApp.directive('numbericCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {  
            var me = attrs.ngModel;
            var len = attrs.numbericCheck || null;                                      //console.log(len);
            scope.$watch(me, function(value){                                   //console.log(value);
                if(value!=undefined) {
                    if(len) ngModel.$setValidity('numberic', isStringNumberic(value) && value.length == len );
                    else ngModel.$setValidity('numberic', isStringNumberic(value));
                }else ngModel.$setValidity('numberic', true);
            });
            var isStringNumberic = function(s){
                    var x = + s;                                         
                    return x === parseInt(s);
            };
        }
    };
});

Metronic.directive("expandable", function(){
    return{
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            var newClass = attrs.expandable;
            //if(scope.) 
            
        }
    }
});

MetronicApp.filter('trustUrl', function($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
});

MetronicApp.directive('checkList', function() {
    return {
        scope: {
            list: '=checkList',
            value: '@'
        },
        link: function(scope, elem, attrs) {
            var handler = function(setup) {
                var checked = elem.prop('checked');
                var index = scope.list.indexOf(scope.value);

                if (checked && index == -1) {
                    if (setup) elem.prop('checked', false);
                    else scope.list.push(scope.value);
                } else if (!checked && index != -1) {
                    if (setup) elem.prop('checked', true);
                    else scope.list.splice(index, 1);
                }
            };

            var setupHandler = handler.bind(null, true);
            var changeHandler = handler.bind(null, false);

            elem.on('change', function() {
                scope.$apply(changeHandler);
            });
            scope.$watch('list', setupHandler, true);
        }
    };
});

MetronicApp.filter('stringToDate', function($filter) {
    return function(ele, dateFormat) {
        return $filter('date')(new Date(ele), dateFormat);
    }
});

MetronicApp.filter('merchantFilter', function() {
    
    return function(tags, searchText) {
      //  console.log(responseData);
        if (!searchText) return null;
       var searchTerms = searchText.split(',');
        searchTerms = searchTerms.map(function(term) {
            return term.trim();
        })
        var returnedArray = [];
        _.forEach(tags, function(merchant) {
            if (_.find(searchTerms, function(term) {
                    return merchant.data.termName.indexOf(term) > -1;
                })) {
                returnedArray.push(merchant)
            }
        })
        return returnedArray;
    }
});

MetronicApp.directive('phoneInput', function($filter, $browser) {
    return {
        require: 'ngModel',
        link: function($scope, $element, $attrs, ngModelCtrl) {
            var len = parseInt($attrs.phoneInput) || 11; 
            /*$scope.$watch($attrs.ngModel, function(value){                                   //console.log(value);
                if(value!=undefined) {
                    if(len) ngModelCtrl.$setValidity('numberic', value.length == len );
                }else ngModelCtrl.$setValidity('numberic', true);
            });*/
            
            var listener = function() {
                var value = $element.val().replace(/[^0-9]/g, '');
                $element.val($filter('tel')(value, false));                     
                //if(len) ngModelCtrl.$setValidity('numberic',   value.length >= len-1 );console.log(value.length, len);
            };

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function(viewValue) {
                return viewValue.replace(/[^0-9]/g, '').slice(0,len);
            });
            
            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function() {
                $element.val($filter('tel')(ngModelCtrl.$viewValue, false));
            };

            $element.bind('change', listener);
            $element.bind('keydown', function(event) {
                var key = event.keyCode;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 91 || (15 < key && key < 19) || (37 <= key && key <= 40)){
                    return;
                }
                $browser.defer(listener); // Have to do this or changes don't get picked up properly
            });

            $element.bind('paste cut', function() {
                $browser.defer(listener);
            });
        }

    };
});
MetronicApp.filter('tel', function () {
    return function (tel) {
        //console.log(tel);
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 1:
            case 2:
            case 3:
                city = value;
                break;

            default:
                city = value.slice(0, 3);
                number = value.slice(3);
        }

        if(number){
            if(number.length>3){
                number = number.slice(0, 4) + '-' + number.slice(4,8);
            }
            else{
                number = number;
            }

            return ("(" + city + ") " + number).trim();
        }
        else{
            return "(" + city;
        }

    };
});
