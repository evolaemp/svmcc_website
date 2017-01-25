var app = (function() {
	
	"use strict";
	
	
	// 
	// functions
	// 
	
	// gets the app up and going
	// this function should be called at the document.ready event
	var init = function(config) {
		var viewElem = document.getElementById('explore');  // dom elem
		
		app.data.load(config.DATA_URL).then(function() {
			app.views.data(viewElem);
		}).catch(function(error) {
			app.views.error(viewElem, error);
		});
		
		document.getElementById('arrow-down').addEventListener('click', function(e) {
			e.preventDefault();
			viewElem.scrollIntoView({behavior: 'smooth'});
		});
	};
	
	
	// 
	// exports
	// 
	
	return {
		init: init
	};
	
}());
