'use strict';

angular.module('lmisApp')
.service('notificationService', function($q, $http){
     var URL = 'http://dev.lomis.ehealth.org.ng:5984/notifications/_design/notifications/_view/all';

    this.load = function() {
     return $http.get(URL)
              .then(function (response) {
                  var data = [];
                 response.data.rows.forEach(function(row){
                     data.push(row.value);
                 });
                return data;
              })
              .catch(function (reason) {
                console.error("notifications unavailable:" + reason);
              })
    }
  });