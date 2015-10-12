'use strict';

var q = require('q');
var cradle = require('cradle');
var utility = require('../../components/utility');

var db = new (cradle.Connection)().database('facilities');

// use promises for caching across all requests
var allPromise = null;

db.exists(function(err, exists) {
  if (err) throw err;

  if (!exists)
    db.create(addChangeHandler);
  else
    addChangeHandler();

  function addChangeHandler() {
    // clear cache on db changes
    db.changes().on('change', function() {
      db.cache.purge();
      allPromise = null;
    });
  }
});

function all(cb) {
  var options = {};

  if(arguments[1]){
    options = arguments[1];
  }
  if (!allPromise) {
    var d = q.defer();
    allPromise = d.promise;

    db.all({ include_docs: true }, function(err, rows) {
      if (err)
        d.reject(err);
      else
        d.resolve(rows);
    });
  }

  allPromise
    .then(function(rows) {
      var pluckedRows = utility.removeDesignDocs(rows.toArray());
      if(options.groupBy){
        return cb(_groupBy(options.groupBy, pluckedRows));
      }
      return cb(null, pluckedRows);
    })
    .catch(function(err) {
      allPromise = null;
      cb(err);
    })
}
/**
  * The functions below are designed to multiple parent location
  * values group response by the parent locations supplied
  * @params: parent-location-id(s), callback function optional.  
  **/

function byWard (wardIds, cb) {
  var ids = utility.convertToArray(wardIds), 
    d = q.defer();
  
  db.getView('by_ward',
    {
      include_docs: true,
      keys: ids
    }, 
    function(err, res){
      if(!err){
        return d.resolve(res);
      }
      return d.reject(err);
    }
  )

  return d.promise
    .then(function(response){
      cb(null, utility.removeDesignDocs(response.toArray()));
    })
    .catch(function(err){
      cb(err);
    });
};

function byLga(LgaIds, cb){
  var ids =  utility.convertToArray(LgaIds),
    d = q.defer();

    db.getView('by_lga', {
      include_docs: true,
      keys: ids
    }, 
    function(err, res){
      if(!err){
        return d.resolve(res);
      }
      return d.reject(err);
    });

    d.promise
      .then(function(facilities){
        cb(facilities);
      })
      .catch(function(err){
        cb(err);
      });
};

function byZones(zoneIds, cb){
  var ids =  utility.convertToArray(LgaIds),
    d = q.defer();

    db.getView('by_zone', {
      include_docs: true,
      keys: ids
    }, 
    function(err, res){
      if(!err){
        return d.resolve(res);
      }
      return d.reject(err);
    });

    d.promise
      .then(function(facilities){
        cb(facilities);
      })
      .catch(function(err){
        cb(err);
      });
}
// exports
exports.all = all;
exports.byWard = byWard;
exports.byLga = byLga;
exports.byZone = byZones;


//helpers

function _groupBy (field, facilities){
  var responseData = {}, index;

  for(i in facilities){
      if(!responseData[facilities[i][field]]){
        responseData[index] = [];
      }
      responseData[index].push(facilities[i]);
    }
  }

  return responseData;
}