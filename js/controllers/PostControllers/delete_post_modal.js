(function() {
  'use strict';

  var module = angular.module('MetronicApp');

  module.service('deletePostModal', deletePostModal);

  deletePostModal.$inject = ['$http'];
  function deletePostModal($http,$scope, $modal) {
    var that = this;
    this.modalOptions = {
      closeButtonText: 'Cancel',
      actionButtonText: 'Delete',
      headerText: 'Confirm post deletion',
      bodyText: 'The post will be deleted permanently, do you want to continue?'
    };
    this.modalDefaults = {
      windowClass: 'small-modal'
    };

    this.getDeleteMethod = function(id) {
    //  return function(post) {
       console.log("postid"+id);
        //$scope.showModal = true;
    }
 
    }
  
  
})();
