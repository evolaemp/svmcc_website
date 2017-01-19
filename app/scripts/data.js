app.data = (function() {
	
	"use strict";
	
	
	// 
	// state
	// 
	
	var data = {};
	
	
	// 
	// functions
	// 
	
	// tries to populate the data var by loading the given url and parsing the
	// json that is supposed to come back
	// 
	// returns a promise that resolves empty or rejects with an error message
	var load = function(url) {
		return new Promise(function(resolve, reject) {
			fetch(url).then(function(response) {
				if(response.ok) return response.json();
				else {
					console.error(response.statusText);
					reject('Could not fetch the data');
				}
			}).then(function(jsonData) {
				data = jsonData;
				resolve();
			}).catch(function(error) {
				console.error(error);
				reject('Could not fetch the data');
			});
		});
	};
	
	// returns the [] of all dataset names found in the data
	var getDatasets = function() {
		var key, datasets = [];
		
		for(key in data) {
			if(data.hasOwnProperty(key)) {
				datasets.push(key);
			}
		}
		
		return datasets;
	};
	
	// returns data[name] or throws an error if there is no dataset with the
	// given name
	// 
	// helper for the next two functions
	var getDataset = function(name) {
		if(!data.hasOwnProperty(name)) {
			throw new Error('Unknown dataset');
		}
		
		return data[name];
	};
	
	// returns the [] of all glosses found in the specified dataset
	// throws an error if the dataset does not exist
	// 
	// the glosses are sorted case-insensitively so that abvd's Eight is not
	// the very first gloss the user sees
	var getGlosses = function(dataset) {
		var key, glosses = [];
		
		dataset = getDataset(dataset);
		
		for(key in dataset) {
			if(dataset.hasOwnProperty(key)) {
				glosses.push(key);
			}
		}
		
		glosses = glosses.sort(function(a, b) {
			return String.naturalCompare(a.toLowerCase(), b.toLowerCase());
		});
		
		return glosses;
	};
	
	// returns a [] of {lang, word, expert, lexstat, svm} objects representing
	// the entries for the specified gloss
	// 
	// throws an error if the dataset or the gloss do not exist
	var getGloss = function(dataset, gloss) {
		var data, res = [];
		var i;
		
		dataset = getDataset(dataset);
		
		if(!dataset.hasOwnProperty(gloss)) {
			throw new Error('Unknown gloss');
		}
		data = dataset[gloss];
		
		for(i = 0; i < data.length; i++) {
			res.push({
				lang: data[i][0],
				word: data[i][1],
				expert: data[i][2],
				lexstat: data[i][3],
				svm: data[i][4]
			});
		}
		
		return res;
	};
	
	
	// 
	// exports
	// 
	
	return {
		load: load,
		getDatasets: getDatasets,
		getGlosses: getGlosses,
		getGloss: getGloss
	};
	
}());
