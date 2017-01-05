var app = (function() {
	
	"use strict";
	
	
	// 
	// functions
	// 
	
	// gets the app up and going
	// this function should be called at the document.ready event
	var init = function(config) {
		app.data.load(config.DATA_URL).then(function() {
			
		}).catch(function(error) {
			
		});
	};
	
	
	// 
	// exports
	// 
	
	return {
		init: init
	};
	
}());
