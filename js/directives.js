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
// to check if input is numberic and certain length
MetronicApp.directive('numbericCheck', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModel) {  
            var me = attrs.ngModel;
            var len = attrs.numbericCheck ? attrs.numbericCheck : null;                                      //console.log(len);
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


//does not work;
MetronicApp.filter('phonenumber', function() {
	    /* 
	    Format phonenumber as: c (xxx) xxx-xxxx
	    	or as close as possible if phonenumber length is not 10
	    	if c is not '1' (country code not USA), does not use country code
	    */
	    
	    return function (number) {
		    /* 
		    @param {Number | String} number - Number that will be formatted as telephone number
		    Returns formatted number: (###) ###-####
		    	if number.length < 4: ###
		    	else if number.length < 7: (###) ###
 
		    Does not handle country codes that are not '1' (USA)
		    */
	        if (!number) { return ''; }
 
	        number = String(number);
 
	        // Will return formattedNumber. 
	        // If phonenumber isn't longer than an area code, just show number
	        var formattedNumber = number;
 
			// if the first character is '1', strip it out and add it back
			var c = (number[0] == '1') ? '1 ' : '';
			number = number[0] == '1' ? number.slice(1) : number;
 
			// # (###) ###-#### as c (area) front-end
			var area = number.substring(0,3);
			var front = number.substring(3, 6);
			var end = number.substring(6, 10);
 
			if (front) {
				formattedNumber = (c + "(" + area + ") " + front);	
			}
			if (end) {
				formattedNumber += ("-" + end);
			}
			return formattedNumber;
	    };
	});