'use strict';

var Facility = require('./facility.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');


// get list of facilities
exports.index = function(req, res, next) {
	var options = {};
	if(req.query){
		if(req.query.ward || req.query.wards){
			return Facility.byWard(req.query.wards, utility.replyWithAuth);
		}else if(req.query.lga || req.query.lgas){
			return Facility.byLga(req.query.wards, utility.replyWithAuth);
		}else if(req.query.zone || req.query.zones){
			return Facility.byZone(req.query.wards, utility.replyWithAuth);
		}

		if(req.query['group-by']){
			options.groupBy = req.query['group-by'];
		}
	}

  return Facility.all(utility.replyWithAuth, options);
};

// get unrestricted list of facilities (not filtered by access rights)
exports.unrestricted = function(req, res, next) {
  return Facility.all(utility.replyNoAuth);
};
