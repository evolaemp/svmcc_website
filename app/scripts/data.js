app.data = (function() {
	
	"use strict";
	
	
	// 
	// state
	// 
	
	// {dataset: {gloss: [global_id, [lang, word, expert, lexstat, svm]],
	// _langs: {lang: iso}}}
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
	
	// returns a [] of {name, source} objects, one for each dataset
	// 
	// assumes that the datasets are already sorted in the json data: which
	// should be true anyway
	// 
	// the sources are hardcoded.. for the time being at least
	var getDatasets = function() {
		var key, datasets = [];
		var sources = {
			'abvd': 'Greenhill et al, 2008',
			'afrasian': 'Militarev, 2000',
			'bai': 'Wang, 2006',
			'central_asian': 'Manni et al, 2016',
			'chinese_1964': 'Běijīng Dàxué, 1964',
			'chinese_2004': 'Hóu, 2004',
			'huon': 'McElhanon, 1967',
			'ielex': 'Dunn, 2012',
			'japanese': 'Hattori, 1973',
			'kadai': 'Peiros, 1998',
			'kamasau': 'Sanders, 1980',
			'lolo_burmese': 'Peiros, 1998',
			'mayan': 'Brown, 2008',
			'miao_yao': 'Peiros, 1998',
			'mixe_zoque': 'Cysouw et al, 2006',
			'mon_khmer': 'Peiros, 1998',
			'ob_ugrian': 'Zhivlov, 2011',
			'tujia': 'Starostin, 2013'
		}
		
		for(key in data) {
			if(data.hasOwnProperty(key)) {
				datasets.push({name: key, source: sources[key]});
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
			if(dataset.hasOwnProperty(key) && key[0] != '_') {
				glosses.push(key);
			}
		}
		
		glosses = glosses.sort(function(a, b) {
			return String.naturalCompare(a.toLowerCase(), b.toLowerCase());
		});
		
		return glosses;
	};
	
	// returns a [] of {lang, isoCode, word, expert, lexstat, svm} objects
	// representing the entries for the specified gloss
	// 
	// in language names underscores are replaced by spaces in order to avoid
	// cell-breaking in mayan
	// 
	// throws an error if the dataset or the gloss do not exist
	var getGloss = function(dataset, gloss) {
		var data, isoCodes;
		var i, res = [];
		
		dataset = getDataset(dataset);
		
		if(!dataset.hasOwnProperty(gloss)) {
			throw new Error('Unknown gloss');
		}
		data = dataset[gloss];
		isoCodes = dataset._langs;
		
		for(i = 1; i < data.length; i++) {
			res.push({
				lang: data[i][0].replace(/_/g, ' '),
				isoCode: isoCodes[data[i][0]],
				word: prison.plotWord(data[i][1]),
				expert: data[i][2],
				lexstat: data[i][3],
				svm: data[i][4]
			});
		}
		
		return res;
	};
	
	// returns the Concepticon ID of the specified gloss
	// this is stored as the very first element of the gloss data list
	// 
	// throws an error if the dataset or the gloss do not exist
	var getConcepticonId = function(dataset, gloss) {
		dataset = getDataset(dataset);
		
		if(!dataset.hasOwnProperty(gloss)) {
			throw new Error('Unknown gloss');
		}
		
		return dataset[gloss][0];
	};
	
	
	// 
	// exports
	// 
	
	return {
		load: load,
		getDatasets: getDatasets,
		getGlosses: getGlosses,
		getGloss: getGloss,
		getConcepticonId: getConcepticonId
	};
	
}());
