'use strict';



var fs 		= require('fs');
var async 	= require('async');
var plivo 	= require('plivo');




var config = require(__dirname + '/./config.json');
var message = config.message;
var batchSize = config.batch_size;
var sourceFile = config.source_file;

var p = plivo.RestAPI({
  authId: config.auth_id,
  authToken: config.auth_token
});

function sendSms(callback) {
	// comma separated list of phonenumbers with new line
	fs.readFile(sourceFile, 'utf8', function(error, data) {
		if (error) {
			return cb(error);
		}
		var numbers = data.split('\n');
		var batches = generateBatches(numbers, batchSize);
		var asyncTasks = [];
		for (var i=0; i < batches.length; i++) {
			asyncTasks.push(sendSmsToBatch.bind(null, numbers, batches[i], i));
		}
		async.series(asyncTasks, callback);
	});
}

function generateBatches(input, batchSize) {
  var length = ((typeof input == "object")) ? input.length-1 : input;
  var batches = [];
  var from, to;
  for (var offset = 0; offset <= length; offset += batchSize+1) {
    from = offset;
    to = from + batchSize;
    to = ( to > length) ? length : to;
    batches.push({from : from, to : to});
  }
  return batches;
}


function sendSmsToBatch(totalNumbers, batch, index, cb) {
	console.log("SENDING TO BATCH : " + index);

	var from = batch.from;
	var to 	 = batch.to;

	var phoneNumbers = [];
	for (var i=from; i <= to; i++) {
		phoneNumbers.push(totalNumbers[i]);
	}
	var dst = phoneNumbers.join('<');
	var src = config.src;
	var params = {
	    'src': src,
	    'dst' : dst,
	    'text' : message
	};
	p.send_message(params, function (status, response) {
		console.log(status, response);
		if (status != 202) {
			var error = new Error("Something went wrong");
			return cb();
		}
		return cb(null, response);
	});
}

sendSms(console.log);

