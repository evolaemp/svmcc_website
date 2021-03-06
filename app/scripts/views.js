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
	
	// expects a [] of {}, a property that all the objects have to cluster
	// against, and another property which all the objects will receive
	// 
	// returns the given [] modified, with the second property assigned to
	// either 'odd' or 'even' depending on the cluster
	var cluster = function(li, prop, clusterProp) {
		var i, last = null, cluster = 0;
		
		for(i = 0; i < li.length; i++) {
			if(li[i][prop] !== last) {
				last = li[i][prop];
				cluster += 1;
			}
			
			li[i][clusterProp] = (cluster % 2) ? 'odd' : 'even';
		}
		
		return li;
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
			createGloss(glossViewElem, dataset, value);
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
		
		// init a gloss view with the first gloss
		searchField.typeahead('val', glosses[0]);
		createGloss(glossViewElem, dataset, glosses[0]);
	};
	
	// creates a gloss view
	// this is the table displaying the entries for a gloss
	var createGloss = function(elem, dataset, gloss) {
		var entries = app.data.getGloss(dataset, gloss);
		
		render(elem, 'gloss-templ', {
			'dataset': dataset,
			'gloss': gloss,
			'concepticonId': app.data.getConcepticonId(dataset, gloss),
			'numWords': entries.length
		});
		
		var table = $(elem).find('table');  // jquery elem!
		var tbody = elem.querySelector('tbody');  // dom elem!
		
		var update = function(orderBy, rows) {
			rows = cluster(rows, orderBy, 'cluster');
			render(tbody, 'entries-templ', {rows: rows});
		};
		
		table.find('th[data-order]').on('click', function(e) {
			var orderBy = e.target.dataset.order;
			
			entries.sort(function(a, b) {
				var x = String.naturalCompare(a[orderBy], b[orderBy]);
				return (x == 0) ? String.naturalCompare(a.lang, b.lang) : x;
			});
			
			update(orderBy, entries);
			
			table.find('th.chosen-th').removeClass('chosen-th');
			e.target.classList.add('chosen-th');
		});
		
		table.find('th[data-order]').first().click();
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
