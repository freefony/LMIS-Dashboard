'use strict';

exports.isNotDesignDoc = function isNotDesignDoc(doc) {
  return doc && doc._id && doc._id.substr(0, 7) !== '_design';
};

exports.removeDesignDocs = function removeDesignDocs(docs) {
  if (!docs || !docs.length)
    return docs;

  return docs.filter(exports.isNotDesignDoc);
};

exports.parseBool = function parseBool(value) {
  return (value === true || value === 'true' || value === '1' || value === 1);
};

exports.isArray = function isArray (obj){
	return obj instanceof Array;
};

exports.convertToArray = function convertToArray (obj){
	if(isArray(obj)){
		return obj;
	}
	return obj.split(',');
}

exports.replyNoAuth = function(err, facilities) {
  if (err) return err;

  res.json(facilities);
};

exports.replyWithAuth = function(err, facilities) {
  if (err) return err;

  res.json(auth.filterByFacilities(req, facilities, '_id'));
}
