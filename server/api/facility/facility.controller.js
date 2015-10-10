'use strict';

var Facility = require('./facility.model');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');


// get list of facilities
exports.index = function(req, res, next) {
	
	if(req.query){
		if(req.query.ward || req.query.wards){
			Facility.byWard(req.query.wards, utility.replyWithAuth);
		}
	}
  Facility.all(utility.replyWithAuth);
};

// get unrestricted list of facilities (not filtered by access rights)
exports.unrestricted = function(req, res, next) {
  Facility.all(utility.replyNoAuth);
};
