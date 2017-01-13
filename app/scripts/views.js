app.views = (function() {
	
	"use strict";
	
	
	// 
	// helpers
	// 
	
	// replaces the contents of the given dom element with the given template,
	// rendered with the given context
	var render = function(elem, templateID, context) {
		var templateElem, rendered;
		
		templateElem = document.getElementById(templateID);
		rendered = Mustache.render(templateElem.innerHTML, context);
		
		elem.innerHTML = rendered;
	};
	
	
	// 
	// view constructors
	// 
	// these functions take a dom element as their first argument and render
	// the respective view within that element
	// 
	
	// creates a data view
	// this includes the choose-dataset buttons and a dataset view
	// 
	// assumes that app.data is already loaded
	var createData = function(elem) {
		render(elem, 'data-templ', { datasets: app.data.getDatasets() });
		
		var datasetViewElem = document.getElementById('dataset-view');
		var buttons = $('button[data-fn=choose-dataset]');
		
		buttons.on('click', function(e) {
			var clicked = $(e.target);
			buttons.removeClass('clicked');
			clicked.addClass('clicked');
			createDataset(datasetViewElem, clicked.data('set'));
		});
		
		buttons.first().click();
	};
	
	// creates a dataset view
	// this includes the choose-gloss search bar and a gloss view
	var createDataset = function(elem, dataset) {
		var glosses = app.data.getGlosses(dataset);
		
		render(elem, 'dataset-templ', {dataset: dataset});
		
		var glossViewElem = document.getElementById('gloss-view');
		var searchField = $('[data-fn=choose-gloss]');
		var radioButtons = $('[name=switch]');
		
		searchField.typeahead({minLength: 0, highlight: true}, {
			name: 'glosses',
			source: function(query, callback) {
				if(!query) {
					callback(glosses);
					return;
				}
				
				var regex = new RegExp(query, 'i');
				
				callback(glosses.filter(function(item) {
					return regex.test(item);
				}));
			},
			async: false,
			limit: 666
		});
		
		searchField.on('typeahead:select typeahead:autocomplete', function(e, value) {
			createGloss(glossViewElem, dataset, value,
					radioButtons.filter(':checked').val());
		});
		
		// make enter work as expected
		// https://github.com/twitter/typeahead.js/issues/1474
		searchField.on('keydown', function(e) {
			if(e.which == 13) {
				var selectables = searchField.siblings('.tt-menu').find('.tt-selectable');
				if(selectables.length > 0) {
					selectables.first().trigger('click');
				}
				searchField.typeahead('close');
			}
		});
		
		// change the gloss view on changing the radio buttons
		radioButtons.on('change', function(e) {
			createGloss(glossViewElem, dataset,
					searchField.typeahead('val'),
					radioButtons.filter(':checked').val());
		});
		
		// init a gloss view with the first gloss and expert cognate classes
		searchField.typeahead('val', glosses[0]);
		createGloss(glossViewElem, dataset, glosses[0], 'expert');
	};
	
	// creates a gloss view
	// this is the table displaying the lang:word pairs for a specific gloss
	// and inference method
	var createGloss = function(elem, dataset, gloss, inference) {
		render(elem, 'gloss-templ', {
			cogs: app.data.getGloss(dataset, gloss, inference)
		});
	};
	
	// creates an error view
	// this would be invoked in app.init if app.data fails to load
	var createError = function(elem, error) {
		render(elem, 'error-templ', {error: error});
	};
	
	
	// 
	// exports
	// 
	
	return {
		data: createData,
		error: createError
	};
	
}());
