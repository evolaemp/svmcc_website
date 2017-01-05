var app = (function() {
	
	"use strict";
	
	
	// 
	// functions
	// 
	
	// gets the app up and going
	// this function should be called at the document.ready event
	var init = function(config) {
		var viewElem = document.getElementById('data-view');
		
		app.data.load(config.DATA_URL).then(function() {
			app.views.data(viewElem);
		}).catch(function(error) {
			app.views.error(viewElem, error);
		});
	};
	
	
	// 
	// exports
	// 
	
	return {
		init: init
	};
	
}());
