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
	var getGlosses = function(dataset) {
		var key, glosses = [];
		
		dataset = getDataset(dataset);
		
		for(key in dataset) {
			if(dataset.hasOwnProperty(key)) {
				glosses.push(key);
			}
		}
		
		return glosses;
	};
	
	// returns a [] of {cogClass, entries} objects where the entries are []s of
	// {lang, word} objects
	// 
	// throws an error if the dataset or the gloss do not exist
	var getGloss = function(dataset, gloss) {
		var glossData, i, cog, cogs = {}, keys, res = [];
		
		dataset = getDataset(dataset);
		
		if(!dataset.hasOwnProperty(gloss)) {
			throw new Error('Unknown gloss');
		}
		glossData = dataset[gloss];
		
		for(i = 0; i < glossData.length; i++) {
			cog = glossData[i][2].toString();
			
			if(!cogs.hasOwnProperty(cog)) {
				cogs[cog] = [];
			}
			
			cogs[cog].push({lang: glossData[i][0], word: glossData[i][1]});
		}
		
		keys = Object.keys(cogs).sort();
		for(i = 0; i < keys.length; i++) {
			cog = keys[i];
			res.push({cogClass: cog, entries: cogs[cog]});
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
