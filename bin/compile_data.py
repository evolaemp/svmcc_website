import argparse
import collections
import csv
import json
import os



def get_datasets(datasets_dir):
	"""
	Returns the sorted [] of (name, path) tuples of the dataset files found in
	the given directory.
	"""
	res = []
	
	for item in os.listdir(datasets_dir):
		path = os.path.join(datasets_dir, item)
		item = item.split('.')
		if len(item) == 2 and os.path.isfile(path) and item[1] == 'tsv':
			res.append((item[0], path))
	
	return sorted(res)



def get_inferred(inferred_dir, suffix):
	"""
	Returns the sorted [] of (name, path) tuples of the inferred files found in
	the given directory. The suffix is one of ('lsCC', 'svmCC').
	"""
	res = []
	
	for item in os.listdir(inferred_dir):
		path = os.path.join(inferred_dir, item)
		item = item.split('.')
		if os.path.isfile(path) and len(item)==3 and item[1]==suffix and item[2]=='csv':
			res.append((item[0], path))
	
	return res



def read_dataset(dataset_path):
	"""
	Returns the {gloss: [[lang, trans, cog_class],]} dict of the given dataset.
	"""
	data = collections.defaultdict(list)
	
	with open(dataset_path, newline='', encoding='utf-8') as f:
		reader = csv.DictReader(f, delimiter='\t')
		for row in reader:
			li = [row['language'], row['transcription'], row['cognate_class']]
			if li not in data[row['gloss']]:
				data[row['gloss']].append(li)
	
	return dict(data)



def read_inferred(inferred_path):
	"""
	Returns the {(gloss, lang, transcription): inferred_cog_class} dict of the
	specified inferred file. The inferred cognate class is either the
	inferredCC or lpID column, whichever is present.
	"""
	data = {}
	
	with open(inferred_path, newline='', encoding='utf-8') as f:
		reader = csv.DictReader(f)
		[row for row in reader]
	
	if 'inferredCC' in reader._fieldnames:
		inferred_col = 'inferredCC'
	elif 'lpID' in reader._fieldnames:
		inferred_col = 'lpID'
	else:
		raise ValueError('Could not infer the inferred class: {}'.format(path))
	
	with open(inferred_path, newline='', encoding='utf-8') as f:
		reader = csv.DictReader(f)
		for row in reader:
			key = (row['concept'], row['doculect'], row['counterpart'])
			cog_class = row[inferred_col].split(':')
			cog_class = cog_class[-1] if len(cog_class) == 3 else cog_class[0]
			data[key] = cog_class
	
	return data



def enrich_data(data, inferred_files):
	"""
	Expects a {dataset: {gloss: [[lang, trans, cog_class]]}} dict and a [(name,
	path)] list of the inferred files. Returns the data dict, but with each
	list having the respective inferred cognate class appended.
	"""
	for name in data.keys():
		try:
			path = next((item[1]
				for item in inferred_files if item[0] == name))
		except StopIteration:
			raise ValueError('Could not find the inferred file for {}'.format(name))
		
		inferred = read_inferred(path)
		
		for gloss in data[name].keys():
			for li in data[name][gloss]:
				key = (gloss, li[0], li[1])
				
				if key not in inferred:
					key = (gloss, li[0], '')  # fix for huon
					if key not in inferred:
						raise ValueError((
							'Could not find the inferred class for '
							'{}:{}:{} in {}'.format(li[0], gloss, li[1], path)))
				
				li.append(inferred.pop(key))
		
		if inferred:
			raise ValueError((
				'More inferred classes than expected in {}: '
				'{s}'.format(path, inferred)))
	
	return data



def compile_data(datasets_dir, inferred_dir, output_path):
	"""
	Returns a helpful string reporting the number of entries taken from each
	dataset for the json output.
	"""
	data = {}
	counts = {}
	
	for name, path in get_datasets(datasets_dir):
		data[name] = read_dataset(path)
		counts[name] = sum([len(li) for li in data[name].values()])
	
	enrich_data(data, get_inferred(inferred_dir, 'lsCC'))
	enrich_data(data, get_inferred(inferred_dir, 'svmCC'))
	
	with open(output_path, 'w', encoding='utf-8') as f:
		json.dump(data, f, ensure_ascii=False, sort_keys=True)
	
	return '\n'.join([
		'{}: {} entries'.format(name, counts[name])
		for name in sorted(counts.keys())] + ['wrote {}'.format(output_path)])



"""
The cli
"""
if __name__ == '__main__':
	parser = argparse.ArgumentParser(description=(
		'compiles the webapp\'s json data'))
	parser.add_argument('datasets_dir', help=(
		'the directory from which to read the datasets'))
	parser.add_argument('inferred_dir', help=(
		'the directory from which to read the inferred files'))
	parser.add_argument('--output-path', default='app/data/data.json', help=(
		'where the compiled json data will be written; '
		'defaults to app/data/data.json'))
	
	args = parser.parse_args()
	print(compile_data(args.datasets_dir, args.inferred_dir, args.output_path))
