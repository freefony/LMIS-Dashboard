'use strict';

angular.module('lmisApp')
  .factory('Facility', function ($rootScope, $q, couchdb, utility) {
    var DB_NAME = 'facilities';
    var allPromise = null;
    var names = [];

    $rootScope.$on('currentUserChanged', function() {
      allPromise = null;
    });

    function getAll(){
      var deferred = $q.defer();
      couchdb.allDocs({_db: DB_NAME}).$promise
        .then(function (data) {
          deferred.resolve(data.rows);
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    }

    function getAllObject() {
      var deferred = $q.defer();
      getAll()
        .then(function (data) {
          deferred.resolve(utility.castArrayToObject(data, 'id'));
        })
        .catch(function (reason) {
          deferred.reject(reason);
        });
      return deferred.promise;
    }

    return {
      /**
       * Read data from db and arrange it as a hash of uuid -> facility
       */
      all: function (reload) {
        if (!reload && allPromise)
          return allPromise;

        var d = $q.defer();
        allPromise = d.promise;
        names = [];

        couchdb.allDocs({_db: DB_NAME}).$promise
          .then(function (response) {
            var facilities = {};
            response.rows.forEach(function (row) {
              facilities[row.doc.uuid] = row.doc;
              if (names.indexOf(row.doc.name) < 0)
                names.push(row.doc.name);
            });

            names.sort();
            d.resolve(facilities);
          })
          .catch(function (error) {
            console.log(error);
            allPromise = null;
            d.reject(error);
          });

        return d.promise;
      },
      /**
       * Returns data as array of names.
       */
      names: function (filter, reload) {
        var d = $q.defer();
        var pattern = (filter && filter.length) ? new RegExp(filter, 'i') : null;
        this.all(reload)
          .then(function () {
            d.resolve(pattern ? names.filter(function (name) {
              return pattern.test(name);
            }) : names);
          })
          .catch(function (error) {
            d.reject(error);
          });

        return d.promise;
      },
      getObjects: getAllObject
    };
  });
