
(function() {
    'use strict';

    angular
        .module('MetronicApp')
        .controller('PostEditController', PostEditController);

    PostEditController.$inject = ['PostApiService', 'categoryApiService', 'TagApiService', '$rootScope', '$scope',
        '$state', 'settings', '$cookies', '$stateParams', 'mediaApiService', '$compile', '$timeout', '$translate',
        '$document', 'storeService', '$cacheFactory', '$window'
    ];

    function PostEditController(PostApiService, categoryApiService, TagApiService,
        $rootScope, $scope, $state, settings, $cookies, $stateParams, mediaApiService, $compile, $timeout,
        $translate, $document, storeService, $cacheFactory, $window) {

        $scope.$on('$viewContentLoaded', function() {
            // initialize core components
            App.initAjax();

            // set default layout mode
            $rootScope.settings.layout.pageContentWhite = true;
            $rootScope.settings.layout.pageBodySolid = false;
            $rootScope.settings.layout.pageSidebarClosed = false;


        });
        //////////////////testing///////////////////
        //var vm = this;
        //CKEDITOR.replace('editor1');
        //  CKEDITOR.replace("description");
        //   ck.instances["description"].setData("Contents to be displayed in text area");
        // CKEDITOR.instances['description'].insertHtml('<img src="your image"/>');
        /*   for(var instanceName in CKEDITOR.instances) {
          console.log("in instance");
   console.log( CKEDITOR.instances[instanceName] );
}*/
        $scope.availableLanguages = [
            { id: '36', name: 'EN-US', label: 'en' },
            { id: '108', name: 'Spanish', label: 'sp' }
        ];

        $scope.selectedOption = { id: '36', name: 'EN-US' } //This sets the default value of the select in the ui


        $scope.selectchange = function(lang) {
            $translate.use(lang.label);
            console.log(lang);
        }



       
        $scope.$on('$stateChangeStart', function(event, next, current) {
            $window.localStorage.removeItem("id");
            console.log("in location change");
        });



        ////////////////////////////////////////////////////
        var postid;
        var onePost = {};
        var checked_fruits = [];
        var userData = JSON.parse($cookies.get('globals'));
        //  var postId = $state.params.id;
        console.log($state.params.id);
        if ($state.params.id) {
            $window.localStorage.setItem("id", $state.params.id);
            //  $scope.postId = $state.params.id;
            console.log("storparams" + $state.params.id);
        }

        var loc = $window.localStorage.getItem("id");
        if (loc) {
            $scope.postId = $window.localStorage.getItem("id");
            $state.params.id = $scope.postId;
            console.log("storage" + $scope.postId);
        }


        //  var postId = $stateParams.id;
        // var postId = storeService.get();

        console.log($scope.postId);
        $scope.showReturnBtn = ($scope.postId !== null && $scope.postId !== undefined) ? true : false;

        // $scope.statuses = ['Draft', 'Pending', 'Live', 'Archived', 'Deleted'];
        $scope.selectedStatuses = [];

        loadCategoryList();
        loadMediaList();
        loadTagsList();



        $scope.returnBack = function() {
            $state.go('posts');
        };

        console.log("currentid ---" + $scope.postId)
        if ($scope.postId !== undefined) {
            console.log("in if" + $scope.postId);
            loadOnePost($scope.postId, userData);
        }


        function loadOnePost(postId, userData) {
            PostApiService.GetOnePost($scope.postId, userData)
                .then(function(data) {
                    $scope.onePost = data;
                    console.log($scope.onePost);
                    if (data.categoryList !== undefined) {
                        loadselected(data.categoryList);
                    }
                });
        }

        function loadselected(obj) {
            console.log(obj);
            for (var i = 0; i < obj.length; i++) {
                console.log(obj[i].id)
                    // $scope.selection.push({ 'id':obj[i].id});
                $scope.checked_fruits.push((obj[i].id).toString());
            }
            console.log($scope.selection);
        }

        $scope.update = function() {
            console.log($scope.onePost);
            /* var post = {
                     id: $scope.onePost.id,
                     postContent: $scope.onePost.postContent,
                     postTitle: $scope.onePost.postTitle
                 }*/
            ///
            findselect();
            var obj = updateObject();

            console.log(obj);
            // console.log(post);
            PostApiService.PostUpdate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully updated the record');
                    // $scope.posts = data;

                });

        };
        // $scope.selection = [];

        //$scope.item.checked='124';

        $scope.selectCategory = function(item) {
            console.log("itemid ,", item.id);

            if (item.checked == true) {
                $scope.selection.push({ 'id': item.id });
                // $scope.selection.push(item.id);
            } else {
                // var index = $scope.selection.indexOf(item.id);
                var index = _.findIndex($scope.selection, { 'id': item.id })
                if (index != -1) {
                    $scope.selection.splice(index, 1);
                }
            }
            console.log($scope.selection);
        }

        /* fruit*/
        // $scope.fruits = ['apple', 'orange', 'pear', 'naartjie'];
        $rootScope.checked_fruits = [];
        $rootScope.selection = [];

        function findselect() {


            // $scope.checked_fruits = ["124"];
            var len = $rootScope.checked_fruits.length;
            //var fruits = ["Banana", "Orange", "Apple", "Mango"];
            console.log(len);
            // console.log( $scope.checked_fruits.length);
            //var obj = [{"id":'apple'},{"id":'orange'}, {"id":'pear'},{"id": 'naartjie'}];
            for (var i = 0; i < len; i++) {
                console.log($rootScope.checked_fruits[i]);
                $rootScope.selection.push({ 'id': $rootScope.checked_fruits[i] });
                //  $scope.checked_fruits.push((obj[i].id).toString());
            }
            console.log($scope.selection);
        }

        /** */
        $scope.addTag = function() {
            console.log($scope.list_of_string);
            //console.log($scope.selectedStatuses);
            // console.log(item);
        }

        $scope.list_of_string = ["headline"]
        $scope.select2Options = {
            'multiple': true,
            'simple_tags': true,
            'tags': [] // Can be empty list.
        };
        /* $scope.tags = [
                { id: 0, name: "Zero" },
                { id: 1, name: "One" },
                { id: 2, name: "Two" },
                { id: 3, name: "Three" },
                { id: 4, name: "Four" },
            ];*/

        /*  $scope.noResultsTag = "null";
       
    
        $scope.addTag = function() {
            $scope.tags.push({
                id: $scope.tags.length,
                name: $scope.noResultsTag
            });
        };

        $scope.$watch('noResultsTag', function(newVal, oldVal) {
            console.log(newVal);
            if (newVal && newVal !== oldVal) {
                $timeout(function() {
                    var noResultsLink = $('.select2-no-results');
                    console.log(noResultsLink.contents());
                    $compile(noResultsLink.contents())($scope);
                });
            }
        }, true);
*/

        /*     $scope.fruitSelection = [];

        $scope.toggleSelection = function toggleSelection(selectionName, listSelection) {
            console.log("toggle");
            var idx = listSelection.indexOf(selectionName);

            // is currently selected
            if (idx > -1) {
                listSelection.splice(idx, 1);
            }

            // is newly selected
            else {
                listSelection.push(selectionName);
            }
            console.log(selectionName);
        };

        $scope.toggleInBasket = function(item) {
            $scope.basket.toggle(item);

            console.log(basket.get());

        }
*/
        $scope.save = function() {

            findselect();

            //  console.log($scope.onePost);

            var obj = newPost();
            console.log(obj);
            // console.log($scope.fruitSelection);
            //      
            /*angular.forEach($scope.selection, function (selected, item) {
                   if (selected) {
                       $scope.selection.push(item);
                      console.log(item);
                   }
                   console.log($scope.selection);
               });*/
          PostApiService.PostCreate(userData, obj)
                .then(function(status) {
                    console.log(status);
                    toastr.success('Successfully created the record');
                    // $scope.posts = data;  
                });

        };
        /************** */


        /**/
        function loadCategoryList() {
            var domain = {
                "domain": {
                    "id": 1
                }
            };

            categoryApiService.GetCategoryList(userData, domain)
                .then(function(data) {
                    //console.log(data);
                    var result = transformToTree(data);
                    //  console.log(result);
                    $rootScope.categoryList = result;
                    //  console.log(result);

                });

        }

        /* taglist */
        function loadTagsList() {

            TagApiService.GetTagsList(userData, 1, 50)
                .then(function(data) {
                    //$rootScope.tagslist = data.list;
                    $rootScope.tags = data.list;
                    $scope.entries = data.list;
                   // console.log(data);
                    /*$scope.recordsTotal =data.recordsTotal;
                    $scope.totalpages = Math.ceil(data.recordsTotal / data.pageSize);
                    $scope.itemsPerPage = data.pageSize;
                  */
                    //  console.log("totpages" +  data.pageSize);
                });

        }

        $scope.taglist = [
            { id: 0, name: "Zero" },
            { id: 1, name: "One" },
            { id: 2, name: "Two" },
            { id: 3, name: "Three" },
            { id: 4, name: "Four" },
        ];

        /*  $scope.$watch('searchStr', function(tmpStr) {

              console.log($scope.searchStr);
              if (!tmpStr || tmpStr.length == 0)
                  return 0;
              // if searchStr is still the same..
              // go ahead and retrieve the data
              if (tmpStr == $scope.searchStr) {
                  TagApiService.SearchTagsList(tmpStr, userData)
                      .then(function(data) {
                        
                          $scope.responseData = data;
                          console.log($scope.responseData)
                      });
                  console.log($scope.searchStr);
              }

          });*/
        /*** */
        /*     $scope.$watch('searchText', function(tmpStr) {
                 //debugger;

                 if (!tmpStr || tmpStr.length == 0)
                     return 0;
                 // if searchStr is still the same..
                 // go ahead and retrieve the data
                 if ($scope.searchStr) {
                     TagApiService.SearchTagsList(tmpStr, userData)
                         .then(function(data) {

                             $scope.responseData = data;
                             //console.log($scope.responseData);
                         });
                    // console.log($scope.searchStr);
                 }

             }, true);*/
        /*  $scope.getnew = function(tmpStr){
              if (!tmpStr || tmpStr.length == 0)
                return 0;
            console.log($scope.searchStr);

             if ($scope.searchStr) {
                TagApiService.SearchTagsList(tmpStr, userData)
                    .then(function(data) {

                        $scope.responseData = data;
                        console.log($scope.responseData);
                    });
                console.log($scope.searchStr);
            }



        };
*/
        /*
                $scope.$watch('searchStr', function(tmpStr) {

                    console.log($scope.searchStr);
                    if (!tmpStr || tmpStr.length == 0)
                        return 0;
                    // if searchStr is still the same..
                    // go ahead and retrieve the data
                    if (tmpStr == $scope.searchStr) {
                        TagApiService.SearchTagsList(tmpStr, userData)
                            .then(function(data) {

                                $scope.responseData = data;
                                console.log($scope.responseData)
                            });
                        console.log($scope.searchStr);
                    }

                });
        */

        $scope.items = [1, 2, 3, 4];

        $scope.watchHitCount = 0;
        $scope.$watch('myModel.selectedId', function(newVal, oldVal) {
            console.log(newVal + " " + oldVal);
            $scope.watchHitCount++;
        }, true);

        $scope.load = function() {
                alert('3 characters');
                /* TagApiService.SearchTagsList($scope.searchStr, userData)
                     .then(function(data) {

                         $scope.responseData = data;
                         console.log($scope.responseData)
                     });*/

            }
            /**** */
        function transformToTree(arr) {
            var nodes = {};
            return arr.filter(function(obj) {

                var id = obj.id,
                    parentId = obj.parent.parentId;


                nodes[id] = _.defaults(obj, nodes[id], { children: [] });
                parentId && (nodes[parentId] = (nodes[parentId] || { children: [] }))["children"].push(obj);
                // console.log(nodes);

                return !parentId;
            });
        }





        function newPost() {
            var postObj = {

                "postContent": $scope.onePost.postContent,
                "postTitle": $scope.onePost.postTitle,
                "postExcerpt": "alphgdfa",
                "postStatus": "good",
                "commentStatus": "bad",
                "pingStatus": "ok",
                "postPassword": "123",
                "postName": "root",
                "toPing": "ping",
                "pinged": "pinged",
                "postContentFiltered": "filter",
                "postParent": 0,
                "guid": "efg",
                "menuOrder": 0,
                "postType": "long post",
                "postMimeType": "meme type",
                "commentCount": 1,
                "categoryList": $rootScope.selection,
                "tagList": [],
                /*"domain": {
                    "id": 1
                }*/

            };
            return postObj;
        }

        function updateObject() {
            var postObj = {
                "id": $scope.onePost.id,
                "postContent": $scope.onePost.postContent,
                "postTitle": $scope.onePost.postTitle,

                "categoryList": $rootScope.selection,
                "tagList": []


            };
            return postObj;
        }

        /***/
        /* "language": {
                "id": 1
            },
            "domain": {
                "id": 1
            },

            "categoryList": $scope.selection,
            "tagList": []*/
        /****** Media model *****/



        function loadMediaList() {
            mediaApiService.GetMediaList(userData)
                .then(function(data) {
                    $rootScope.medialist = data;
                    // console.log(data);
                });

        }
        $scope.selected = {};

        $scope.addToPost = function() {

                // document.getElementById("description").innerHTML = "Paragraph changed!";
                var obj = $scope.selected.item;
                console.log(obj);
                var url = obj.src;
                var content_type = obj.contentType;
                if (content_type == 'image/jpeg' || content_type == 'image/png') {
                    //  console.log('<img src="+'url'+"/>');
                    CKEDITOR.instances['description'].insertHtml('<img src="' + url + '"/>');
                } else if(content_type == 'application/pdf'){
                     CKEDITOR.instances['description'].insertHtml('<a href='+url+'>'+obj.fileName+'</a>' );
                }else{
                    //console.log(url);
                    CKEDITOR.instances['description'].insertHtml('<video controls src="' + url + '"></video>');
                }
            }
            /////
        $scope.clearSelection = function() {

            $scope.selected = {};

        }
        $scope.merchants = ['merchant_1', 'merchant_2', 'merchant_3'];


        $scope.getTags = function(name) {
            console.log("in tags");
            var taglist = [
                { id: 0, name: "Zero" },
                { id: 1, name: "One" },
                { id: 2, name: "Two" },
                { id: 3, name: "Three" },
                { id: 4, name: "Four" },
            ];
            for (var i = taglist.length; i--;) {
                var tagName = taglist[i].name;
                if ($scope.interests.indexOf(tagName) !== -1) taglist.splice(i, 1);
                else taglist[i] = tagName;
            }
            return taglist;


        };

        $scope.interests = [];
        $scope.removeInterest = function(id) {
            console.log(id);
            $scope.interestLimit = false;
            $scope.interests.splice(id, 1);
        }

        $scope.addInterest = function() {
            if ($scope.interestLimit) return;

            var element = $document[0].getElementById('tagInsert'),
                value = element.value.split(',');
            console.log(value);
            if (value.length) {
                element.value = '';
                for (var i = 0; i < value.length; i++) {
                    if ($scope.interestLimit) break;
                    if ($scope.interests.indexOf(value[i]) === -1) {
                        $scope.interests.push(value[i]);
                        $scope.interestLimit = $scope.interests.length === 10;
                    }
                }
            }
            $scope.getTags("zero");

        };
        /*
         $scope.addInterestOnEvent = function (value ,event) {
             console.log(value);
                if (event.which !== 13) return;
                event.preventDefault();
                $scope.addInterest();
            };
        */
        $scope.remove = function() {
            $scope.confirmModal = Modal.confirm.delete(function() {
                User.remove(function() {
                    submit = true;
                    Auth.logout();
                    $location.path('/');
                });
            })('votre compte');
        };
        /** */




    }

})();