'use strict';

angular.module('lmisApp')
.config(function($routeProvider){
    $routeProvider
      .when('/notifications', {
        templateUrl: 'app/notifications/notifications.html',
        controller: 'notificationsCtrl'
      })
  })
.controller('notificationsCtrl', function($scope, $q, notificationService){
    $scope.notifications = [];
    notificationService.load()
      .then(function(res){
        $scope.notifications = res;
      })

  });